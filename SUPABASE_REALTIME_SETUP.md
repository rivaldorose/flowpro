# Supabase Realtime Setup voor Script Collaboration

## 🚀 Stap 1: Realtime Inschakelen in Supabase

1. Ga naar je Supabase Dashboard: https://supabase.com/dashboard
2. Selecteer je project
3. Ga naar **Database** → **Replication**
4. Zoek de `scripts` table
5. Klik op de toggle om **Realtime** in te schakelen voor de `scripts` table

## 🔐 Stap 2: Row Level Security (RLS) Configureren

Zorg ervoor dat je Row Level Security policies hebt ingesteld zodat gebruikers alleen scripts kunnen lezen/bewerken waar ze toegang toe hebben.

**Voorbeeld SQL in Supabase SQL Editor:**

```sql
-- Enable RLS on scripts table
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read scripts from projects they have access to
CREATE POLICY "Users can read scripts from accessible projects"
ON scripts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = scripts.project_id
    AND (
      -- User is admin
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
      OR
      -- User has access to the project's business
      EXISTS (
        SELECT 1 FROM business_access ba
        WHERE ba.user_email = (SELECT email FROM users WHERE id = auth.uid())
        AND ba.business_id = p.business_id
      )
    )
  )
);

-- Policy: Users can update scripts from projects they have access to
CREATE POLICY "Users can update scripts from accessible projects"
ON scripts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = scripts.project_id
    AND (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
      OR
      EXISTS (
        SELECT 1 FROM business_access ba
        WHERE ba.user_email = (SELECT email FROM users WHERE id = auth.uid())
        AND ba.business_id = p.business_id
      )
    )
  )
);
```

## ✅ Stap 3: Testen

1. Open het script in twee verschillende browsers/tabs
2. Type in één tab
3. Je zou de updates direct moeten zien in de andere tab!

## 🎯 Features

- ✅ **Real-time updates**: Wijzigingen verschijnen direct bij andere gebruikers
- ✅ **Active users indicator**: Zie hoeveel mensen tegelijk aan het script werken
- ✅ **Auto-save**: Wijzigingen worden automatisch opgeslagen
- ✅ **Conflict resolution**: Updates worden intelligent gemerged

## 🔧 Troubleshooting

### Updates verschijnen niet?
- Check of Realtime is ingeschakeld voor de `scripts` table
- Check of je RLS policies correct zijn ingesteld
- Check browser console voor errors

### "Permission denied" errors?
- Zorg dat je RLS policies correct zijn
- Check of de gebruiker toegang heeft tot het project

### Presence tracking werkt niet?
- Presence tracking vereist dat Realtime is ingeschakeld
- Check of `currentUserId` correct wordt doorgegeven aan ScriptEditor

## 📚 Meer Info

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Presence](https://supabase.com/docs/guides/realtime/presence)

