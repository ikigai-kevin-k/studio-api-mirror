# Forward Migration Scripts

This directory contains versioned migration scripts that are applied to evolve the database schema forward.

---

## File Naming Convention

### Format

```
V<VERSION_NUMBER>__<DESCRIPTION>.sql
```

### Examples

- `V001__create_user_table.sql`
- `V002__add_email_column_to_user.sql`
- `V1.0.1__create_order_table.sql`

### Naming Rules

- Prefix must be `V` (uppercase)
- Version number must be numeric (e.g., `001`, `1.0.1`, `20250108001`)
- Two underscores (`__`) separate version from description
- Description should use underscores for spaces
- File extension must be `.sql`

---

## Requirements

⚠️ **Every V file must have a corresponding U file** in the `undo/` directory with an identical version number to enable rollback capability.

---

## SQL Script Guidelines

- Write idempotent scripts when possible (e.g., use `CREATE TABLE IF NOT EXISTS`)
- Include appropriate transaction handling
- Add comments to explain complex logic
- Test scripts in a development environment before committing

---

## Example Migration

```sql
-- V001__create_user_table.sql

CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON "user"(email);
```

---

## Execution Order

Flyway executes migrations in version order. Once a migration is applied and recorded in the schema history table, it will not be executed again.
