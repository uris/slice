#!/usr/bin/env bash
set -euo pipefail

compose_file=${1:?Usage: deploy-sites.sh /absolute/path/to/docker-compose.yml website|web-docs|native-docs}
site=${2:?Choose one site: website, web-docs, or native-docs}
case "$site" in
  website) service=uikit; port=8090 ;;
  web-docs) service=uikit-react; port=8091 ;;
  native-docs) service=uikit-native; port=8092 ;;
  *) echo "Unknown site: $site. Choose website, web-docs, or native-docs." >&2; exit 1 ;;
esac
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
# Keep Compose builds serial on the shared VM.
export COMPOSE_PARALLEL_LIMIT=1

if docker compose version >/dev/null 2>&1; then
  compose() { docker compose -f "$compose_file" "$@"; }
else
  compose() { docker-compose -f "$compose_file" "$@"; }
fi

compose config --quiet
configured=$(compose config --services)
if ! printf '%s\n' "$configured" | grep -Fxq "$service"; then
  echo "Missing $service in $compose_file. See deployment/README.md for required services." >&2
  exit 1
fi

# Build successfully before replacing the selected container. Other sites stay running.
compose build "$service"
compose up -d --no-deps --no-build "$service"

check_site() {
  local url=$1 attempt
  for ((attempt = 1; attempt <= 30; attempt++)); do
    if curl --fail --silent --show-error --max-time 5 --output /dev/null "$url"; then
      echo "Verified $url"
      return 0
    fi
    sleep 2
  done
  echo "Site check failed: $url" >&2
  compose ps "$service"
  compose logs --tail=50 "$service"
  return 1
}

check_site "http://127.0.0.1:$port/"
compose ps "$service"
echo "Slice $site ($service) deployed successfully."
