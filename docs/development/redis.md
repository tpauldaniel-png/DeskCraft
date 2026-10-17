# Local Redis Development setup

Redis will cache frequently requested catalogue responses. Postgresql remains the main database.

## Requirements
- Docker Desktop installed and running with Linux containers.
- Docker Compose available through Docker Desktop.
- Run the PowerShell commands below from the repository root:

```powershell
cd E:\Deskcraft\deskcraft
```

## Configuration
Create `docker-compose.yml` in the repository root:

```yml
services:
  redis:
    image: redis:8.10.2-alpine
    ports:
      - "127.0.0.1:6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
```

## Start and verify

```powershell
docker compose config
docker compose up -d redis
docker compose ps
docker compose exec redis redis-cli ping
```

Expected: the container shows `healthy`, and the final command returns `PONG`.

## Basic Redis practice

Open the Redis CLI:

```powershell
docker compose exec redis redis-cli
```

Run these commands inside the CLI:

```text
SET deskcraft:practice "Redis is working" EX 30
GET deskcraft:practice
TTL deskcraft:practice
```

- `SET ... EX 30` stores the value for 30 seconds.
- `GET` returns the value while the key exists.
- `TTL` returns the remaining lifetime in seconds.
- After expiry, `GET` returns `(nil)` and `TTL` returns `-2`.
- Type `exit` to leave the CLI.

You can also open the Redis container's **Exec** tab in Docker Desktop and run `redis-cli` there.


## Useful commands

| Action | Command |
| --- | --- |
| Start Redis | docker compose up -d redis |
| Check Status | docker compose ps |
| Check Connection | docker compose exec redis redis-cli ping |
| Open Redis CLI | docker compose exec redis redis-cli |
| View logs | docker compose logs redis |
| Stop Redis | docker compose stop redis |
