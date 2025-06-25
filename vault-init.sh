#!/bin/sh

echo "Initializing Vault secrets..."

# Set Vault environment
export VAULT_ADDR='http://vault:8200'
export VAULT_TOKEN='myroot'

# Wait for Vault to be ready
echo "Waiting for Vault to be ready..."
sleep 10

# Enable KV secrets engine
echo "Enabling KV secrets engine..."
vault secrets enable -version=2 kv 2>/dev/null || echo "KV engine already enabled"

echo "Creating Vault secrets..."

# Store application secrets
vault kv put kv/efin/config \
CONFIG.DOMAIN=localhost \
CONFIG.PORT=4600 \
DATABASE.HOST=efin_postgres \
DATABASE.NAME=efin_db \
DATABASE.PASSWORD=123456 \
DATABASE.PORT=5432 \
DATABASE.USER=postgres \
DATABASE.MIGRATION=true \
DATABASE.SEEDING=true \
SWAGGER.DESCRIPTION="EFIN Backend API" \
SWAGGER.PASSWORD=admin \
SWAGGER.STATUS=ON \
SWAGGER.TITLE="EFIN API" \
SWAGGER.USER=admin \
MINIO.ACCESS_KEY=admin123 \
MINIO.BUCKET=efin-bucket \
MINIO.END_POINT=efin_minio \
MINIO.PORT=9000 \
MINIO.SECRET_KEY="Minlvip123!" \
TOKEN.SECRET_KEY="your-secret-key-here-change-in-production" \
TOKEN.ACCESS_KEY_EXPIRED=1h \
TOKEN.REFRESH_KEY_EXPIRED=7d \
REDIS.HOST=localhost \
REDIS.PORT=6379

if [ $? -eq 0 ]; then
    echo "Vault secrets initialized successfully!"
    
    # Verify the secrets were stored
    echo "Verifying stored secrets:"
    vault kv get kv/efin/config
else
    echo "Failed to create Vault secrets!"
    exit 1
fi 