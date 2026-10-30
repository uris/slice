import UIKit

@main
final class GlassTextSmoke: UIResponder, UIApplicationDelegate, UIWindowSceneDelegate {
    var window: UIWindow?
    var report = [String]()
    var surfaces = [GlassTextSurface]()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]?) -> Bool { true }
    func application(_ application: UIApplication, configurationForConnecting session: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Glass Text", sessionRole: session.role)
        config.delegateClass = GlassTextSmoke.self
        return config
    }
    func check(_ passed: Bool, _ message: String) {
        report.append("\(passed ? "PASS" : "FAIL"): \(message)")
    }
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let scene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: scene)
        if ProcessInfo.processInfo.arguments.contains("--interactive") {
            window.rootViewController = GlassTextScrollController()
            self.window = window
            window.makeKeyAndVisible()
            return
        }
        let controller = UIViewController()
        controller.view.backgroundColor = .systemBackground
        window.rootViewController = controller
        self.window = window
        window.makeKeyAndVisible()
        for index in 0..<2 {
            let background = UIView(frame: CGRect(x: 0, y: 100 + index * 380, width: Int(controller.view.bounds.width), height: 364))
            background.backgroundColor = .white
            if index == 1 { background.backgroundColor = .black }
            controller.view.addSubview(background)
            let heading = UILabel(frame: CGRect(x: 24, y: 12, width: 330, height: 24))
            heading.text = "Native semantic text / \(index == 0 ? "white" : "black") backdrop"
            heading.textColor = .black
            if index == 1 { heading.textColor = .white }
            heading.font = .systemFont(ofSize: 14)
            background.addSubview(heading)
            for (row, token) in ["core-text-primary", "core-text-secondary", "core-text-tertiary", "feedback-positive"].enumerated() {
                let glass = LiquidGlassSurface(frame: CGRect(x: 24, y: 48 + row * 52, width: 310, height: 44))
                background.addSubview(glass)
                let intermediate = UIView(frame: glass.bounds)
                glass.reactContentView.addSubview(intermediate)
                let text = GlassTextSurface(frame: CGRect(x: 16, y: 0, width: 215, height: 44))
                intermediate.addSubview(text)
                text.configure(["text": token, "colorToken": token, "fontSize": 18])
                let reference = UILabel(frame: CGRect(x: 235, y: 0, width: 70, height: 44))
                reference.text = "UIKit"
                reference.font = .systemFont(ofSize: 18)
                switch token {
                case "core-text-primary": reference.textColor = .label
                case "core-text-secondary": reference.textColor = .secondaryLabel
                case "core-text-tertiary": reference.textColor = .tertiaryLabel
                default: reference.textColor = SliceColors.uiColor(named: token)
                }
                // Direct Apple-style UILabel reference beside our nested renderer.
                glass.reactContentView.addSubview(reference)
                surfaces.append(text)
            }
            // Separate baseline using UIKit's system primary foreground directly.
            let primaryGlass = LiquidGlassSurface(frame: CGRect(x: 24, y: 256, width: 310, height: 44))
            background.addSubview(primaryGlass)
            let systemPrimary = UILabel(frame: CGRect(x: 16, y: 0, width: 278, height: 44))
            systemPrimary.text = "System primary (.label)"
            systemPrimary.font = .systemFont(ofSize: 18)
            systemPrimary.textColor = .label
            primaryGlass.reactContentView.addSubview(systemPrimary)
            let placeholderGlass = LiquidGlassSurface(frame: CGRect(x: 24, y: 308, width: 310, height: 44))
            background.addSubview(placeholderGlass)
            let systemPlaceholder = UILabel(frame: CGRect(x: 16, y: 0, width: 278, height: 44))
            systemPlaceholder.text = "System placeholder"
            systemPlaceholder.font = .systemFont(ofSize: 18)
            systemPlaceholder.textColor = .placeholderText
            placeholderGlass.reactContentView.addSubview(systemPlaceholder)
        }
        let icon = GlassIconSurface(frame: CGRect(x: 0, y: 0, width: 24, height: 24))
        icon.configure(name: "home", tintToken: "core-icon-primary", foreground: nil, toggled: false, filled: false)
        check(icon.imageView.image?.renderingMode == .alwaysTemplate, "Icon loads from native template bundle")
        check(icon.imageView.tintColor == SliceColors.uiColor(named: "core-icon-primary"), "Icon uses actual Slice color asset")
        icon.configure(name: "like", tintToken: "core-icon-secondary", foreground: .red, toggled: true, filled: true)
        check(icon.imageView.image != nil && icon.imageView.tintColor == .red, "Icon updates artwork and explicit foreground")
        icon.configure(name: "missing-icon", tintToken: "core-icon-primary", foreground: nil, toggled: false, filled: false)
        check(icon.imageView.image == nil, "Unknown icon clears stale template")
        icon.reset()
        check(icon.imageView.image == nil, "Icon recycling clears its image")
        let measured = GlassTextSurface(frame: CGRect(x: 0, y: 0, width: 120, height: 60))
        measured.configure(["text": "A wrapping label with multiple lines", "fontSize": 18, "maximumLines": 0])
        var measurements = [CGSize]()
        measured.onIntrinsicSizeChange = { measurements.append(CGSize(width: $0, height: $1)) }
        measured.layoutIfNeeded()
        check(measurements.last?.height ?? 0 > 30, "Constrained text reports multiline height")
        check(surfaces[0].label.textColor == SliceColors.uiColor(named: "core-text-primary"), "Primary text uses native Slice color asset")
        check(surfaces[1].label.textColor == SliceColors.uiColor(named: "core-text-secondary"), "Secondary uses native Slice color asset")
        check(surfaces[2].label.textColor == SliceColors.uiColor(named: "core-text-tertiary"), "Tertiary uses native Slice color asset")
        measured.configure(["text": "Override", "foregroundColor": UIColor.red])
        check(measured.label.textColor == UIColor.red, "Explicit foreground overrides semantic color")
        measured.reset()
        measured.configure(["text": "Reused", "colorToken": "core-text-secondary"])
        check(measured.label.textColor == SliceColors.uiColor(named: "core-text-secondary") && measured.label.text == "Reused", "Recycling clears prior text/color")
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            self.check(self.surfaces.allSatisfy { $0.label.attributedText?.attribute(.foregroundColor, at: 0, effectiveRange: nil) == nil }, "Attributed text leaves foreground ownership with UILabel")
            self.report.append("NOTE: Screenshot compares actual UIKit glass content through an intermediate UIView. This is not a React Native integration test or proof of backdrop-dependent foreground switching.")
            let directory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            try? self.report.joined(separator: "\n").write(to: directory.appendingPathComponent("glass-text.txt"), atomically: true, encoding: .utf8)
        }
    }
}

/// Manual backdrop test: the same glass surfaces stay fixed as content scrolls.
final class GlassTextScrollController: UIViewController {
    private let scrollView = UIScrollView()
    private let controls = UIView()
    private let appearance = UISegmentedControl(items: ["System", "Light", "Dark"])
    private let material = UISegmentedControl(items: ["Regular glass", "Clear glass"])
    private var bands = [UIView]()
    private var glasses = [LiquidGlassSurface]()
    private let bandHeight: CGFloat = 700

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        scrollView.alwaysBounceVertical = true
        scrollView.contentInsetAdjustmentBehavior = .never
        view.addSubview(scrollView)
        for index in 0..<12 {
            let band = UIView()
            let title = UILabel(frame: CGRect(x: 20, y: 20, width: 300, height: 30))
            title.textColor = .black
            switch index % 4 {
            case 0:
                band.backgroundColor = .white
                title.text = "WHITE BACKDROP — scroll ↓"
            case 2:
                band.backgroundColor = .black
                title.text = "BLACK BACKDROP — scroll ↓"
                title.textColor = .white
            default:
                band.backgroundColor = UIColor(white: 0.5, alpha: 1)
                title.text = "GRAY BACKDROP — scroll ↓"
            }
            title.font = .systemFont(ofSize: 14, weight: .semibold)
            band.addSubview(title)
            scrollView.addSubview(band)
            bands.append(band)
        }
        controls.backgroundColor = .secondarySystemBackground
        view.addSubview(controls)
        let instruction = UILabel(frame: CGRect(x: 16, y: 6, width: 360, height: 38))
        instruction.text = "Scroll behind the fixed glass labels.\nLeft: Slice color assets · Right: UIKit colors"
        instruction.numberOfLines = 2
        instruction.font = .systemFont(ofSize: 13)
        instruction.textColor = .label
        controls.addSubview(instruction)
        appearance.selectedSegmentIndex = 0
        appearance.addTarget(self, action: #selector(changeAppearance), for: .valueChanged)
        controls.addSubview(appearance)
        material.selectedSegmentIndex = 0
        material.addTarget(self, action: #selector(changeMaterial), for: .valueChanged)
        controls.addSubview(material)
        let tokens = ["core-text-primary", "core-text-secondary", "core-text-tertiary", "feedback-positive"]
        for token in tokens {
            let glass = makeGlass()
            let intermediate = UIView(frame: CGRect(x: 0, y: 0, width: 310, height: 44))
            glass.reactContentView.addSubview(intermediate)
            let nested = GlassTextSurface(frame: CGRect(x: 12, y: 0, width: 220, height: 44))
            nested.configure(["text": token, "colorToken": token, "fontSize": 17])
            intermediate.addSubview(nested)
            let reference = UILabel(frame: CGRect(x: 238, y: 0, width: 66, height: 44))
            reference.text = "UIKit"
            reference.font = .systemFont(ofSize: 17)
            switch token {
            case "core-text-primary": reference.textColor = .label
            case "core-text-secondary": reference.textColor = .secondaryLabel
            case "core-text-tertiary": reference.textColor = .tertiaryLabel
            default: reference.textColor = SliceColors.uiColor(named: token)
            }
            glass.reactContentView.addSubview(reference)
        }
        for (title, color) in [("System primary (.label)", UIColor.label), ("System placeholder", UIColor.placeholderText)] {
            let glass = makeGlass()
            let label = UILabel(frame: CGRect(x: 12, y: 0, width: 286, height: 44))
            label.text = title
            label.font = .systemFont(ofSize: 18)
            label.textColor = color
            glass.reactContentView.addSubview(label)
        }
        let iconGlass = makeGlass()
        let iconContainer = UIView(frame: iconGlass.bounds)
        iconGlass.reactContentView.addSubview(iconContainer)
        let names = ["home", "settings", "like", "search"]
        let iconTokens = ["core-icon-primary", "core-icon-secondary", "core-icon-tertiary", "core-icon-primary"]
        for (index, name) in names.enumerated() {
            let icon = GlassIconSurface(frame: CGRect(x: 24 + index * 76, y: 10, width: 24, height: 24))
            icon.configure(name: name, tintToken: iconTokens[index], foreground: nil, toggled: index == 2, filled: false)
            iconContainer.addSubview(icon)
        }
    }

    private func makeGlass() -> LiquidGlassSurface {
        let glass = LiquidGlassSurface(frame: CGRect(x: 0, y: 0, width: 310, height: 44))
        // Dragging over labels must still scroll the backdrop underneath them.
        glass.isUserInteractionEnabled = false
        view.addSubview(glass)
        glasses.append(glass)
        return glass
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        let top = view.safeAreaInsets.top
        controls.frame = CGRect(x: 0, y: top, width: view.bounds.width, height: 122)
        appearance.frame = CGRect(x: 16, y: 46, width: view.bounds.width - 32, height: 30)
        material.frame = CGRect(x: 16, y: 84, width: view.bounds.width - 32, height: 30)
        scrollView.frame = CGRect(x: 0, y: top + 122, width: view.bounds.width, height: view.bounds.height - top - 122)
        for (index, band) in bands.enumerated() {
            band.frame = CGRect(x: 0, y: CGFloat(index) * bandHeight, width: view.bounds.width, height: bandHeight)
        }
        scrollView.contentSize = CGSize(width: view.bounds.width, height: CGFloat(bands.count) * bandHeight)
        for (index, glass) in glasses.enumerated() {
            glass.frame = CGRect(x: (view.bounds.width - 310) / 2, y: top + 190 + CGFloat(index) * 56, width: 310, height: 44)
        }
    }

    @objc private func changeAppearance() {
        switch appearance.selectedSegmentIndex {
        case 1: overrideUserInterfaceStyle = .light
        case 2: overrideUserInterfaceStyle = .dark
        default: overrideUserInterfaceStyle = .unspecified
        }
    }

    @objc private func changeMaterial() {
        for glass in glasses {
            glass.configure(clear: material.selectedSegmentIndex == 1, tint: nil, interactive: false, cornerRadius: 24)
        }
    }
}
