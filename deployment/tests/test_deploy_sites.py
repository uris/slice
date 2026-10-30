"""Exercise deployment selection and failure handling without a Docker daemon or VM."""

import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "deploy-sites.sh"


class DeploySitesTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="slice-deployment-")
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.log = self.root / "calls.log"
        self.env = {
            **os.environ,
            "PATH": f"{self.root}{os.pathsep}{os.environ['PATH']}",
            "DEPLOY_TEST_LOG": str(self.log),
        }
        self.command("docker", '''
if [ "$*" = 'compose version' ]; then
  exit "${PLUGIN_STATUS:-0}"
fi
printf 'docker %s\\n' "$*" >> "$DEPLOY_TEST_LOG"
[ "$1" != compose ] || shift
shift 2
case "$1" in
  config)
    if [ "$2" = --services ]; then
      printf '%s\\n' "${CONFIGURED_SERVICES:-uikit uikit-react uikit-native}" | tr ' ' '\\n'
    fi ;;
  build) exit "${BUILD_STATUS:-0}" ;;
esac
''')
        self.command("docker-compose", 'printf "legacy-compose\\n" >> "$DEPLOY_TEST_LOG"\nexec docker compose "$@"\n')
        self.command("curl", '''
printf 'curl %s\\n' "$*" >> "$DEPLOY_TEST_LOG"
exit "${HEALTH_STATUS:-0}"
''')
        self.command("sleep", "exit 0\n")

    def command(self, name, body):
        path = self.root / name
        path.write_text("#!/usr/bin/env bash\nset -eu\n" + body)
        path.chmod(0o755)

    def deploy(self, site, **settings):
        result = subprocess.run(
            ["bash", str(SCRIPT), "/fake/compose.yml", site],
            env={**self.env, **settings}, text=True, capture_output=True,
        )
        calls = self.log.read_text().splitlines() if self.log.exists() else []
        return result, calls

    def test_each_site_builds_restarts_and_checks_only_its_service(self):
        for site, service, port in [
            ("website", "uikit", 8090),
            ("web-docs", "uikit-react", 8091),
            ("native-docs", "uikit-native", 8092),
        ]:
            with self.subTest(site=site):
                self.log.unlink(missing_ok=True)
                result, calls = self.deploy(site)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual([c for c in calls if " build " in c], [
                    f"docker compose -f /fake/compose.yml build {service}"
                ])
                self.assertEqual([c for c in calls if " up " in c], [
                    f"docker compose -f /fake/compose.yml up -d --no-deps --no-build {service}"
                ])
                checks = [c for c in calls if c.startswith("curl ")]
                self.assertEqual(len(checks), 1)
                self.assertTrue(checks[0].endswith(f"http://127.0.0.1:{port}/"))

    def test_unknown_site_is_rejected_before_docker(self):
        result, calls = self.deploy("not-a-site")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, [])

    def test_build_failure_preserves_running_containers(self):
        result, calls = self.deploy("web-docs", BUILD_STATUS="1")
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(any(" up " in c or c.startswith("curl ") for c in calls))

    def test_missing_selected_service_stops_before_build(self):
        result, calls = self.deploy("native-docs", CONFIGURED_SERVICES="uikit uikit-react")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Missing uikit-native", result.stderr)
        self.assertFalse(any(" build " in c or " up " in c for c in calls))

    def test_failed_health_check_reports_only_selected_service(self):
        result, calls = self.deploy("native-docs", HEALTH_STATUS="1")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(len([c for c in calls if c.startswith("curl ")]), 30)
        self.assertIn("docker compose -f /fake/compose.yml logs --tail=50 uikit-native", calls)
        self.assertFalse(any(c.endswith(" uikit") or c.endswith(" uikit-react") for c in calls))

    def test_legacy_compose_fallback(self):
        result, calls = self.deploy("website", PLUGIN_STATUS="1")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("legacy-compose", calls)
        self.assertIn("docker compose -f /fake/compose.yml build uikit", calls)


if __name__ == "__main__":
    unittest.main()
