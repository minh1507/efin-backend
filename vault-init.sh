#!/bin/sh

echo "Initializing Vault secrets..."

# Set Vault environment
export VAULT_ADDR='http://vault:8200'
export VAULT_TOKEN='myroot'

# Wait a bit for Vault to be ready
sleep 3

# Enable KV secrets engine
vault secrets enable -version=2 kv || echo "KV engine already enabled"

# Store all application secrets
vault kv put kv/efin/config \
  CONFIG.DOMAIN="localhost" \
  CONFIG.PORT="4600" \
  DATABASE.HOST="efin_postgres" \
  DATABASE.NAME="efin_db" \
  DATABASE.PASSWORD="123456" \
  DATABASE.PORT="5432" \
  DATABASE.USER="postgres" \
  DATABASE.MIGRATION="true" \
  DATABASE.SEEDING="true" \
  SWAGGER.DESCRIPTION="EFIN Backend API" \
  SWAGGER.PASSWORD="admin" \
  SWAGGER.STATUS="ON" \
  SWAGGER.TITLE="EFIN API" \
  SWAGGER.USER="admin" \
  MINIO.ACCESS_KEY="admin123" \
  MINIO.BUCKET="efin-bucket" \
  MINIO.END_POINT="efin_minio" \
  MINIO.PORT="9000" \
  MINIO.SECRET_KEY="Minlvip123!" \
  TOKEN.SECRET.KEY="your-secret-key-here-change-in-production" \
  TOKEN.ACCESS.KEY.EXPIRED="1h" \
  TOKEN.REFRESH.KEY.EXPIRED="7d" \
  REDIS.HOST="localhost" \
  REDIS.PORT="6379"

echo "Vault secrets initialized successfully!"

# Verify the secrets were stored
echo "Verifying stored secrets:"
vault kv get kv/efin/config 