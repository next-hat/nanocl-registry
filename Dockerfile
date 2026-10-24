FROM node:26.12.1-alpine3.24 AS build

WORKDIR /webapp

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install --global pnpm@12.15.0

COPY ./webapp/package.json ./webapp/pnpm-lock.yaml ./webapp/pnpm-workspace.yaml ./
# pnpm snapshots file: dependencies, so include the UI source and PostCSS config.
COPY ./webapp/packages/ui ./packages/ui

RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store

COPY ./webapp ./

RUN pnpm build && node scripts/prepare-runtime.mjs

FROM alpine:3.24.3 AS runtime-files

COPY --from=build /usr/local/bin/node /runtime/usr/local/bin/node

# Strip Node's debug symbols and assemble only its required runtime files.
RUN apk add --no-cache binutils libstdc++ libatomic ca-certificates \
    && strip --strip-all /runtime/usr/local/bin/node \
    && addgroup -S -g 1000 node \
    && adduser -S -u 1000 -G node node \
    && mkdir -p /runtime/lib /runtime/usr/lib /runtime/etc/ssl/certs /runtime/tmp \
    && cp -a /lib/ld-musl-*.so.1 /lib/libc.musl-*.so.1 /runtime/lib/ \
    && cp -a /usr/lib/libstdc++.so.* /usr/lib/libgcc_s.so.* /usr/lib/libatomic.so.* /runtime/usr/lib/ \
    && cp /etc/passwd /etc/group /runtime/etc/ \
    && cp /etc/ssl/certs/ca-certificates.crt /runtime/etc/ssl/certs/ \
    && cp -a /etc/ssl/cert.pem /runtime/etc/ssl/ \
    && chmod 1777 /runtime/tmp

FROM scratch AS runtime

COPY --from=runtime-files /runtime/ /

WORKDIR /webapp

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    NANOCL_REGISTRY_PATH=/statefiles \
    NANOCL_LATEST_VERSION=v0.18

COPY --from=build --chown=node:node /webapp/.next/runtime ./
COPY --chown=node:node ./statefiles /statefiles

USER node

EXPOSE 3000/tcp

CMD ["node", "server.js"]
