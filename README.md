# 🧳 Pack & Pass

A fast, browser-based packing game — and a living demo of
[Laravel Suitcase](https://github.com/SameOldNick/laravel-suitcase), a package that
packs a Laravel app for deployment to shared hosting.

**Live demo:** https://suitcasetest.xyz/

## What is this?

Pack & Pass is a small arcade game where a stream of items appears one at a time and
you decide what makes it into your suitcase before border services stop you.

- 🕒 **30-second rounds** — pack as much value as you can before time runs out.
- ⚖️ **Weight limit (12)** — packing something too heavy means you overpacked.
- 🚫 **Banned items** — some things are prohibited at the border; reject them for a
  bonus, or pay a penalty for packing them.
- ⚡ **Three strikes** and the round is over.
- 🏆 **High score** saved locally in your browser.

It's deliberately small: the point is the deployment. The entire app ships to a cheap
shared-hosting account using **Laravel Suitcase**, which is what this repository
demonstrates.

## Why it exists

[Laravel Suitcase](https://github.com/SameOldNick/laravel-suitcase) packages a Laravel
application — code, assets, database dump, and a pre-configured `.env.shared` — into a
single ZIP you can drop onto shared hosting (e.g. cPanel). This repo is a real,
deployed app that exercises that workflow end to end.

## Tech stack

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Backend    | Laravel 13 · PHP 8.3+                                 |
| Frontend   | Inertia.js v3 · React 19 · TypeScript                 |
| Styling    | Tailwind CSS v4                                       |
| Build      | Vite · Laravel Vite Plugin · Wayfinder                |
| Testing    | Pest · PHPStan · Pint                                 |
| Deployment | [Laravel Suitcase](https://github.com/SameOldNick/laravel-suitcase) → shared hosting |

## Getting started

```bash
# Install dependencies, set up .env, generate a key, migrate, and build assets
composer run setup

# Start the dev server (Artisan + Vite)
composer run dev
```

Then open the URL shown in the terminal (usually `http://localhost:8000`).

### Available scripts

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `composer run setup`  | Full first-time setup (install → migrate → build) |
| `composer run dev`    | Run Artisan and Vite together for development    |
| `composer run test`   | Format, type-check, and run the test suite       |
| `npm run build`       | Build production assets                          |

## Deploying to shared hosting

This is the whole point of the demo. Deployment is handled by Laravel Suitcase:

```bash
# 1. Build production assets
npm run build

# 2. Package the app for shared hosting
php artisan suitcase:pack
```

This generates `laravel_shared_hosting_pack.zip`, which contains the Laravel code,
built assets, a database dump, and a ready-to-edit `.env.shared`. Upload it to your
host, unzip, and follow the included `INSTALL.txt` instructions.

Deployment paths and inclusions are configured in
[`config/suitcase.php`](config/suitcase.php).

## Project structure

```
app/                Laravel application (controllers, models, providers)
resources/js/       Inertia + React frontend (pages, components, data)
routes/web.php      Server-side routes (single Inertia route)
config/suitcase.php Laravel Suitcase packaging configuration
deploy/             Shared-hosting output (INSTALL.txt, packaged app)
tests/              Pest feature and unit tests
```

## License

This project is open-sourced under the MIT license.
