### Check if postgresql is running

```bash
systemctl status postgresql
```

### Setup postgres for prisma

```bash
sudo -iu postgres
psql
CREATE ROLE sec LOGIN;
\du
CREATE DATABASE sec WITH OWNER = your_role_name;
GRANT ALL PRIVILEGES ON DATABASE sec TO sec;
ALTER ROLE sec WITH SUPERUSER CREATEDB;
```

### After changing your .env file, type the following commands in your terminal

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio
```

