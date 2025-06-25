import * as fs from 'fs';
import * as path from 'path';
import consola from 'consola';

export async function exportSimpleApiDocumentation(): Promise<void> {
  try {
    consola.start('Bắt đầu export tài liệu API (Simple)...');
    
    const srcPath = path.join(process.cwd(), 'src');
    let adocContent = generateHeader();
    
    // Quét controllers
    const controllerFiles = findControllerFiles(srcPath);
    consola.info(`Tìm thấy ${controllerFiles.length} controller files`);
    
    for (const file of controllerFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      adocContent += parseController(content, file);
    }
    
    // Quét DTOs  
    adocContent += '\n== Data Transfer Objects (DTOs)\n\n';
    const dtoFiles = findDtoFiles(srcPath);
    consola.info(`Tìm thấy ${dtoFiles.length} DTO files`);
    
    for (const file of dtoFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      adocContent += parseDto(content, file);
    }
    
    // Ghi file
    const outputPath = path.join(process.cwd(), 'api-documentation.adoc');
    fs.writeFileSync(outputPath, adocContent, 'utf-8');
    
    consola.success(`Tài liệu API đã được export thành công: ${outputPath}`);
    
  } catch (error) {
    consola.error('Lỗi khi export tài liệu:', error);
    throw error;
  }
}

function generateHeader(): string {
  const timestamp = new Date().toLocaleString('vi-VN');
  
  return `= EFIN API Documentation
:toc: left
:toclevels: 3
:sectnums:
:source-highlighter: highlight.js
:icons: font

Tài liệu API được tạo tự động vào: ${timestamp}

== Tổng quan

Tài liệu này cung cấp thông tin chi tiết về tất cả REST API endpoints trong hệ thống EFIN backend.

== Xác thực

Hầu hết các endpoints yêu cầu xác thực thông qua JWT Bearer token. Các endpoints công khai sẽ được đánh dấu rõ ràng.

== API Endpoints

`;
}

function findControllerFiles(dir: string): string[] {
  const files: string[] = [];
  
  function walk(currentDir: string): void {
    if (!fs.existsSync(currentDir)) return;
    
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.controller.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function findDtoFiles(dir: string): string[] {
  const files: string[] = [];
  
  function walk(currentDir: string): void {
    if (!fs.existsSync(currentDir)) return;
    
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.dto.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function parseController(content: string, filePath: string): string {
  let result = '';
  
  // Extract controller name
  const controllerMatch = content.match(/export\s+class\s+(\w+Controller)/);
  const controllerName = controllerMatch ? controllerMatch[1] : path.basename(filePath);
  
  // Extract API tags
  const tagsMatch = content.match(/@ApiTags\(['"`]([^'"`]+)['"`]\)/);
  const tags = tagsMatch ? tagsMatch[1] : controllerName.replace('Controller', '');
  
  // Extract base path
  const basePath = extractBasePath(content, filePath);
  
  result += `=== ${tags}\n\n`;
  
  // Find all HTTP methods
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.match(/@(Get|Post|Put|Patch|Delete)/)) {
      const methodInfo = extractMethodInfo(lines, i, basePath);
      if (methodInfo) {
        result += formatMethod(methodInfo);
      }
    }
  }
  
  return result;
}

function extractBasePath(content: string, filePath: string): string {
  // Look for @Controller decorator
  const controllerMatch = content.match(/@Controller\([^)]*\)/);
  if (!controllerMatch) return '';
  
  // Check if it uses SysHelper.getPath
  if (controllerMatch[0].includes('SysHelper.getPath')) {
    // Extract the subPath parameter from SysHelper.getPath
    const sysHelperMatch = controllerMatch[0].match(/SysHelper\.getPath\([^,]*,\s*['"`]([^'"`]*)['"`]/);
    if (sysHelperMatch) {
      const subPath = sysHelperMatch[1];
      // Generate path based on file structure
      const pathFromModule = generateApiPathFromFile(filePath, subPath);
      return pathFromModule;
    }
  }
  
  // Check for simple string path
  const simplePathMatch = controllerMatch[0].match(/@Controller\(['"`]([^'"`]*)['"`]\)/);
  if (simplePathMatch) {
    return simplePathMatch[1];
  }
  
  return '';
}

function generateApiPathFromFile(filePath: string, subPath: string): string {
  // Convert file path to API path similar to SysHelper.getPath
  const normalizedPath = filePath.replace(/\\/g, '/');
  const moduleIndex = normalizedPath.indexOf('module');
  
  if (moduleIndex === -1) return `/${subPath}`;
  
  const relativePath = normalizedPath.substring(moduleIndex + 'module'.length);
  const pathSegments = relativePath.split('/').filter(segment => 
    segment && segment !== 'controller' && !segment.endsWith('.ts')
  );
  
  // Remove duplicate segments (e.g., auth appearing twice)
  const uniqueSegments = [];
  const seen = new Set();
  
  for (const segment of pathSegments) {
    if (!seen.has(segment)) {
      uniqueSegments.push(segment);
      seen.add(segment);
    }
  }
  
  const basePath = '/api' + (uniqueSegments.length > 0 ? '/' + uniqueSegments.join('/') : '');
  return subPath && !uniqueSegments.includes(subPath) ? `${basePath}/${subPath}` : basePath;
}

function combinePaths(basePath: string, methodPath: string): string {
  if (!basePath && !methodPath) return '/';
  if (!basePath) return methodPath.startsWith('/') ? methodPath : `/${methodPath}`;
  if (!methodPath) return basePath.startsWith('/') ? basePath : `/${basePath}`;
  
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const method = methodPath.startsWith('/') ? methodPath : `/${methodPath}`;
  
  return base + method;
}

function extractMethodInfo(lines: string[], startIndex: number, basePath: string = ''): any {
  const httpLine = lines[startIndex].trim();
  
  // Extract HTTP method
  const methodMatch = httpLine.match(/@(Get|Post|Put|Patch|Delete)(?:\(['"`]([^'"`]*)['"`]\))?/);
  if (!methodMatch) return null;
  
  const httpMethod = methodMatch[1];
  const path = methodMatch[2] || '';
  
  // Look for summary
  let summary = '';
  for (let i = Math.max(0, startIndex - 5); i < startIndex; i++) {
    const summaryMatch = lines[i].match(/summary:\s*['"`]([^'"`]*)['"`]/);
    if (summaryMatch) {
      summary = summaryMatch[1];
      break;
    }
  }
  
  // Look for function name
  let functionName = '';
  for (let i = startIndex + 1; i < Math.min(lines.length, startIndex + 3); i++) {
    const funcMatch = lines[i].match(/(\w+)\s*\(/);
    if (funcMatch && !funcMatch[1].includes('constructor')) {
      functionName = funcMatch[1];
      break;
    }
  }
  
  // Check if public
  let isPublic = false;
  for (let i = Math.max(0, startIndex - 3); i < startIndex; i++) {
    if (lines[i].includes('@Public()')) {
      isPublic = true;
      break;
    }
  }
  
  // Combine base path with method path
  const fullPath = combinePaths(basePath, path);
  
  return {
    method: httpMethod.toUpperCase(),
    path: fullPath,
    summary,
    functionName,
    isPublic
  };
}

function formatMethod(methodInfo: any): string {
  let result = `==== ${methodInfo.method} ${methodInfo.path || '/'}\n\n`;
  
  if (methodInfo.summary) {
    result += `**Mô tả:** ${methodInfo.summary}\n\n`;
  }
  
  if (methodInfo.functionName) {
    result += `**Function:** ${methodInfo.functionName}\n\n`;
  }
  
  result += `**Truy cập:** ${methodInfo.isPublic ? 'Công khai' : 'Yêu cầu xác thực'}\n\n`;
  
  return result;
}

function parseDto(content: string, _filePath: string): string {
  let result = '';
  
  // Find class declarations
  const classMatches = content.matchAll(/export\s+class\s+(\w+)\s*{/g);
  
  for (const match of classMatches) {
    const className = match[1];
    
    result += `=== ${className}\n\n`;
    
    // Find class body
    const classStart = match.index! + match[0].length;
    const classBody = extractClassBody(content, classStart);
    
    if (classBody) {
      const properties = extractProperties(classBody);
      
      if (properties.length > 0) {
        result += `**Properties:**\n\n`;
        result += `[cols="2,2,1,3"]\n|===\n|Tên |Kiểu |Bắt buộc |Mô tả\n\n`;
        
        for (const prop of properties) {
          result += `|${prop.name} |${prop.type} |${prop.required ? 'Có' : 'Không'} |${prop.description || '-'}\n`;
        }
        
        result += `|===\n\n`;
      }
    }
  }
  
  return result;
}

function extractClassBody(content: string, startIndex: number): string | null {
  let braceCount = 1;
  let i = startIndex;
  
  while (i < content.length && braceCount > 0) {
    if (content[i] === '{') {
      braceCount++;
    } else if (content[i] === '}') {
      braceCount--;
    }
    i++;
  }
  
  return braceCount === 0 ? content.substring(startIndex, i - 1) : null;
}

function extractProperties(classBody: string): any[] {
  const properties: any[] = [];
  const lines = classBody.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for property declarations
    const propMatch = line.match(/(\w+)(!|\?)?:\s*([^;]+);/);
    if (propMatch) {
      const name = propMatch[1];
      const required = propMatch[2] === '!';
      const type = propMatch[3].trim();
      
      // Look backwards for description
      let description = '';
      for (let j = Math.max(0, i - 10); j < i; j++) {
        const descMatch = lines[j].match(/description:\s*['"`]([^'"`]*)['"`]/);
        if (descMatch) {
          description = descMatch[1];
        }
      }
      
      properties.push({
        name,
        type,
        required,
        description
      });
    }
  }
  
  return properties;
} 