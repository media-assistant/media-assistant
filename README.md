# Media Assistant

Very much a work in progress.

## Development

```bash
$ git clone https://github.com/nielsrowinbik/media-assistant
$ cd media-assistant
$ cp .env.local.example .env.local # Don't forget to fill in values after copying!
```

### With Docker (recommended):

```bash
$ docker compose run --rm media-assistant npm ci # Only on first run to install dependencies
$ docker compose up # To start development server
$ docker compose exec media-assistant sh # Run this to run commands within the container
```

### Without Docker:

```bash
$ npm i # To install dependencies
$ npm run dev # To start development server
```
