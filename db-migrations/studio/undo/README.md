# Undo Migration Scripts

This directory contains undo (rollback) scripts that reverse the changes made by their corresponding forward migrations.

---

## File Naming Convention

### Format

```
U<VERSION_NUMBER>__<DESCRIPTION>.sql
```

### Examples

- `U001__create_user_table.sql`
- `U002__add_email_column_to_user.sql`
- `U1.0.1__create_order_table.sql`

### Naming Rules

- Prefix must be `U` (uppercase)
- Version number must match the corresponding V file exactly
- Two underscores (`__`) separate version from description
- Description should match the corresponding V file
- File extension must be `.sql`

---

## Requirements

⚠️ **Every U file must have a corresponding V file** in the `sql/` directory with an identical version number. The undo script must completely reverse the changes made by the forward migration.

---

## SQL Script Guidelines

- Write scripts that cleanly reverse the forward migration
- Consider data preservation when appropriate
- Use `IF EXISTS` clauses to handle cases where objects may not exist
- Test rollback scripts thoroughly before deployment

---

## Example Undo Migration

```sql
-- U001__create_user_table.sql

DROP INDEX IF EXISTS idx_user_email;
DROP TABLE IF EXISTS "user";
```

---

## Important Notes

- Not all migrations are reversible (e.g., destructive operations like `DROP COLUMN` with data loss)
- Document any limitations or data loss implications in comments
- Undo scripts are executed when running Flyway's `undo` command
- Always test the undo script after testing the forward migration

---

## When Undo Is Not Possible

If a migration cannot be safely reversed (e.g., dropping a column with data), document this clearly:

```sql
-- U003__drop_legacy_column.sql
-- WARNING: This undo operation cannot restore data that was dropped.
-- Manual data restoration from backup may be required.

ALTER TABLE "user" ADD COLUMN legacy_id INTEGER;
```
