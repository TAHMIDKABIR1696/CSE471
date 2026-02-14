# MongoDB Migration Notes

Prisma Migrate does not generate SQL-style migration files for MongoDB.

For this project, schema changes are applied with:

```bash
npm run prisma:generate
npm run prisma:push
```

`prisma db push` synchronizes MongoDB collections and indexes from `prisma/schema.prisma`.
