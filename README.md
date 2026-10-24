<div align="center">
  <img width="142" height="142" src="https://download.next-hat.com/ressources/images/logo.png" >
  <h2>Nanocl registry</h2>
  <h4>Just apply and enjoy</h4>
  <p align="center">
    <a href="https://discord.gg/WV4Aac8uZg" target="_blank"><b>Discord</b></a> •
    <a href="https://x.com/next_hat" target="_blank"><b>𝕏</b></a>
  </p>
</div>

Officially maintained production ready Statefile

This repository contains the official Nanocl registry, a collection of statefiles for various applications and services. Each statefile is designed to be easily deployable with Nanocl, allowing users to quickly set up and manage their applications.

It also include the webapp used to browse the statefiles.

Feel free to introduce new statefiles by opening a pull request.

## Run the webapp locally

  ```bash
  git clone --recurse-submodules https://github.com/next-hat/nanocl-registry
  cd nanocl-registry/webapp
  pnpm install --frozen-lockfile
  pnpm dev
```

Use Node.js 26.12.1 and pnpm 12.15.0 (the version pinned in
`webapp/package.json`). See the [webapp README](webapp/README.md) for production
Docker instructions.
