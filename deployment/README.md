# Deployment

This folder contains the landing page and support files for the production pipeline:

| File | Purpose |
| --- | --- |
| `landing/` | React/Vite app using Slice web components, served at www.slice-uikit.com by the Docker `landing` target. |
| `deploy-sites.sh` | Called by GitHub Actions on the VM to build, restart, and check the three sites. |

The workflow is `.github/workflows/deploy-site.yml`. Pushes to `main`, or manual
runs on `main`, validate both Storybooks and deploy the validated commit. All images
build before containers are replaced. Post-deployment failures report status and
logs; automatic rollback is not implemented.

The actual Compose configuration lives on the VM at `~/projects/docker-compose.yml`:

| Service | Dockerfile | Target | Loopback port |
| --- | --- | --- | --- |
| uikit | Dockerfile | landing | 8090 |
| uikit-react | Dockerfile | react-docs | 8091 |
| uikit-native | Dockerfile.react-native | react-native-docs | 8092 |

The build context for each service is `./uikit`. Host Nginx handles domains and TLS.
The deploy script operates only on these three services.

The workflow uses `VM_HOST`, `VM_USER`, and `SSH_PRIVATE_KEY` repository secrets.
The VM needs Docker/Compose, Git, Bash, curl, the repository key at
`~/.ssh/github_actions`, and trusted GitHub host keys in `~/.ssh/known_hosts`.
The VM checkout must be clean and is left at a detached commit after deployment.

For a manual rollout of the current VM checkout:

```sh
cd ~/projects/uikit
bash deployment/deploy-sites.sh "$HOME/projects/docker-compose.yml"
```

## Landing page development

The React app lives in `deployment/landing/src`. It uses the repository's dependencies;
there is no separate install or lockfile. Package-style Slice imports resolve to local
web sources through the Vite configuration and TypeScript paths.

```sh
npm run dev:landing
npm run build:landing
```

Development uses port 6008. The build typechecks the app and writes static files to
`deployment/landing/dist/` (ignored by Git). The Docker `landing` target builds this app
and serves its output with Nginx. Existing Compose target and port remain unchanged.
