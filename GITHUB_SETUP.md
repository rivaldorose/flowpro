# GitHub Setup voor FlowPro

Deze gids helpt je bij het instellen van GitHub voor FlowPro.

## Stap 1: GitHub Repository Aanmaken

1. Ga naar [github.com](https://github.com) en log in
2. Klik op het **+** icoon rechtsboven → **New repository**
3. Vul in:
   - **Repository name**: `flowpro` (of een andere naam)
   - **Description**: "FlowPro - Film Production Management App"
   - **Visibility**: Kies Public of Private
   - **DON'T** initialiseer met README, .gitignore of license (we hebben deze al)
4. Klik op **Create repository**

## Stap 2: Git Initialiseren (als nog niet gedaan)

Als je project nog geen git repository is:

```bash
cd /Users/rivaldomacandrew/Desktop/flow-pro-ab7c8be8
git init
```

## Stap 3: Bestanden Toevoegen

```bash
# Controleer welke bestanden worden toegevoegd
git status

# Voeg alle bestanden toe
git add .

# Maak eerste commit
git commit -m "Initial commit: Migrate from Base44 to Supabase"
```

## Stap 4: Repository Koppelen

```bash
# Jouw repository URL:
git remote add origin https://github.com/rivaldorose/flowpro.git

# Of met SSH (als je SSH keys hebt ingesteld):
# git remote add origin git@github.com:rivaldorose/flowpro.git

# Controleer of remote correct is ingesteld
git remote -v
```

**Let op:** Als je een authenticatie fout krijgt:
1. Zorg dat je ingelogd bent met het juiste GitHub account (`rivaldorose`)
2. Of gebruik een Personal Access Token:
   - Ga naar GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Maak een nieuwe token aan met `repo` permissions
   - Gebruik de token als wachtwoord bij `git push`

## Stap 5: Code Pushen

```bash
# Stel main branch in
git branch -M main

# Push naar GitHub
git push -u origin main
```

## Stap 6: .env Bestand NIET Committen

Het `.env` bestand staat al in `.gitignore`, maar controleer dit:

```bash
# Controleer of .env in .gitignore staat
cat .gitignore | grep .env
```

Als je per ongeluk `.env` hebt gecommit:

```bash
# Verwijder uit git (maar behoud lokaal)
git rm --cached .env
git commit -m "Remove .env from repository"
git push
```

## Stap 7: GitHub Secrets voor CI/CD (Optioneel)

Als je GitHub Actions wilt gebruiken:

1. Ga naar je repository op GitHub
2. Klik op **Settings** → **Secrets and variables** → **Actions**
3. Voeg secrets toe:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Stap 8: Vercel Integratie met GitHub

1. Ga naar [vercel.com](https://vercel.com)
2. Log in met GitHub
3. Klik op **Add New Project**
4. Selecteer je FlowPro repository
5. Vercel detecteert automatisch Vite
6. Voeg environment variables toe:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Klik op **Deploy**

Na elke push naar GitHub wordt je app automatisch opnieuw gedeployed!

## Handige Git Commands

```bash
# Status checken
git status

# Wijzigingen bekijken
git diff

# Commit maken
git add .
git commit -m "Beschrijving van wijzigingen"
git push

# Nieuwe branch maken
git checkout -b feature/nieuwe-feature
git push -u origin feature/nieuwe-feature

# Pull latest changes
git pull origin main
```

## Branch Strategy (Aanbevolen)

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Nieuwe features
- `fix/*`: Bug fixes

## .gitignore Checklist

Zorg ervoor dat deze bestanden NIET worden gecommit:
- ✅ `.env`
- ✅ `node_modules/`
- ✅ `dist/`
- ✅ `.DS_Store`
- ✅ Editor configuraties

## Troubleshooting

### "Permission denied"
- Controleer of je SSH keys correct zijn ingesteld
- Of gebruik HTTPS met personal access token

### "Repository not found"
- Controleer of de repository naam correct is
- Controleer of je toegang hebt tot de repository

### "Failed to push"
- Controleer of je internetverbinding werkt
- Probeer `git pull` eerst om conflicts te voorkomen

