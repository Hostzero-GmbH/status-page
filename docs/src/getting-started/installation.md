# Installation

Yet Another Status Page can be deployed in several ways. Choose the method that best fits your infrastructure.

## Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 20+ and PostgreSQL 15+

## Deployment Options

### Option 1: Vercel (One-Click)

Deploy instantly to Vercel with a managed PostgreSQL database:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHostzero-GmbH%2Fyet-another-status-page&env=PAYLOAD_SECRET&envDescription=Required%20environment%20variables%20for%20Yet%20Another%20Status%20Page&envLink=https%3A%2F%2Fhostzero-gmbh.github.io%2Fyet-another-status-page%2Fgetting-started%2Fconfiguration%2F&project-name=yet-another-status-page&repository-name=yet-another-status-page&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D)

This will:
1. Create a new Vercel project
2. Provision a Vercel Postgres database
3. Prompt you to set `PAYLOAD_SECRET` (generate a random 32+ character string)

All configuration (site name, logos, services, notifications) is done through the admin panel — no code changes required.

### Option 2: Docker Compose (Recommended for Self-Hosting)

The easiest way to self-host. See the [Docker Compose guide](docker-compose.md) for detailed instructions.

```bash
# Clone the repository
git clone https://github.com/Hostzero-GmbH/yet-another-status-page.git
cd yet-another-status-page

# Copy the example environment file
cp .env.example .env

# Edit the environment variables
nano .env

# Start the services
docker compose up -d
```

### Option 3: Pre-built Docker Image

Pull the latest image from GitHub Container Registry:

```bash
docker pull ghcr.io/hostzero-gmbh/status-page:latest
```

Run with your own PostgreSQL:

```bash
docker run -d \
  --name status-page \
  -p 3000:3000 \
  -e DATABASE_URI=postgres://user:pass@host:5432/db \
  -e PAYLOAD_SECRET=your-secret-key \
  -e SERVER_URL=https://status.example.com \
  ghcr.io/hostzero-gmbh/status-page:latest
```

### Option 4: Build from Source

```bash
# Clone the repository
git clone https://github.com/Hostzero-GmbH/yet-another-status-page.git
cd yet-another-status-page

# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm start
```

## First-Time Setup

1. **Access the Admin Panel**
   
   Navigate to `http://your-server:3000/admin`

2. **Create Admin User**
   
   On first access, you'll be prompted to create an admin account.

3. **Configure Settings**
   
   Configure your status page in the admin panel:
   
   - **Configuration → Site Settings**: Site name, description, favicon, logos
   - **Configuration → Email Settings**: SMTP settings for email notifications
   - **Configuration → SMS Settings**: Twilio settings for SMS notifications

4. **Add Services**
   
   Create service groups and services that represent your infrastructure.

5. **Go Live**
   
   Your status page is now accessible at `http://your-server:3000`
