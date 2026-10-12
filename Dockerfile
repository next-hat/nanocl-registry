FROM node:24-alpine3.22 AS build

WORKDIR /webapp

ENV NEXT_TELEMETRY_DISABLED=1

COPY ./webapp/package*.json ./
COPY ./webapp/packages/ui/package.json ./packages/ui/package.json

RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY ./webapp ./

RUN npm run build && node scripts/prepare-runtime.mjs

FROM alpine:3.22 AS runtime

# Keep Node and its runtime libraries; npm, Yarn, and build tooling stay behind.
RUN apk add --no-cache libstdc++ ca-certificates \
    && addgroup -S -g 1000 node \
    && adduser -S -u 1000 -G node node

COPY --from=build /usr/local/bin/node /usr/local/bin/node

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
