import UIKit

@main
final class PresenceSmoke: UIResponder, UIApplicationDelegate, UIWindowSceneDelegate {
    var window: UIWindow?
    var wrappers = [UIView]()
    var surfaces = [GlassButtonSurface]()
    var report = [String]()
    var animationTimer: Timer?

    func application(
        _ application: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool { true }
    func application(
        _ application: UIApplication, configurationForConnecting session: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Presence", sessionRole: session.role)
        config.delegateClass = PresenceSmoke.self
        return config
    }
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let scene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: scene)
        let controller = UIViewController()
        controller.view.backgroundColor = .black
        window.rootViewController = controller
        self.window = window
        window.makeKeyAndVisible()
        let names = [
            "Static", "Repeated clear: opacity + scale", "Initially hidden", "Nested opacity",
            "Repeated regular / recycled",
            "Stays transparent",
        ]
        for (index, name) in names.enumerated() {
            let y = CGFloat(100 + index * 110)
            let label = UILabel(frame: CGRect(x: 24, y: y, width: 350, height: 24))
            label.text = name
            label.textColor = .white
            label.font = .systemFont(ofSize: 14)
            controller.view.addSubview(label)
            let wrapper = UIView(frame: CGRect(x: 24, y: y + 30, width: 300, height: 56))
            if index == 1 || index == 5 { wrapper.layer.opacity = 0 }
            if index == 2 { wrapper.isHidden = true }
            if index == 3 { wrapper.layer.opacity = 0.1 }
            controller.view.addSubview(wrapper)
            let surface = GlassButtonSurface(frame: .zero)
            surface.configure(buttonOptions(index))
            surface.frame = CGRect(x: 0, y: 0, width: 48, height: 48)
            if index == 3 {
                let inner = UIView(frame: wrapper.bounds)
                inner.layer.opacity = 0.1
                wrapper.addSubview(inner)
                inner.addSubview(surface)
            } else {
                wrapper.addSubview(surface)
            }
            wrappers.append(wrapper)
            surfaces.append(surface)
        }
        controller.view.layoutIfNeeded()
        check(surfaces[0].isGlassInstalled, "Static glass installs in its first visible layout")
        for index in [1, 2, 3, 5] {
            check(!surfaces[index].isGlassInstalled, "Hidden/transparent case \(index) defers glass")
        }
        let separateColors = NSMutableDictionary(dictionary: buttonOptions(0))
        separateColors["label"] = "Split colors"
        separateColors["textTintToken"] = "core-text-secondary"
        separateColors["iconTintToken"] = "feedback-positive"
        surfaces[0].configure(separateColors)
        let splitConfiguration = surfaces[0].button.configuration
        check(splitConfiguration?.baseForegroundColor == SliceColors.uiColor(named: "feedback-positive"), "Icon uses the actual button base foreground")
        check(splitConfiguration?.titleTextAttributesTransformer?(AttributeContainer()).foregroundColor == SliceColors.uiColor(named: "core-text-secondary"), "Label resolves a separate Slice foreground")
        surfaces[0].button.layoutIfNeeded()
        check(surfaces[0].button.imageView?.tintColor == SliceColors.uiColor(named: "feedback-positive"), "Rendered template image receives its requested tint")
        separateColors["disabled"] = true
        surfaces[0].configure(separateColors)
        var incoming = AttributeContainer()
        incoming.foregroundColor = UIColor.gray
        check(!surfaces[0].button.isEnabled && surfaces[0].button.configuration?.titleTextAttributesTransformer?(incoming).foregroundColor != SliceColors.uiColor(named: "core-text-secondary"), "Disabled title does not force the enabled foreground")
        surfaces[0].configure(buttonOptions(0))
        check(surfaces[0].button.configuration?.baseForegroundColor == SliceColors.uiColor(named: "core-text-light"), "Shared tint resets the button foreground")
        check(surfaces[0].button.configuration?.titleTextAttributesTransformer?(incoming).foregroundColor != SliceColors.uiColor(named: "core-text-secondary"), "Shared tint removes the separate title override")
        let reattached = surfaces[4]
        reattached.removeFromSuperview()
        check(!reattached.isGlassInstalled && reattached.button.configuration == nil, "Detach clears effect state")
        wrappers[4].addSubview(reattached)
        reattached.layoutIfNeeded()
        check(reattached.isGlassInstalled, "Same-size reattach restores glass")
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
            self.wrappers[2].isHidden = false
            self.wrappers[3].layer.opacity = 1
            self.wrappers[3].subviews[0].layer.opacity = 1
            var step: CGFloat = 0
            self.animationTimer = Timer.scheduledTimer(withTimeInterval: 1.0 / 60.0, repeats: true) { timer in
                step += 1
                let progress = min(1, step / 24)
                CATransaction.begin()
                CATransaction.setDisableActions(true)
                self.wrappers[1].layer.opacity = Float(progress)
                self.wrappers[1].layer.transform = CATransform3DMakeScale(progress, progress, 1)
                CATransaction.commit()
                if progress >= 1 { timer.invalidate() }
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            for index in 0..<5 {
                self.check(self.surfaces[index].isGlassInstalled, "Visible case \(index) installs after transition")
            }
            self.check(!self.surfaces[5].isGlassInstalled, "Permanently transparent case remains uninstalled")
            self.surfaces[5].reset()
            self.wrappers[5].layer.opacity = 1
            self.surfaces[5].layoutIfNeeded()
            self.check(
                !self.surfaces[5].isGlassInstalled && self.surfaces[5].button.configuration == nil,
                "Reset cancels deferred installation")
            self.runRepeatCycle(1)
        }
    }

    private func runRepeatCycle(_ cycle: Int) {
        // Reanimated may apply entering values after the host has already been
        // mounted and configured. Exercise that ordering as well as reuse.
        for index in [1, 4] {
            let surface = surfaces[index]
            let wrapper = wrappers[index]
            if cycle == 2 {
                surface.removeFromSuperview()
                surface.reset()
                surface.configure(buttonOptions(index))
                wrapper.addSubview(surface)
                surface.layoutIfNeeded()
                check(surface.isGlassInstalled, "Host \(index) installs before delayed entering values")
            }
            wrapper.layer.opacity = 0
            wrapper.layer.transform = CATransform3DMakeScale(0, 0, 1)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            for index in [1, 4] {
                self.check(
                    !self.surfaces[index].isGlassInstalled, "Cycle \(cycle), host \(index) discards glass after exit")
            }
            var step: CGFloat = 0
            self.animationTimer = Timer.scheduledTimer(withTimeInterval: 1.0 / 60.0, repeats: true) { timer in
                step += 1
                let progress = min(1, step / 18)
                CATransaction.begin()
                CATransaction.setDisableActions(true)
                for index in [1, 4] {
                    self.wrappers[index].layer.opacity = Float(progress)
                    self.wrappers[index].layer.transform = CATransform3DMakeScale(progress, progress, 1)
                }
                CATransaction.commit()
                if progress >= 1 { timer.invalidate() }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                for index in [1, 4] {
                    self.check(
                        self.surfaces[index].isGlassInstalled,
                        "Cycle \(cycle), host \(index) restores glass on re-entry")
                    let button = self.surfaces[index].button
                    let effect = button.superview?.superview as? UIVisualEffectView
                    self.check(effect?.effect != nil, "Cycle \(cycle), host \(index) has material around its content")
                    self.check(button.configuration?.baseForegroundColor == SliceColors.uiColor(named: "core-text-light"), "Cycle \(cycle), host \(index) preserves foreground")
                }
                if cycle < 3 {
                    self.runRepeatCycle(cycle + 1)
                } else {
                    self.writeReport()
                }
            }
        }
    }

    private func buttonOptions(_ index: Int) -> NSDictionary {
        var style = "clear"
        if index == 4 { style = "regular" }
        return [
            "iconName": "home", "tintToken": "core-text-light", "glassStyle": style,
            "minimumSize": 48, "paddingLeading": 0, "paddingTrailing": 0,
        ]
    }

    private func writeReport() {
        let output = self.report.joined(separator: "\n")
        try! output.write(
            to: FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent(
                "presence.txt"), atomically: true, encoding: .utf8)
    }
    func check(_ condition: Bool, _ label: String) {
        var prefix = "PASS"
        if !condition { prefix = "FAIL" }
        report.append("\(prefix): \(label)")
    }
}
