# Deployment

This folder contains the deployment scripts; application sources live in `apps/`:

| File | Purpose |
| --- | --- |
| `../apps/website/` | Next.js static-export app using Slice web components, served at www.slice-uikit.com by the Docker `landing` target. |
| `deploy-sites.sh` | Called by GitHub Actions on the VM to build, restart, and check one selected site. |

## Development and deployment

Keep the normal workflow for changes in any workspace: create a branch, commit,
open a PR, let CI pass, and merge into `main`. CI runs on every PR and push to
`main` without workspace path filters. It validates library builds, tests, lint,
typechecks, and static builds for all three sites.

**Merging does not deploy.** To deploy a site after merging:

1. Open GitHub **Actions → Deploy Slice Site → Run workflow**.
2. Choose the `main` branch.
3. Choose `website`, `web-docs`, or `native-docs`, and run the workflow.

The workflow file is `.github/workflows/deploy-site.yml`; it must be merged into
`main` before the new manual inputs are available. Non-main runs fail before
building or connecting to the VM. The run validates all workspace lint/typechecks,
native tests, and the selected site's static build, then deploys that exact commit.
If `main` advances before VM checkout, the run fails and asks you to run it again.

Only the selected service is built, restarted, and health-checked. Other site
containers keep running. A failed image build leaves the running container in
place. Post-deployment health failures report status and logs for the selected
service; automatic rollback is not implemented.

Deployments share one concurrency group because they use the same VM checkout.
Let a deployment finish before dispatching the next site; GitHub concurrency can
replace an older pending run when another run is queued. Existing CI check names
are retained; repository branch-protection settings remain managed in GitHub.

The actual Compose configuration lives on the VM at `~/projects/docker-compose.yml`:

| Site selection | Service | Dockerfile | Target | Loopback port |
| --- | --- | --- | --- | --- |
| website | uikit | Dockerfile | landing | 8090 |
| web-docs | uikit-react | Dockerfile | react-docs | 8091 |
| native-docs | uikit-native | Dockerfile.react-native | react-native-docs | 8092 |

The build context for each service is `./uikit`. Host Nginx handles domains and TLS.
The deploy script operates only on these three services.

The workflow uses `VM_HOST`, `VM_USER`, and `SSH_PRIVATE_KEY` repository secrets.
The VM needs Docker/Compose, Git, Bash, curl, the repository key at
`~/.ssh/github_actions`, and trusted GitHub host keys in `~/.ssh/known_hosts`.
The VM checkout must be clean and is left at a detached commit after deployment.

For a manual rollout of the current VM checkout:

```sh
cd ~/projects/uikit
bash deployment/deploy-sites.sh "$HOME/projects/docker-compose.yml" website
```

Replace `website` with `web-docs` or `native-docs` to deploy the corresponding
Storybook. The site argument is required; the script never defaults to deploying
all services.

## Deployment script validation

```sh
python3 deployment/tests/test_deploy_sites.py
```

These tests use temporary command stubs to verify service/port selection, build
failure isolation, invalid selections, missing services, health-check diagnostics,
and the legacy Compose fallback. They do not connect to the VM or start containers.
CI runs them in the existing lint job.

## Landing page development

The Next.js App Router app lives in `apps/website/src/app`. It owns its dependencies and scripts in its workspace manifest;
installation uses the single root lockfile. Package-style Slice imports resolve to local
web sources through the Next.js configuration and TypeScript paths.

```sh
npm run dev:landing
npm run build:landing
```

Development uses port 6008. Next.js builds and typechecks the app, then writes static files to
`apps/website/out/` (ignored by Git). The Docker `landing` target builds this app
and serves its output with Nginx. Existing Compose target and port remain unchanged.
