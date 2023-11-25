# Project Setup Instructions

## Check if postgresql is running

```bash
systemctl status postgresql
```

## Setup postgres for prisma

```bash
sudo -iu postgres
psql
CREATE ROLE sci LOGIN;
\du
CREATE DATABASE sci WITH OWNER = sci;
GRANT ALL PRIVILEGES ON DATABASE sci TO sci;
ALTER ROLE sci WITH SUPERUSER CREATEDB;
```

## After changing your .env file, type the following commands in your terminal

```bash
npx prisma generate
npx prisma db push
npx prisma studio
```

