# Statefile project logos

These unmodified upstream marks identify the software deployed by each Statefile.
They are not the Nanocl Registry brand and do not imply project endorsement.
Repository downloads use the pinned Git tree references linked below. The
Fail2Ban organization avatar and WireGuard icon are official website downloads.

| Local asset | Official upstream asset | Attribution and upstream licensing |
| --- | --- | --- |
| `deluge.png` | [Deluge](https://raw.githubusercontent.com/deluge-torrent/deluge/e58075416dedd53636e89b1cd240f86f2e7c2ee0/deluge/ui/data/icons/hicolor/256x256/apps/deluge.png) | CC BY-SA 2.0 mark metadata; Jakub Steiner, Tuomas Kuosmanen |
| `jackett.png` | [Jackett](https://raw.githubusercontent.com/Jackett/Jackett/f12394e4914b880ec8dadef326ed3b3c12fbe201/src/Jackett.Common/Content/apple-touch-icon.png) | GPL-2.0 upstream repository; Jackett contributors |
| `jellyfin.svg` | [Jellyfin](https://raw.githubusercontent.com/jellyfin/jellyfin-ux/69a2b7b1237732a134dd501ff55b9404cf2d1601/logos/SVG/jellyfin-icon--color-on-light.svg) | CC BY-SA 4.0; Jellyfin Project |
| `lidarr.svg` | [Lidarr](https://raw.githubusercontent.com/Lidarr/Lidarr/0cfa30b928f9c51edfb397b86013966f121c1c2a/frontend/src/Content/Images/logo.svg) | GPL-3.0 upstream repository; Lidarr contributors |
| `radarr.svg` | [Radarr](https://raw.githubusercontent.com/Radarr/Radarr/af7814f7a89ea46f21522f0a1b8bcdcf7644b8bf/Logo/Radarr.svg) | GPL-3.0 upstream repository; Radarr contributors |
| `sonarr.svg` | [Sonarr](https://raw.githubusercontent.com/Sonarr/Sonarr/57816c149d02f95543973fefb4780c4495f8121c/Logo/Sonarr.svg) | GPL-3.0 upstream repository; Sonarr contributors |
| `uptime-kuma.svg` | [Uptime Kuma](https://raw.githubusercontent.com/louislam/uptime-kuma/7982ce027248231ee6508e71d8c74e7109f96062/public/icon.svg) | MIT; Copyright (c) 2021 Louis Lam |
| `vaultwarden.svg` | [Vaultwarden](https://raw.githubusercontent.com/dani-garcia/vaultwarden/64895524e481492130061b95aa4433118f6b1c59/resources/vaultwarden-icon.svg) | AGPL-3.0 upstream repository; icon by Mathijs van Veluw |
| `certbot.svg` | [Certbot](https://raw.githubusercontent.com/EFForg/design/3dda980e5cfd1600d93cffd7b9f2287c0a554cbe/logos/certbot/eff-certbot-monogram.svg) | Official EFF mark; see attribution below |
| `fail2ban.png` | [Fail2Ban](https://avatars.githubusercontent.com/u/1087378?s=200&v=4) | Official organization avatar; see component/source notices below |
| `wireguard.png` | [WireGuard](https://www.wireguard.com/img/icons/favicon-256.png) | Registered trademarks of Jason A. Donenfeld |

## Notices

- **Certbot:** Certbot is a trademark of the Electronic Frontier Foundation.
  The logo is from [EFF's official design collection](https://github.com/EFForg/design/tree/master/logos/certbot),
  and is used solely to identify Certbot. See the
  [EFF trademark and brand usage policy](https://www.eff.org/pages/trademark-and-brand-usage-policy).
  A separate artwork copyright license is not declared in that repository;
  this notice does not claim the Certbot software license covers its logo.
- **Deluge:** The mark's upstream SVG metadata credits Jakub Steiner and Tuomas
  Kuosmanen and specifies [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/).
  The local PNG is an unchanged upstream export. The Deluge software's GPL-3.0
  license and OpenSSL exception are retained in [licenses/deluge.txt](licenses/deluge.txt).
- **Fail2Ban:** The PNG is the [official Fail2Ban organization avatar](https://github.com/fail2ban).
  The [upstream publication artwork](https://github.com/fail2ban/fail2ban-publications/blob/91f666136818662620269af54850f8fd49d274e0/images/logo.svg)
  retains Public Domain component notices for Jose Hevia's “Homes Clipart” and
  yves GUILLOU's “entree interdite”. Those notices do not establish a separate
  license for the complete assembled logo; no such license is asserted here.
- **Jellyfin:** Artwork is by the Jellyfin Project under
  [CC BY-SA 4.0](licenses/jellyfin.txt). The logo is used only to identify the
  Jellyfin software, following its
  [branding guidance](https://jellyfin.org/docs/general/contributing/branding/).
- **Jackett, Lidarr, Radarr, and Sonarr:** The marks are copied unchanged from
  the respective upstream repositories. Their published repository license
  texts are retained in [licenses/](licenses/).
- **Uptime Kuma:** Copyright (c) 2021 Louis Lam. Its
  [MIT license notice](licenses/uptime-kuma.txt) is retained unchanged.
- **Vaultwarden:** The SVG credits Mathijs van Veluw and retains its “Rust Logo”
  relation in the embedded metadata. The upstream repository's
  [AGPL-3.0 license](licenses/vaultwarden.txt) is retained unchanged.
- **WireGuard:** WireGuard and the WireGuard logo are registered trademarks of
  Jason A. Donenfeld. The icon is copied unchanged from
  [wireguard.com](https://www.wireguard.com/). See the
  [WireGuard trademark policy](https://www.wireguard.com/trademark-policy/).

## Configuration

The matching `.metadata.json` files in both Nanocl version directories use
`logo_url: /logos/<filename>`. Every Statefile revision inherits that folder's
setting. Raw YAML is unchanged.

IPsec and remote-nanocld retain the generic Statefile mark. OpenSSL self-signed
also retains it: the [OpenSSL logo policy](https://openssl-library.org/policies/general/trademarkpolicy/)
requires website logo use to hyperlink to OpenSSL, whereas the current logo
component displays a plain service image.
