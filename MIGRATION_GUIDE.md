# FlowPro Migratie Gids: Base44 naar Supabase

Deze gids helpt je bij het migreren van FlowPro van Base44 naar Supabase, Vercel en GitHub.

## Stap 1: Supabase Project Setup

1. Ga naar [supabase.com](https://supabase.com) en log in
2. Maak een nieuw project aan
3. Wacht tot het project klaar is (kan een paar minuten duren)

## Stap 2: Database Schema Installeren

1. Ga naar je Supabase project dashboard
2. Klik op **SQL Editor** in de sidebar
3. Open het bestand `supabase_schema.sql` in deze repository
4. Kopieer de volledige inhoud
5. Plak het in de SQL Editor
6. Klik op **Run** om het schema te installeren

Dit maakt alle benodigde tabellen aan:
- businesses
- projects
- scripts
- budget_entries
- crew_members
- shoot_schedules
- shots
- post_production
- en meer...

## Stap 3: Supabase Credentials Ophalen

1. In je Supabase dashboard, ga naar **Settings** → **API**
2. Kopieer de volgende waarden:
   - **Project URL** (bijv. `https://xxxxx.supabase.co`)
   - **anon/public key** (de `anon` key, niet de `service_role` key)

## Stap 4: Environment Variables Instellen

1. Maak een `.env` bestand in de root van het project:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` en vul de Supabase credentials in:
   ```
   VITE_SUPABASE_URL=https://jouw-project.supabase.co
   VITE_SUPABASE_ANON_KEY=jouw-anon-key
   ```

## Stap 5: Dependencies Installeren

```bash
npm install
```

Dit installeert:
- `@supabase/supabase-js` (vervangt @base44/sdk)
- `@tanstack/react-query` (voor data fetching)

## Stap 6: Development Server Starten

```bash
npm run dev
```

De app zou nu moeten werken met Supabase!

## Stap 7: GitHub Repository Setup

1. Maak een nieuwe repository op GitHub
2. Initialiseer git in je project (als dat nog niet is gedaan):
   ```bash
   git init
   git add .
   git commit -m "Migrate from Base44 to Supabase"
   ```
3. Koppel aan je GitHub repository:
   ```bash
   git remote add origin https://github.com/jouw-username/flowpro.git
   git branch -M main
   git push -u origin main
   ```

## Stap 8: Vercel Deployment

### Optie A: Via Vercel Dashboard

1. Ga naar [vercel.com](https://vercel.com) en log in met GitHub
2. Klik op **Add New Project**
3. Selecteer je GitHub repository
4. Vercel detecteert automatisch Vite
5. Voeg environment variables toe:
   - `VITE_SUPABASE_URL`: Je Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Je Supabase anon key
6. Klik op **Deploy**

### Optie B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Volg de instructies en voeg de environment variables toe wanneer daarom wordt gevraagd.

## Belangrijke Wijzigingen

### API Structuur

De app gebruikt nu Supabase in plaats van Base44, maar de API structuur blijft hetzelfde voor backward compatibility:

```javascript
// Oude code (werkt nog steeds):
import { base44 } from '@/api/base44Client'
const projects = await base44.entities.Project.list()

// Nieuwe code (aanbevolen):
import { Project } from '@/api/entities'
const projects = await Project.list()
```

### Authentication

Authentication werkt nu via Supabase Auth:

```javascript
import { base44 } from '@/api/base44Client'

// Inloggen
await base44.auth.signIn(email, password)

// Uitloggen
await base44.auth.signOut()

// Huidige gebruiker ophalen
const user = await base44.auth.me()
```

## Troubleshooting

### "Missing Supabase environment variables"
- Zorg ervoor dat je `.env` bestand bestaat en de juiste waarden bevat
- Herstart de development server na het toevoegen van environment variables

### Database errors
- Controleer of je het `supabase_schema.sql` script hebt uitgevoerd
- Controleer of Row Level Security (RLS) policies correct zijn ingesteld

### Build errors op Vercel
- Zorg ervoor dat alle environment variables zijn ingesteld in Vercel
- Controleer de build logs voor specifieke foutmeldingen

## Volgende Stappen

1. ✅ Supabase project aanmaken
2. ✅ Database schema installeren
3. ✅ Environment variables instellen
4. ✅ Dependencies installeren
5. ✅ Testen in development
6. ✅ GitHub repository aanmaken
7. ✅ Vercel deployment configureren
8. ✅ Production deployment

## Support

Voor vragen of problemen:
- Check de [Supabase documentatie](https://supabase.com/docs)
- Check de [Vercel documentatie](https://vercel.com/docs)
- Check de [React Query documentatie](https://tanstack.com/query/latest)

