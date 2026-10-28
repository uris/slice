import UIKit

/// Visual comparison of direct UIKit glass against Slice's deferred installation.
@main
final class GlassButtonTintSmoke: UIResponder, UIApplicationDelegate, UIWindowSceneDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]?) -> Bool { true }
    func application(_ application: UIApplication, configurationForConnecting session: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let configuration = UISceneConfiguration(name: "Tint comparison", sessionRole: session.role)
        configuration.delegateClass = Self.self
        return configuration
    }

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let scene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: scene)
        let controller = UIViewController()
        controller.overrideUserInterfaceStyle = .light
        controller.view.backgroundColor = .white
        window.rootViewController = controller
        self.window = window
        window.makeKeyAndVisible()
        let blue = SliceColors.uiColor(named: "core-link-primary")
        let image = SliceNativeIcon(rawValue: "home")!.uiImage()
        for index in 0..<3 {
            let button = UIButton(type: .system)
            var configuration = UIButton.Configuration.glass()
            configuration.title = "Direct asset template"
            configuration.baseForegroundColor = blue
            configuration.image = image.withRenderingMode(.alwaysTemplate)
            if index == 1 {
                configuration.title = "Explicit image transformer"
                configuration.imageColorTransformer = UIConfigurationColorTransformer { _ in blue }
                let renderer = UIGraphicsImageRenderer(size: CGSize(width: 24, height: 24))
                configuration.image = renderer.image { _ in image.draw(in: CGRect(x: 0, y: 0, width: 24, height: 24)) }.withRenderingMode(.alwaysTemplate)
            }
            if index == 2 {
                configuration = .clearGlass()
                configuration.baseForegroundColor = blue
                configuration.imageColorTransformer = UIConfigurationColorTransformer { _ in blue }
                configuration.title = "Clear glass + transformer"
                configuration.image = image.withRenderingMode(.alwaysTemplate)
            }
            button.tintColor = blue
            button.configuration = configuration
            button.frame = CGRect(x: 24, y: 140 + index * 90, width: 340, height: 56)
            controller.view.addSubview(button)
        }
        let managed = GlassButtonSurface(frame: CGRect(x: 24, y: 410, width: 340, height: 56))
        managed.configure([
            "label": "Slice lifecycle managed", "iconName": "home", "iconSize": 24,
            "tintToken": "core-link-primary", "textTintToken": "core-link-primary",
            "iconTintToken": "core-link-primary", "themePreference": "light",
        ])
        controller.view.addSubview(managed)
    }
}
