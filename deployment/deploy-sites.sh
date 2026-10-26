#!/usr/bin/env bash
set -euo pipefail

compose_file=${1:?Usage: deploy-sites.sh /absolute/path/to/docker-compose.yml}
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
# Keep the two Storybook builds from competing for memory on the shared VM.
export COMPOSE_PARALLEL_LIMIT=1

if docker compose version >/dev/null 2>&1; then
  compose() { docker compose -f "$compose_file" "$@"; }
else
  compose() { docker-compose -f "$compose_file" "$@"; }
fi

compose config --quiet
configured=$(compose config --services)
services=(uikit uikit-react uikit-native)
for service in "${services[@]}"; do
  if ! printf '%s\n' "$configured" | grep -Fxq "$service"; then
    echo "Missing $service in $compose_file. See deployment/compose.sites.example.yml." >&2
    exit 1
  fi
done

# All builds must succeed before any running container is replaced.
compose build "${services[@]}"
compose up -d --no-deps --no-build "${services[@]}"

check_site() {
  local url=$1 expected=$2 attempt body
  for attempt in {1..30}; do
    if body=$(curl --fail --silent --show-error --max-time 5 "$url") && [[ "$body" == *"$expected"* ]]; then
      echo "Verified $url"
      return 0
    fi
    sleep 2
  done
  echo "Site check failed: $url" >&2
  compose ps "${services[@]}"
  compose logs --tail=50 "${services[@]}"
  return 1
}

check_site http://127.0.0.1:8090/ 'React Native documentation'
check_site http://127.0.0.1:8091/index.json 'entries'
check_site http://127.0.0.1:8092/index.json 'components-slicebutton--primary'
compose ps "${services[@]}"
echo 'Slice landing, React docs, and React Native docs deployed successfully.'
