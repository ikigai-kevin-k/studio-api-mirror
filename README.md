# studio-api

For studio/streaming API

# Studio API

A Fastify-based TypeScript API for studio/streaming services.

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn
- Docker and Docker Compose (for local development)
- GitHub Personal Access Token (for @ikigaians packages)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:Ikigaians/studio-api.git
cd studio-api
```

### 2. Configure GitHub Token

This project uses private `@ikigaians` packages from GitHub. You need to configure your GitHub token:

```bash
# Set your GitHub token
export GITHUB_TOKEN=your_github_token_here

# Configure npm to use the token for GitHub packages
npm config set //npm.pkg.github.com/:_authToken $GITHUB_TOKEN
```

Alternatively, you can manually edit the `.npmrc` file:

```
@ikigaians:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=your_github_token_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Configuration

Create a `.env` file in the project root with the following configuration:

```env
# App Configuration
APP_NAME=studio-api
PORT=3000
APP_DOMAIN=http://localhost:3000
APP_ENV=development
LOG_LEVEL=info

# Authentication
SERVICE_API_SIGNATURE=your-service-api-signature-here

# Table Configuration
TABLE_ID=table-001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studio
DB_USER=postgres
DB_PASSWORD=secret
DB_SSL=false

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6381
REDIS_PASSWORD=
REDIS_USERNAME=
REDIS_TLS=false
REDIS_IS_CLUSTER=false
```

### 5. Start Required Services

The project requires PostgreSQL and Redis. You can start them using Docker Compose:

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

**Note**: If you encounter Docker Hub connection timeout issues, try the following solutions:

```bash
# Solution 1: Use a different DNS
sudo docker run --rm --dns 8.8.8.8 --dns 8.8.4.4 alpine nslookup registry-1.docker.io

# Solution 2: Pull images manually first
docker pull redis:7.0
docker pull postgres:16.2

# Solution 3: Use a different registry mirror (if available in your region)
# Add to /etc/docker/daemon.json:
{
  "registry-mirrors": ["https://mirror.gcr.io"]
}
```

## Running the Application

### Development Mode (Recommended)

```bash
# Start the application in development mode with hot reload
npm start
```

This command will:

- Watch for TypeScript file changes and recompile automatically
- Restart the application when changes are detected
- Run the server on the configured port (default: 3000)

### Alternative Commands

```bash
# Build TypeScript files
npm run build

# Run with watch mode for TypeScript compilation
npm run build:watch

# Run the application with watch mode
npm run run:watch

# Run tests
npm test

# Run tests with coverage
npm run test:cov
```

## Code Quality

```bash
# Check code quality
npm run lint

# Fix code quality issues
npm run lint:fix

# Check TypeScript types
npm run type:check

# Format code
npm run prettier:fix
```

## API Documentation

Once the application is running, you can access:

- **Health Check**: `http://localhost:3000/v1/service/healthcheck`
- **Service Status**: `http://localhost:3000/v1/service/status`
- **API Documentation**: `http://localhost:3000/api-docs`
- **API Documentation JSON**: `http://localhost:3000/api-docs-json`

### API Authentication

Most API endpoints require authentication using the `x-signature` header:

```bash
# Example API call with authentication
curl -H "x-signature: your-service-api-signature-here" \
     http://localhost:3000/v1/service/healthcheck
```

### Health Check Response

```json
{
  "error": null,
  "data": {
    "service": "studio-api",
    "environment": "development",
    "uptime": 219,
    "timestamp": 1753950435785,
    "maintenance": false,
    "version": "development"
  }
}
```

### Service Status Response

```bash
# Get detailed service status
curl -H "x-signature: your-service-api-signature-here" \
     http://localhost:3000/v1/service/status
```

```json
{
  "error": null,
  "data": {
    "service": "studio-api",
    "environment": "development",
    "uptime": 12,
    "timestamp": 1753955074974,
    "maintenance": false,
    "version": "development",
    "status": "running",
    "message": "Service is running normally",
    "table_id": "table-001",
    "sdp": "up",
    "idp": "up",
    "broker": "up",
    "zcam": "up",
    "roulette": "up",
    "shaker": "up",
    "barcodeScanner": "up",
    "NFCscanner": "up"
  }
}
```

#### Service Status Fields

| Field            | Description                    | Possible Values                                     |
| ---------------- | ------------------------------ | --------------------------------------------------- |
| `table_id`       | Table identifier               | String                                              |
| `sdp`            | SDP service status             | `up`, `down`, `standby`, `calibration`, `exception` |
| `idp`            | IDP service status             | `up`, `down`, `standby`, `calibration`, `exception` |
| `broker`         | Broker service status          | `up`, `down`                                        |
| `zcam`           | ZCam service status            | `up`, `down`                                        |
| `roulette`       | Roulette service status        | `up`, `down`                                        |
| `shaker`         | Shaker service status          | `up`, `down`                                        |
| `barcodeScanner` | Barcode scanner service status | `up`, `down`                                        |
| `NFCscanner`     | NFC scanner service status     | `up`, `down`                                        |

## Project Structure

```
studio-api/
├── src/
│   ├── app.ts              # Main application setup
│   ├── config/             # Configuration services
│   ├── db/                 # Database configuration
│   ├── cache/              # Cache configuration
│   ├── auth/               # Authentication modules
│   ├── router/             # API routes
│   ├── healthcheck/        # Health check endpoints
│   ├── log/                # Logging configuration
│   └── mod/                # Module definitions
├── index.ts                # Application entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── docker-compose.yaml     # Local development services
└── .env                    # Environment variables (create this)
```

## Environment Variables

| Variable                | Description                          | Default                 |
| ----------------------- | ------------------------------------ | ----------------------- |
| `APP_NAME`              | Application name                     | `studio-api`            |
| `PORT`                  | Server port                          | `3000`                  |
| `APP_DOMAIN`            | Application domain                   | `http://localhost:3000` |
| `APP_ENV`               | Environment (development/production) | `development`           |
| `LOG_LEVEL`             | Logging level                        | `info`                  |
| `SERVICE_API_SIGNATURE` | API signature for authentication     | Required                |
| `TABLE_ID`              | Table identifier for status endpoint | `table-001`             |
| `DB_HOST`               | Database host                        | `localhost`             |
| `DB_PORT`               | Database port                        | `5432`                  |
| `DB_NAME`               | Database name                        | `studio`                |
| `DB_USER`               | Database user                        | `postgres`              |
| `DB_PASSWORD`           | Database password                    | `secret`                |
| `DB_SSL`                | Database SSL                         | `false`                 |
| `REDIS_HOST`            | Redis host                           | `localhost`             |
| `REDIS_PORT`            | Redis port                           | `6381`                  |
| `REDIS_PASSWORD`        | Redis password                       | Empty                   |
| `REDIS_USERNAME`        | Redis username                       | Empty                   |
| `REDIS_TLS`             | Redis TLS                            | `false`                 |
| `REDIS_IS_CLUSTER`      | Redis cluster mode                   | `false`                 |

## Troubleshooting

### GitHub Token Issues

If you encounter authentication errors when installing dependencies:

1. Ensure your GitHub token has the correct permissions
2. Verify the token is properly configured in `.npmrc`
3. Try regenerating your GitHub token

### Database Connection Issues

1. Ensure PostgreSQL is running: `docker-compose ps`
2. Check database credentials in `.env`
3. Verify database port is not blocked

### Redis Connection Issues

1. Ensure Redis is running: `docker-compose ps`
2. Check Redis configuration in `.env`
3. Verify Redis port is accessible

### Port Already in Use

If port 3000 is already in use, change the `PORT` variable in your `.env` file.

## Development Workflow

1. Make changes to TypeScript files in `src/`
2. The application will automatically recompile and restart
3. Check the console for any compilation errors
4. Test your changes via the API endpoints

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Ensure all tests pass with `npm test`
4. Update documentation as needed
