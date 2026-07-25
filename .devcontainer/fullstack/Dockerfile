FROM debian:bookworm

WORKDIR /workspaces

RUN apt-get update && \
    apt-get install -y curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*
RUN sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin && \
    task --version

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

RUN chown -R ${HOST_UID}:${HOST_GID} /workspaces
USER ${HOST_UID}

RUN mkdir -p /home/app/.vscode-server
# マウント時のrootによる自動作成によって権限不足になる問題を解消するため、
# コンテナにマウントするディレクトリのうちイメージ内にまだ存在しないものをあらかじめ作成する。
RUN mkdir -p \
  /home/app/.vscode-server \
  /workspaces/backend/node_modules \
  /home/app/.cache/npm

EXPOSE 2345 8080

CMD ["sleep", "infinity"]
