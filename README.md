# Media Assistant

Very much a work in progress.

## Usage

Here are some example snippets to help you get started creating a container.

### With Docker Compose (recommended)

```yaml
version: "3.8"

services:
  media-assistant:
    image: ghrc.io/nielsrowinbik/media-assistant
    container_name: media-assistant
    environment:
      RADARR_URL: https://radarr.example.com
      RADARR_API_KEY: abcdefghijklmnopqrstuvwxyz
      SONARR_URL: https://sonarr.example.com
      SONARR_API_KEY: abcdefghijklmnopqrstuvwxyz
    ports:
      - 8686:8686
    restart: unless-stopped
```

### With Docker CLI

```bash
$ docker run -d \
  --name=media-assistant \
  -e RADARR_URL=https://radarr.example.com \
  -e RADARR_API_KEY:=abcdefghijklmnopqrstuvwxyz \
  -e SONARR_URL=https://sonarr.example.com \
  -e SONARR_API_KEY=abcdefghijklmnopqrstuvwxyz \
  -p 8686:8686 \
  --restart unless-stopped \
  ghrc.io/nielsrowinbik/media-assistant
```

## Development

### Clone the repository

```bash
$ git clone https://github.com/nielsrowinbik/media-assistant
$ cd media-assistant
```

### Set up environment variables

```bash
$ cp .env.local.example .env.local
```

Fill in the correct values in `.env.local` before moving to the next step.

### Install dependencies

```bash
$ docker compose run --rm media-assistant npm ci
```

### Running development server

```bash
$ docker compose up
```

### Running commands inside the container

```bash
$ docker compose exec media-assistant sh
```

Usefull to install additional dependencies with `npm add`, for example.
