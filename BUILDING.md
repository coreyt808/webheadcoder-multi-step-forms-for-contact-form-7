# Building the free plugin

This repository contains the complete readable source for the free version of Webheadcoder Multi-Step Forms for Contact Form 7. Generated assets and installed dependencies are intentionally not committed here.

## Requirements

- Node.js 24
- npm, as supplied with Node.js 24
- Composer

## Build

```sh
nvm use 24
composer install
npm ci
npm run deploy
```
