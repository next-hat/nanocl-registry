## Nanocl Registry – Next.js + Express

A simple registry browser for Nanocl statefiles. Serves HTML for browsers and raw YAML for Nanocl clients (based on User-Agent).

### Run locally

1. Install dependencies
2. Start the custom Express server

Args or environment variables:
- argv[2] or NANOCL_REGISTRY_PATH: path to base folder (default: /folder)
- argv[3] or NANOCL_LATEST_VERSION: latest Nanocl version (default: v0.18)

Routes
- / -> latest version catalog, served at the root URL
- /v0.xx -> version list page
- /v0.xx/{state} -> documentation page (Nanocl UA gets raw YAML)
- /v0.xx/{state}/{state_version} -> a specific Statefile version
- /tag/{tag} -> tag page (latest version by default)

Public pages include canonical URLs, Open Graph/Twitter previews, and structured
data. `/social/...png` serves branded 1200×630 cards from the same registry data;
`/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest` serve crawler and icon
metadata. Statefile pages share their canonical URL through native sharing or
clipboard, with a selectable link when clipboard access is unavailable.

Expected folder structure
```
/folder/{nanocl_version}/{statefilename}/
	.metadata.json                 # { "latest_version": "0.1.0" }
	{statefile_version}.yml        # YAML with Metadata: { Name, Tags, About, LongAbout }
```

Notes
- Data is loaded once at server startup and cached in memory per version.

### Statefile logos

Optionally set `logo_url` in a Statefile folder's `.metadata.json`, for example
`statefiles/v0.18/my-service/.metadata.json`:

```json
{
  "latest_version": "0.1.0",
  "logo_url": "/logos/my-service.svg"
}
```

Place that asset at `webapp/public/logos/my-service.svg`. An absolute HTTPS URL,
such as `https://example.com/my-service.svg`, is also supported. The registry
trims the setting and accepts public asset paths or HTTPS URLs without embedded
credentials. Unsupported values are ignored. A missing or failed logo displays
the Statefile icon in the same fixed-size space.

This registry setting applies to the latest entry and every revision in that
Statefile folder. It does not modify the Nanocl YAML `Metadata` block or raw
YAML downloads. Remote logos load in the browser; the server does not fetch
them. Restart the registry after changing settings because it loads them at
startup.

### Production Docker image

Build from the repository root:

```bash
docker build -t nanocl-registry .
docker run --rm -p 3000:3000 nanocl-registry
```

The build uses the committed npm lockfile. `scripts/prepare-runtime.mjs` combines
Next.js output traces with the custom Express server's dependencies, keeping
development tooling, source maps, and build caches out of the runtime image.
The container runs directly with Node as an unprivileged user and includes the
registry's Statefiles. Its defaults can be overridden with `PORT`,
`NANOCL_REGISTRY_PATH`, and `NANOCL_LATEST_VERSION`.

The UI package is a Git submodule. Initialize it before building from a fresh
clone with `git submodule update --init --recursive`.
