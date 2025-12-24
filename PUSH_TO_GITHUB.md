# FlowPro naar GitHub Pushen

Je code is lokaal klaar, maar moet nog naar GitHub worden gepusht. Volg deze stappen:

## Repository URL
- **Repository**: https://github.com/rivaldorose/flowpro.git
- **Status**: Repository bestaat maar is nog leeg

## Stap 1: GitHub Authenticatie

Je moet ingelogd zijn met het juiste GitHub account (`rivaldorose`).

### Optie A: GitHub CLI (Aanbevolen)

```bash
# Installeer GitHub CLI (als je die nog niet hebt)
brew install gh

# Login met GitHub
gh auth login

# Volg de instructies en selecteer:
# - GitHub.com
# - HTTPS
# - Authenticate Git with your GitHub credentials? Yes
```

### Optie B: Personal Access Token

1. Ga naar: https://github.com/settings/tokens
2. Klik op **Generate new token (classic)**
3. Geef het een naam: "FlowPro Local"
4. Selecteer scope: **repo** (alle repo permissions)
5. Klik op **Generate token**
6. **Kopieer de token** (je ziet hem maar één keer!)

## Stap 2: Remote Toevoegen

```bash
cd /Users/rivaldomacandrew/Desktop/flow-pro-ab7c8be8

# Verwijder bestaande remote (als die er is)
git remote remove origin

# Voeg de juiste remote toe
git remote add origin https://github.com/rivaldorose/flowpro.git

# Controleer
git remote -v
```

## Stap 3: Code Pushen

### Met GitHub CLI (als je gh hebt gebruikt):

```bash
git push -u origin main
```

### Met Personal Access Token:

```bash
# Bij de eerste push wordt om credentials gevraagd
git push -u origin main

# Username: rivaldorose
# Password: [plak je personal access token hier]
```

### Met SSH (als je SSH keys hebt ingesteld):

```bash
# Verwijder HTTPS remote
git remote remove origin

# Voeg SSH remote toe
git remote add origin git@github.com:rivaldorose/flowpro.git

# Push
git push -u origin main
```

## Stap 4: Verificatie

Ga naar https://github.com/rivaldorose/flowpro en controleer of alle bestanden er staan.

## Troubleshooting

### "Permission denied" of "403 Forbidden"
- Zorg dat je ingelogd bent met account `rivaldorose`
- Gebruik een Personal Access Token in plaats van je wachtwoord
- Of gebruik GitHub CLI: `gh auth login`

### "Repository not found"
- Controleer of de repository bestaat: https://github.com/rivaldorose/flowpro
- Controleer of je toegang hebt tot de repository

### "Could not read from remote repository" (SSH)
- Controleer of je SSH keys zijn toegevoegd aan GitHub
- Test SSH: `ssh -T git@github.com`
- Voeg SSH key toe: https://github.com/settings/keys

## Na Succesvol Pushen

1. ✅ Code staat op GitHub
2. ✅ Klaar voor Vercel deployment
3. ✅ Klaar voor collaboratie

Je kunt nu:
- De repository bekijken op GitHub
- Vercel koppelen voor automatische deployment
- Anderen uitnodigen om mee te werken

