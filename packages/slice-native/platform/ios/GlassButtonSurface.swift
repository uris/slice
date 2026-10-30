import UIKit

private final class GlassTrackingButton: UIButton {
    var hitTestInsets = UIEdgeInsets.zero
    override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
        bounds.inset(by: hitTestInsets).contains(point)
    }
}

/// Native title/image ownership lets UIButton apply the glass foreground treatment.
@objc(SliceGlassButtonSurface)
public final class GlassButtonSurface: UIView {
    @objc public let button: UIButton = GlassTrackingButton(type: .system)
    @objc public var onButtonEvent: ((NSDictionary) -> Void)?
    @objc public var onIntrinsicSizeChange: ((Double, Double) -> Void)?
    private let effectView = UIVisualEffectView(effect: nil)
    private var options = NSDictionary()
    private var lastMeasuredSize = CGSize.zero
    private var isConfigured = false
    private(set) var isGlassInstalled = false
    private var visibilityLayers: [CALayer] = []
    private var visibilityObservations: [NSKeyValueObservation] = []
    private var visibilityLayoutScheduled = false
    private var needsGlassReinstallation = false
    private var installingDuringLayout = false
    private var pressInside = false
    private var lastLocation = CGPoint.zero
    private lazy var longPress = UILongPressGestureRecognizer(target: self, action: #selector(held(_:)))

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
        addSubview(effectView)
        effectView.contentView.addSubview(button)
        button.addTarget(self, action: #selector(pressed(_:event:)), for: .primaryActionTriggered)
        button.addTarget(self, action: #selector(entered(_:event:)), for: [.touchDown, .touchDragEnter])
        button.addTarget(
            self, action: #selector(left(_:event:)),
            for: [.touchDragExit, .touchUpInside, .touchUpOutside, .touchCancel])
        button.addGestureRecognizer(longPress)
        longPress.isEnabled = false
        if #available(iOS 17.0, *) {
            registerForTraitChanges([UITraitPreferredContentSizeCategory.self]) {
                (view: GlassButtonSurface, _: UITraitCollection) in
                view.updateConfiguration()
            }
        }
    }

    public required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    private func number(_ key: String, default fallback: Double) -> CGFloat {
        let value = (options[key] as? NSNumber)?.doubleValue ?? fallback
        guard value.isFinite else { return CGFloat(fallback) }
        return CGFloat(max(0, value))
    }

    @objc public func configure(_ options: NSDictionary) {
        self.options = options
        isConfigured = true
        let preference = options["themePreference"] as? String ?? "system"
        switch preference {
        case "dark": overrideUserInterfaceStyle = .dark
        case "light": overrideUserInterfaceStyle = .light
        default: overrideUserInterfaceStyle = .unspecified
        }
        button.isEnabled = !(options["disabled"] as? Bool ?? false)
        if !button.isEnabled {
            button.cancelTracking(with: nil)
            pressInside = false
        }
        longPress.isEnabled = options["hasLongPress"] as? Bool ?? false
        longPress.minimumPressDuration = Double(number("delayLongPress", default: 500)) / 1000
        updateConfiguration()
    }

    private func updateConfiguration() {
        guard #available(iOS 26.0, *), isConfigured else { return }
        let clear = options["glassStyle"] as? String == "clear"
        let glassTint = options["glassTintColor"] as? UIColor
        // Creating glass while an entering ancestor has near-zero opacity can
        // permanently suppress UIKit's material. Keep content measurable using
        // a plain configuration, then install glass from a visible layout pass.
        let canInstallGlass =
            isGlassRenderable && !needsGlassReinstallation && (isGlassInstalled || installingDuringLayout)
        // Keep the control plain inside the glass content, as with glass inputs.
        // UIButton.Configuration.glass() overrides custom image foreground colors.
        var config = UIButton.Configuration.plain()
        if canInstallGlass {
            var selectedEffect = UIGlassEffect(style: .regular)
            if clear { selectedEffect = UIGlassEffect(style: .clear) }
            selectedEffect.tintColor = glassTint
            selectedEffect.isInteractive = button.isEnabled
            effectView.effect = selectedEffect
        } else {
            effectView.effect = nil
        }
        let tintToken = options["tintToken"] as? String ?? ""
        var tint = UIColor.label
        if !tintToken.isEmpty { tint = SliceColors.uiColor(named: tintToken) }
        let textToken = options["textTintToken"] as? String ?? ""
        let iconToken = options["iconTintToken"] as? String ?? ""
        var textTint = tint
        if !textToken.isEmpty { textTint = SliceColors.uiColor(named: textToken) }
        var iconTint = textTint
        if !iconToken.isEmpty { iconTint = SliceColors.uiColor(named: iconToken) }
        // The plain control retains UIKit events and disabled treatment while
        // the surrounding effect supplies glass and adaptive content rendering.
        button.tintColor = iconTint
        config.baseForegroundColor = iconTint
        let enabled = button.isEnabled
        config.imageColorTransformer = UIConfigurationColorTransformer { incoming in
            if enabled { return iconTint }
            return incoming
        }
        let overridesTitleColor = enabled && textTint != iconTint
        let title = options["label"] as? String ?? ""
        if !title.isEmpty { config.title = title }
        config.titleLineBreakMode = .byTruncatingTail
        config.imagePadding = number("iconGap", default: 6)
        config.imagePlacement = .leading
        if options["iconPosition"] as? String == "right" { config.imagePlacement = .trailing }
        config.contentInsets = NSDirectionalEdgeInsets(
            top: number("paddingTop", default: 0), leading: number("paddingLeading", default: 16),
            bottom: number("paddingBottom", default: 0), trailing: number("paddingTrailing", default: 16)
        )
        if let name = options["iconName"] as? String, !name.isEmpty, let icon = SliceNativeIcon(rawValue: name) {
            let image = icon.uiImage()
            let dimension = number("iconSize", default: 24)
            if dimension > 0 {
                let renderer = UIGraphicsImageRenderer(size: CGSize(width: dimension, height: dimension))
                config.image = renderer.image { _ in
                    image.draw(in: CGRect(x: 0, y: 0, width: dimension, height: dimension))
                }.withRenderingMode(.alwaysTemplate)
            }
        }
        let pointSize = max(1, number("fontSize", default: 20))
        let family = options["fontFamily"] as? String ?? ""
        let weightNumber = Double(options["fontWeight"] as? String ?? "400") ?? 400
        let weights: [Int: UIFont.Weight] = [
            100: .ultraLight, 200: .thin, 300: .light, 400: .regular, 500: .medium, 600: .semibold, 700: .bold,
            800: .heavy, 900: .black,
        ]
        let weight = weights[Int(weightNumber)] ?? .regular
        var font: UIFont
        if UIFont.familyNames.contains(family) {
            let descriptor = UIFontDescriptor(fontAttributes: [
                .family: family, .traits: [UIFontDescriptor.TraitKey.weight: weight.rawValue],
            ])
            font = UIFont(descriptor: descriptor, size: pointSize)
        } else {
            font = UIFont(name: family, size: pointSize) ?? .systemFont(ofSize: pointSize, weight: weight)
        }
        if options["allowFontScaling"] as? Bool ?? true {
            font = UIFontMetrics(forTextStyle: .body).scaledFont(for: font, compatibleWith: traitCollection)
        }
        let spacing = (options["letterSpacing"] as? NSNumber)?.doubleValue ?? 0
        config.titleTextAttributesTransformer = UIConfigurationTextAttributesTransformer { incoming in
            var outgoing = incoming
            // UIKit still owns disabled foreground treatment.
            if overridesTitleColor { outgoing.foregroundColor = textTint }
            outgoing.font = font
            outgoing.kern = 0
            if spacing.isFinite { outgoing.kern = spacing }
            return outgoing
        }
        button.configuration = config
        isGlassInstalled = canInstallGlass
        updateVisibilityObservers()
        let radius = number("cornerRadius", default: 1000)
        if radius >= 1000 {
            effectView.cornerConfiguration = .capsule()
            button.cornerConfiguration = .capsule()
        } else {
            effectView.cornerConfiguration = .corners(radius: .fixed(radius))
            button.cornerConfiguration = .corners(radius: .fixed(radius))
        }
        invalidateMeasurement()
    }

    private var isGlassRenderable: Bool {
        guard window != nil, bounds.width > 0, bounds.height > 0 else { return false }
        var opacity: Float = 1
        var ancestor: UIView? = self
        while let view = ancestor {
            if view.isHidden || view.layer.isHidden { return false }
            // Reanimated writes layer.opacity directly, so inspect the layer
            // rather than relying on UIView's alpha setter being called.
            opacity *= view.layer.opacity
            ancestor = view.superview
        }
        // UIKit's exact cutoff is undocumented. This matches the conservative
        // visibility threshold used by Expo's upstream glass workaround:
        // https://github.com/expo/expo/pull/48994
        return opacity > 0.02
    }

    private func stopObservingVisibility() {
        for observation in visibilityObservations { observation.invalidate() }
        visibilityObservations.removeAll()
        visibilityLayers.removeAll()
    }

    private func updateVisibilityObservers() {
        guard isConfigured, window != nil else {
            stopObservingVisibility()
            return
        }
        var layers: [CALayer] = []
        var ancestor: UIView? = self
        while let view = ancestor {
            layers.append(view.layer)
            ancestor = view.superview
        }
        if layers == visibilityLayers { return }
        stopObservingVisibility()
        visibilityLayers = layers
        for layer in layers {
            visibilityObservations.append(
                layer.observe(\.opacity) { [weak self] _, _ in
                    MainActor.assumeIsolated { self?.scheduleVisibilityLayout() }
                })
            visibilityObservations.append(
                layer.observe(\.isHidden) { [weak self] _, _ in
                    MainActor.assumeIsolated { self?.scheduleVisibilityLayout() }
                })
        }
    }

    private func scheduleVisibilityLayout() {
        guard isConfigured, window != nil else { return }
        let renderable = isGlassRenderable
        // Keep observing after installation: an exiting or reused ancestor can
        // invalidate UIKit's material before the next entering animation starts.
        // Remember even a zero-opacity change reversed within this run loop.
        if isGlassInstalled, !renderable { needsGlassReinstallation = true }
        guard !visibilityLayoutScheduled, needsGlassReinstallation || renderable != isGlassInstalled else { return }
        visibilityLayoutScheduled = true
        // Reconcile outside KVO delivery, after the animation's property writes.
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            self.visibilityLayoutScheduled = false
            if self.isConfigured, self.window != nil { self.setNeedsLayout() }
        }
    }

    public override func willMove(toWindow newWindow: UIWindow?) {
        if newWindow == nil {
            // Tear down the material before a Fabric host can be recycled.
            effectView.effect = nil
            button.configuration = nil
            isGlassInstalled = false
            needsGlassReinstallation = false
            stopObservingVisibility()
        }
        super.willMove(toWindow: newWindow)
    }

    public override func didMoveToWindow() {
        super.didMoveToWindow()
        updateVisibilityObservers()
        if window != nil { setNeedsLayout() }
    }

    public override func didMoveToSuperview() {
        super.didMoveToSuperview()
        updateVisibilityObservers()
        scheduleVisibilityLayout()
    }

    @objc public func setHitTestInsets(_ insets: UIEdgeInsets) {
        (button as? GlassTrackingButton)?.hitTestInsets = insets
    }

    public override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
        button.point(inside: convert(point, to: button), with: event)
    }

    @objc public func invalidateMeasurement() {
        lastMeasuredSize = .zero
        setNeedsLayout()
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        effectView.frame = bounds
        button.frame = effectView.contentView.bounds
        updateVisibilityObservers()
        if isGlassInstalled, !isGlassRenderable { needsGlassReinstallation = true }
        if needsGlassReinstallation {
            effectView.effect = nil
            button.configuration = nil
            isGlassInstalled = false
            needsGlassReinstallation = false
            updateConfiguration()
        }
        if isConfigured, !isGlassInstalled, isGlassRenderable {
            installingDuringLayout = true
            updateConfiguration()
            installingDuringLayout = false
        }
        guard onIntrinsicSizeChange != nil else { return }
        let ideal = button.sizeThatFits(
            CGSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude))
        let minimum = number("minimumSize", default: 48)
        let hasTitle = !(options["label"] as? String ?? "").isEmpty
        var width = ideal.width
        if !hasTitle { width = max(minimum, ideal.width) }
        let measured = CGSize(width: ceil(width), height: ceil(max(minimum, ideal.height)))
        if measured != lastMeasuredSize {
            lastMeasuredSize = measured
            onIntrinsicSizeChange?(Double(measured.width), Double(measured.height))
        }
    }

    private func emit(_ kind: String, event: UIEvent? = nil) {
        guard button.isEnabled else { return }
        if let touch = event?.allTouches?.first { lastLocation = touch.location(in: button) }
        let page = button.convert(lastLocation, to: window)
        onButtonEvent?([
            "kind": kind, "locationX": lastLocation.x, "locationY": lastLocation.y,
            "pageX": page.x, "pageY": page.y,
            "timestamp": (event?.timestamp ?? ProcessInfo.processInfo.systemUptime) * 1000,
        ])
    }

    @objc private func pressed(_ sender: UIButton, event: UIEvent?) { emit("press", event: event) }
    @objc private func entered(_ sender: UIButton, event: UIEvent?) {
        guard !pressInside else { return }
        pressInside = true
        emit("pressIn", event: event)
    }
    @objc private func left(_ sender: UIButton, event: UIEvent?) {
        guard pressInside else { return }
        pressInside = false
        emit("pressOut", event: event)
    }
    @objc private func held(_ recognizer: UILongPressGestureRecognizer) {
        if recognizer.state == .began {
            lastLocation = recognizer.location(in: button)
            emit("longPress")
        }
    }

    @objc public func reset() {
        pressInside = false
        lastLocation = .zero
        button.cancelTracking(with: nil)
        button.isEnabled = true
        longPress.isEnabled = false
        effectView.effect = nil
        button.configuration = nil
        isConfigured = false
        isGlassInstalled = false
        visibilityLayoutScheduled = false
        needsGlassReinstallation = false
        stopObservingVisibility()
        overrideUserInterfaceStyle = .unspecified
        options = NSDictionary()
        setHitTestInsets(.zero)
        lastMeasuredSize = .zero
    }
}
