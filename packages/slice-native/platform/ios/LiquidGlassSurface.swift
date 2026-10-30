import UIKit

/// UIKit surface owned by the Fabric component. React children live in contentView.
@objc(SliceLiquidGlassSurface)
public final class LiquidGlassSurface: UIView {
    private let effectView = UIVisualEffectView(effect: nil)
    private var usesClearGlass = false
    private var glassTint: UIColor?
    private var interactive = false
    private var radius: CGFloat = 24
    private var isGlassInstalled = false
    private var needsGlassReinstallation = false
    private var visibilityLayoutScheduled = false
    private var visibilityObservations: [NSKeyValueObservation] = []
    private var visibilityLayers: [CALayer] = []
    private var reduceTransparencyObserver: NSObjectProtocol?

    @objc public var reactContentView: UIView { effectView.contentView }

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
        addSubview(effectView)
        effectView.frame = bounds
        effectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        reduceTransparencyObserver = NotificationCenter.default.addObserver(
            forName: UIAccessibility.reduceTransparencyStatusDidChangeNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            MainActor.assumeIsolated { self?.invalidateEffect() }
        }
        setNeedsLayout()
    }

    public required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    deinit {
        if let observer = reduceTransparencyObserver {
            NotificationCenter.default.removeObserver(observer)
        }
    }

    @objc public func configure(
        clear: Bool,
        tint: UIColor?,
        interactive: Bool,
        cornerRadius: CGFloat
    ) {
        let nextRadius = cornerRadius.isFinite ? max(0, cornerRadius) : 24
        guard usesClearGlass != clear || glassTint != tint || self.interactive != interactive || radius != nextRadius else {
            return
        }
        usesClearGlass = clear
        glassTint = tint
        self.interactive = interactive
        radius = nextRadius
        invalidateEffect()
    }

    private func invalidateEffect() {
        needsGlassReinstallation = true
        setNeedsLayout()
    }

    /// Keep React's content container stable while discarding the material on reuse.
    @objc public func prepareForRecycle() {
        stopObservingVisibility()
        effectView.effect = nil
        effectView.backgroundColor = .clear
        isGlassInstalled = false
        needsGlassReinstallation = false
        usesClearGlass = false
        glassTint = nil
        interactive = false
        radius = 24
        setNeedsLayout()
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
        guard window != nil else {
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
        guard window != nil else { return }
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
            if self.window != nil { self.setNeedsLayout() }
        }
    }

    public override func willMove(toWindow newWindow: UIWindow?) {
        if newWindow == nil {
            // Tear down the material before a Fabric host can be recycled.
            effectView.effect = nil
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

    public override func layoutSubviews() {
        super.layoutSubviews()
        effectView.frame = bounds
        updateVisibilityObservers()
        if isGlassInstalled, !isGlassRenderable { needsGlassReinstallation = true }
        if needsGlassReinstallation {
            effectView.effect = nil
            isGlassInstalled = false
            needsGlassReinstallation = false
        }
        if !isGlassInstalled, isGlassRenderable {
            updateEffect()
            isGlassInstalled = true
        }
    }

    private func updateEffect() {
        if UIAccessibility.isReduceTransparencyEnabled {
            effectView.effect = nil
            effectView.backgroundColor = .secondarySystemBackground
        } else {
            effectView.backgroundColor = .clear
            if #available(iOS 26.0, *) {
                let effect = UIGlassEffect(style: usesClearGlass ? .clear : .regular)
                effect.tintColor = glassTint
                effect.isInteractive = interactive
                effectView.effect = effect
            } else {
                effectView.effect = UIBlurEffect(style: .systemUltraThinMaterial)
            }
        }

        if #available(iOS 26.0, *) {
            effectView.cornerConfiguration = .corners(radius: .fixed(radius))
        } else {
            effectView.layer.cornerRadius = radius
            effectView.layer.cornerCurve = .continuous
        }
        effectView.clipsToBounds = true
    }
}
