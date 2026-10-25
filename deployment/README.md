# Slice documentation deployment

The VM's host Nginx handles TLS and routes to these loopback ports. The shared
Compose file remains at `~/projects/docker-compose.yml` on the VM.

Docker targets:

- `react-docs`: existing web Storybook, also the default Docker build target.
- `landing`: static platform chooser from `deployment/landing/`.
- `react-native-docs` in `Dockerfile.react-native`: native Storybook. Not ready until a root `build-storybook:native`
  script and its configuration are implemented. It must accept Storybook's
  `--output-dir` option. Do not enable this service before that work is complete.

For the first migration step, keep the existing `uikit` service unchanged and
add this service to the VM Compose file:

```yaml
  uikit-react:
    build:
      context: ./uikit
      target: react-docs
    container_name: uikit-react
    ports:
      - "127.0.0.1:8091:80"
    restart: unless-stopped
```

Verify React docs at https://react.slice-uikit.com before changing `uikit` to:

```yaml
  uikit:
    build:
      context: ./uikit
      target: landing
    container_name: uikit
    ports:
      - "127.0.0.1:8090:80"
    restart: unless-stopped
```

Once native Storybook is implemented, add:

```yaml
  uikit-native:
    build:
      context: ./uikit
      dockerfile: Dockerfile.react-native
      target: react-native-docs
    container_name: uikit-native
    ports:
      - "127.0.0.1:8092:80"
    restart: unless-stopped
```

The GitHub deployment workflow discovers only these three Slice service names
from the VM Compose file. It builds all selected images before replacing
containers, without starting dependencies or touching the other application
services. The workflow skips native while its build script is missing; keep native absent until it builds successfully. Existing GitHub host
keys must be present in the VM deployment user's `~/.ssh/known_hosts`.

To deploy manually from the VM after editing Compose:

```sh
cd ~/projects
docker compose build uikit uikit-react
docker compose up -d --no-deps --no-build uikit uikit-react
```

The landing page's Native link will be usable once native docs are deployed.
