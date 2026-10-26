# Slice site deployment

Pushes to `main` trigger `.github/workflows/deploy-site.yml`. The workflow can also
be started manually from GitHub Actions using **Run workflow** on `main`.

## Pipeline

1. Install root and native dependencies on Node 24.
2. Run lint, typechecks, native unit tests, and deployment orchestration tests.
3. Build the React and React Native Storybooks.
4. Connect to the VM, fetch `main`, and check out the exact validated commit.
   A superseded commit is skipped; local checkout changes cause a clear failure.
5. Build all three Docker images before replacing running Slice containers.
6. Restart only `uikit`, `uikit-react`, and `uikit-native` without dependencies.
7. Verify local HTTP responses on ports 8090, 8091, and 8092.

Build failures leave running containers alone. A failure after replacement is
reported with container status/logs; automatic rollback is not implemented.
Deployments are serialized. The checkout on the VM is left at a detached commit;
future deployments fetch and check out their own validated commit.

## One-time VM setup

Keep the shared Compose file at `~/projects/docker-compose.yml` and the repository
at `~/projects/uikit`. Merge the services from `compose.sites.example.yml` into the
shared file. Preserve your website, API, database, and volume definitions.

| Service | Dockerfile | Target | Loopback port |
| --- | --- | --- | --- |
| uikit | Dockerfile | landing | 8090 |
| uikit-react | Dockerfile | react-docs | 8091 |
| uikit-native | Dockerfile.react-native | react-native-docs | 8092 |

Host Nginx terminates TLS and routes each domain to its loopback port. The pipeline
does not edit Nginx, DNS, certificates, or the shared Compose file.

The workflow uses existing repository secrets `VM_HOST`, `VM_USER`, and
`SSH_PRIVATE_KEY`. The VM user needs Docker access, Git, Bash, and curl, plus the
existing `~/.ssh/github_actions` key for fetching this repository. GitHub host keys
must already be trusted in that user's `~/.ssh/known_hosts`. Docker Compose v2 is
preferred; the deploy script falls back to `docker-compose` when necessary.
The SSH action timeout is 35 minutes to allow initial image builds.

Before the first deployment, validate the shared file on the VM:

```sh
cd ~/projects
docker compose config --quiet
```

Once the validated commit is present, a manual rollout uses:

```sh
cd ~/projects/uikit
bash deployment/deploy-sites.sh "$HOME/projects/docker-compose.yml"
```

A successful rollout verifies local container endpoints. Verify the public routes
as well after the first deployment:

- https://www.slice-uikit.com
- https://react.slice-uikit.com
- https://react-native.slice-uikit.com

## Local checks

```sh
bash -n deployment/deploy-sites.sh
python3 deployment/test_deploy.py
```

The orchestration tests use fake Docker and HTTP commands, covering successful
ordering, missing services, build failure, and a failed post-deployment check.
They do not replace real container builds or verification on the VM.
