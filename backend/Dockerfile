# Stage0: 共通のイメージ
FROM node:22-trixie-slim AS base

WORKDIR /app

# 開発用 ================

# Stage1: ツールのインストールと開発鯖起動
FROM base AS development

# NestJS CLIの--watchはホットリード時（プロセスツリー破棄時）に`tree-kill`ライブラリを利用し、それは`ps`コマンドを利用する。
# そのためprocpsが含まれていないslimイメージの場合は自前で入れる、またはそもそもslimをつかわないというアプローチが必要。
RUN apt-get update && \
    apt-get install -y --no-install-recommends procps && \
    rm -rf /var/lib/apt/lists/*

ARG HOST_UID=1000
ARG HOST_GID=1000
RUN <<'EOF'
set -eu

APP_USER="app"
APP_GROUP="app"

# Group

gname_by_gid=$(getent group "${HOST_GID}" | cut -d: -f1 || true) # HOST_GIDから取得できる（既存の）グループ名
gid_by_tgt_user=$(getent group "${APP_GROUP}" | cut -d: -f3 || true) # 対象グループ名から取得できる（既存の）GID

if [ -z "${gname_by_gid}" ] && [ -z "${gid_by_tgt_user}" ]; then # グループ名もGIDも存在しない
groupadd -g "${HOST_GID}" "${APP_GROUP}"
elif [ "${gname_by_gid}" = "${APP_GROUP}" ]; then # グループ名と対象グループ名が一致
:
elif [ -n "$gid_by_tgt_user" ] && [ "${gid_by_tgt_user}" != "${HOST_GID}" ]; then # グループ名は存在するが、GIDが異なる
groupmod -g "${HOST_GID}" "${APP_GROUP}"
elif [ -n "${gname_by_gid}" ] && [ "${gname_by_gid}" != "${APP_GROUP}" ]; then # GIDは存在するが、グループ名が異なる
groupmod -n "${APP_GROUP}" "${gname_by_gid}"
fi

# User

uname_by_uid=$(getent passwd "${HOST_UID}" | cut -d: -f1 || true ) # HOST_UIDから取得できる（既存の）ユーザ名
uid_by_tgt_user=$(getent passwd "${APP_USER}" | cut -d: -f3 || true) # 対象ユーザ名から取得できる（既存の）UID

if [ -z "${uname_by_uid}" ] && [ -z "${uid_by_tgt_user}" ]; then
useradd -u "${HOST_UID}" -g "${APP_GROUP}" -m -s /bin/bash "${APP_USER}"
elif [ "${uname_by_uid}" = "${APP_USER}" ]; then
:
elif [ -n "${uid_by_tgt_user}" ] && [ "${uid_by_tgt_user}" != "${HOST_UID}" ]; then
usermod -u "${HOST_UID}" "${APP_USER}"
elif [ -n "${uname_by_uid}" ] && [ "${uname_by_uid}" != "${APP_USER}" ]; then
usermod -l "${APP_USER}" -d "/home/${APP_USER}" -m "${uname_by_uid}"
fi
EOF

RUN chown -R ${HOST_UID}:${HOST_GID} /app
USER ${HOST_UID}

RUN mkdir -p /home/app/.vscode-server

ENV NODE_ENV=development
ENV npm_config_cache=/home/app/.cache/npm
RUN mkdir -p "${npm_config_cache}"

COPY --chown=${HOST_UID}:${HOST_GID} package*.json .npmrc ./
RUN npm ci

# 9229: Inspector Protocol
EXPOSE 3000 9229

CMD ["npm", "run", "start:debug"]

# デプロイ用 ================

# Stage1: ビルド
FROM base AS builder

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

# Stage2: 軽量イメージでの実行
FROM gcr.io/distroless/nodejs22-debian13:nonroot AS production

WORKDIR /app

COPY --chown=nonroot:nonroot --from=builder /app/dist ./dist
COPY --chown=nonroot:nonroot --from=builder /app/node_modules ./node_modules
COPY --chown=nonroot:nonroot --from=builder /app/package.json ./

EXPOSE 3000

CMD ["dist/main.js"]