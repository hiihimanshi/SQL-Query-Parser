FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src
COPY data ./data
COPY .env.example ./.env

# Set environment
ENV NODE_ENV=production
ENV LOG_LEVEL=info

# Create logs directory
RUN mkdir -p logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('fs').existsSync('/app/logs') || process.exit(1)"

# Run CLI
ENTRYPOINT ["node", "src/cli.js"]
