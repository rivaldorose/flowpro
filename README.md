# FlowPro

FlowPro is een moderne film productie management applicatie gebouwd met React, Vite, Supabase, en Vercel.

## 🚀 Features

- **Project Management**: Beheer al je film projecten op één plek
- **Script Management**: Organiseer en bewerk scripts
- **Budget Tracking**: Houd je budget bij met gedetailleerde entries
- **Crew Management**: Beheer je crew leden
- **Shoot Scheduling**: Plan en beheer shoot dagen
- **Post Production**: Track post-productie taken en versies
- **Task Management**: Organiseer taken per project
- **Podcast Management**: Beheer podcast episodes en checklists
- **Storyboard**: Visualiseer je shots met storyboard frames
- **Locations**: Beheer filmlocaties
- **Notifications**: Blijf op de hoogte van belangrijke updates

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **Routing**: React Router v7

## 📋 Vereisten

- Node.js 18+ 
- npm of yarn
- Supabase account
- Vercel account (voor deployment)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/jouw-username/flowpro.git
cd flowpro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Maak een `.env` bestand:

```bash
cp .env.example .env
```

Vul je Supabase credentials in:

```env
VITE_SUPABASE_URL=https://jouw-project.supabase.co
VITE_SUPABASE_ANON_KEY=jouw-anon-key
```

### 4. Supabase Setup

1. Maak een Supabase project op [supabase.com](https://supabase.com)
2. Voer het `supabase_schema.sql` script uit in de SQL Editor
3. Kopieer je Project URL en anon key naar `.env`

### 5. Development Server

```bash
npm run dev
```

De app draait nu op `http://localhost:5173`

## 📚 Documentatie

- [Migratie Gids](./MIGRATION_GUIDE.md) - Van Base44 naar Supabase
- [GitHub Setup](./GITHUB_SETUP.md) - GitHub repository configuratie
- [Supabase Schema](./supabase_schema.sql) - Database schema

## 🏗️ Project Structuur

```
flowpro/
├── src/
│   ├── api/           # API clients en entities
│   ├── components/    # React componenten
│   ├── lib/           # Utilities en configuratie
│   ├── pages/         # Page componenten
│   └── utils/         # Helper functies
├── public/            # Statische bestanden
├── supabase_schema.sql # Database schema
└── vercel.json        # Vercel configuratie
```

## 🔐 Authentication

FlowPro gebruikt Supabase Auth voor authenticatie. Gebruikers kunnen:

- Inloggen met email/password
- Profiel bijwerken
- Automatisch ingelogd blijven

## 🚢 Deployment

### Vercel Deployment

1. Push je code naar GitHub
2. Ga naar [vercel.com](https://vercel.com)
3. Import je GitHub repository
4. Voeg environment variables toe:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

Zie [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) voor gedetailleerde instructies.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run preview` - Preview productie build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 License

Dit project is privé eigendom.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) voor de geweldige backend
- [Vercel](https://vercel.com) voor deployment
- [Radix UI](https://www.radix-ui.com) voor toegankelijke componenten
- [Tailwind CSS](https://tailwindcss.com) voor styling
