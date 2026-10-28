import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
if (process.platform !== 'darwin')
	throw new Error('This native smoke test requires macOS, Xcode and a booted iOS 26+ simulator.');
const args = process.argv.slice(2);
const deviceIndex = args.indexOf('--device');
const interactive = args.includes('--interactive');
const keepInstalled = interactive || args.includes('--keep-installed');
let device;
if (deviceIndex !== -1) device = args[deviceIndex + 1];
const xcrun = (...args) => execFileSync('xcrun', args, { encoding: 'utf8' });
if (!device) {
	const inventory = JSON.parse(xcrun('simctl', 'list', 'devices', 'booted', '--json'));
	const booted = Object.values(inventory.devices)
		.flat()
		.filter((device) => device.isAvailable);
	if (booted.length !== 1) throw new Error('Boot one iOS 26+ simulator or pass --device <UDID>.');
	device = booted[0].udid;
}
const temporary = mkdtempSync(join(tmpdir(), 'slice-glass-text-'));
const app = join(temporary, 'SliceGlassTextSmoke.app');
const identifier = 'com.slice.GlassTextSmoke';
const output = join(root, 'coverage', 'ios-glass-text');
let installed = false;
const plist = (path, values) =>
	writeFileSync(
		path,
		`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>${values}</dict></plist>\n`,
	);
try {
	mkdirSync(app);
	mkdirSync(output, { recursive: true });
	plist(
		join(app, 'Info.plist'),
		`
<key>CFBundleIdentifier</key><string>${identifier}</string>
<key>CFBundleExecutable</key><string>SliceGlassTextSmoke</string>
<key>CFBundleName</key><string>Slice Glass Text</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleVersion</key><string>1</string>
<key>CFBundleShortVersionString</key><string>1.0</string>
<key>MinimumOSVersion</key><string>26.0</string>
<key>UIDeviceFamily</key><array><integer>1</integer><integer>2</integer></array>
<key>UILaunchScreen</key><dict/>
<key>UIApplicationSceneManifest</key><dict><key>UIApplicationSupportsMultipleScenes</key><false/></dict>`,
	);
	for (const name of ['Colors', 'Icons']) {
		const bundleName = `SliceNative${name}`;
		const bundle = join(app, `${bundleName}.bundle`);
		mkdirSync(bundle);
		xcrun(
			'actool',
			join(root, 'platform/ios/Resources', `Slice${name}.xcassets`),
			'--compile',
			bundle,
			'--platform',
			'iphonesimulator',
			'--minimum-deployment-target',
			'26.0',
			'--target-device',
			'iphone',
			'--target-device',
			'ipad',
		);
		plist(
			join(bundle, 'Info.plist'),
			`<key>CFBundleIdentifier</key><string>com.slice.${bundleName}</string><key>CFBundleName</key><string>${bundleName}</string><key>CFBundlePackageType</key><string>BNDL</string>`,
		);
	}
	let architecture = 'arm64';
	if (process.arch === 'x64') architecture = 'x86_64';
	const sdk = xcrun('--sdk', 'iphonesimulator', '--show-sdk-path').trim();
	xcrun(
		'--sdk',
		'iphonesimulator',
		'swiftc',
		'-target',
		`${architecture}-apple-ios26.0-simulator`,
		'-sdk',
		sdk,
		'-module-cache-path',
		join(temporary, 'modules'),
		'-o',
		join(app, 'SliceGlassTextSmoke'),
		join(root, 'platform/ios/SliceColors.generated.swift'),
		join(root, 'platform/ios/LiquidGlassSurface.swift'),
		join(root, 'platform/ios/GlassTextSurface.swift'),
		join(root, 'platform/ios/SliceIcons.generated.swift'),
		join(root, 'platform/ios/GlassIconSurface.swift'),
		join(root, 'tests/ios/GlassTextSmoke.swift'),
	);
	xcrun('simctl', 'install', device, app);
	installed = true;
	const container = xcrun('simctl', 'get_app_container', device, identifier, 'data').trim();
	const reportPath = join(container, 'Documents', 'glass-text.txt');
	rmSync(reportPath, { force: true });
	xcrun('simctl', 'launch', device, identifier);
	const deadline = Date.now() + 15000;
	while (!existsSync(reportPath) && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 100));
	if (!existsSync(reportPath))
		throw new Error('Native glass text smoke test timed out; check the simulator for an app crash.');
	const report = readFileSync(reportPath, 'utf8');
	writeFileSync(join(output, 'report.txt'), report);
	xcrun('simctl', 'io', device, 'screenshot', join(output, 'screenshot.png'));
	console.log(report);
	if (report.includes('FAIL:')) throw new Error(`Native glass text regression. See ${output}`);
	console.log(`Native glass text checks passed. Report and screenshot: ${output}`);
	if (interactive) {
		xcrun('simctl', 'terminate', device, identifier);
		xcrun('simctl', 'launch', device, identifier, '--interactive');
		await new Promise((resolve) => setTimeout(resolve, 2000));
		xcrun('simctl', 'io', device, 'screenshot', join(output, 'interactive.png'));
	}
	if (keepInstalled) console.log(`Left ${identifier} installed and running on ${device}.`);
} finally {
	if (installed && !keepInstalled) {
		try {
			xcrun('simctl', 'terminate', device, identifier);
		} catch {}
		try {
			xcrun('simctl', 'uninstall', device, identifier);
		} catch {}
	}
	rmSync(temporary, { recursive: true, force: true });
}
