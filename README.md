# Media Assistant

Very much a work in progress.

## Usage

Here are some example snippets to help you get started creating a container.

### With Docker Compose (recommended)

```yaml
version: "3.8"

services:
  media-assistant:
    image: ghrc.io/media-assistant/media-assistant
    container_name: media-assistant
    environment:
      RADARR_API_KEY: abcdefghijklmnopqrstuvwxyz
      RADARR_FOLDER: /movies
      RADARR_QUALITY_PROFILE: 7
      RADARR_URL: https://radarr.example.com
    ports:
      - 8686:8686
    restart: unless-stopped
```

### With Docker CLI

```bash
$ docker run -d \
  --name=media-assistant \
  -e RADARR_API_KEY:=abcdefghijklmnopqrstuvwxyz \
  -e RADARR_FOLDER=/films \
  -e RADARR_QUALITY_PROFILE=7 \
  -e RADARR_URL=https://radarr.example.com \
  -p 8686:8686 \
  --restart unless-stopped \
  ghrc.io/media-assistant/media-assistant
```

## Development

### Clone the repository

```bash
$ git clone https://github.com/media-assistant/media-assistant
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
