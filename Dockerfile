FROM node:18.13.0-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Keep all dependencies for runtime (cache dependencies issue)
RUN npm cache clean --force

# Expose port
EXPOSE 4600

# Start the application
CMD ["npm", "run", "start:prod"] 