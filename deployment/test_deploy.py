"""Exercise rollout sequencing without contacting Docker or the production VM."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('deploy-sites.sh').resolve()


class DeploymentTests(unittest.TestCase):
    def run_deploy(self, scenario='success'):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docker = root / 'docker'
            docker.write_text('''#!/usr/bin/env bash
printf '%s\\n' "$*" >> "$DEPLOY_TEST_LOG"
if [[ "$*" == 'compose version' ]]; then exit 0; fi
if [[ "$*" == *'config --services'* ]]; then
  printf 'uikit\\nuikit-react\\n'
  if [[ "$DEPLOY_TEST_SCENARIO" != missing ]]; then printf 'uikit-native\\n'; fi
fi
if [[ "$*" == *'build uikit'* && "$DEPLOY_TEST_SCENARIO" == build-failure ]]; then exit 1; fi
''')
            curl = root / 'curl'
            curl.write_text('''#!/usr/bin/env bash
if [[ "$DEPLOY_TEST_SCENARIO" == health-failure ]]; then exit 1; fi
printf 'React Native documentation entries components-slicebutton--primary'
''')
            sleep = root / 'sleep'
            sleep.write_text('#!/usr/bin/env bash\nexit 0\n')
            for program in [docker, curl, sleep]:
                program.chmod(0o755)
            log = root / 'commands.log'
            env = dict(os.environ, PATH=f'{root}{os.pathsep}{os.environ["PATH"]}',
                       DEPLOY_TEST_LOG=str(log), DEPLOY_TEST_SCENARIO=scenario)
            result = subprocess.run(['bash', str(SCRIPT), '/test/docker-compose.yml'],
                                    env=env, capture_output=True, text=True, timeout=10)
            return result, log.read_text()

    def test_builds_before_replacing_only_slice_services(self):
        result, log = self.run_deploy()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertLess(log.index('build uikit uikit-react uikit-native'),
                        log.index('up -d --no-deps --no-build uikit uikit-react uikit-native'))
        self.assertNotIn('website', log)
        self.assertNotIn('postgres', log)
        self.assertIn('deployed successfully', result.stdout)

    def test_missing_service_prevents_build_and_replacement(self):
        result, log = self.run_deploy('missing')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Missing uikit-native', result.stderr)
        self.assertNotIn('build uikit', log)
        self.assertNotIn('up -d', log)

    def test_build_failure_keeps_running_containers(self):
        result, log = self.run_deploy('build-failure')
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn('up -d', log)

    def test_failed_endpoint_reports_failure_and_container_logs(self):
        result, log = self.run_deploy('health-failure')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Site check failed', result.stderr)
        self.assertIn('logs --tail=50', log)
        self.assertNotIn('deployed successfully', result.stdout)


if __name__ == '__main__':
    unittest.main()
