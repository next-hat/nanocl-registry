## Nanocl Registry – Next.js + Express

A simple registry browser for Nanocl statefiles. Serves HTML for browsers and raw YAML for Nanocl clients (based on User-Agent).

### Run locally

1. Install dependencies
2. Start the custom Express server

Args or environment variables:
- argv[2] or NANOCL_REGISTRY_PATH: path to base folder (default: /folder)
- argv[3] or NANOCL_LATEST_VERSION: latest Nanocl version (default: v0.17)

Routes
- / -> redirects to /{latest}
- /v0.xx -> version list page
- /v0.xx/{state} -> documentation page (Nanocl UA gets raw YAML)
- /tag/{tag} -> tag page (latest version by default)

Expected folder structure
```
/folder/{nanocl_version}/{statefilename}/{statefile_version}/
	.metadata.json                 # { "latest_version": "0.1.0" }
	{statefile_version}.yml        # YAML with Metadata: { Name, Tags, About, LongAbout }
```

Notes
- Data is loaded once at server startup and cached in memory per version.

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
