import UIKit

/// UIKit surface owned by the Fabric component. React children live in contentView.
@objc(SliceLiquidGlassSurface)
public final class LiquidGlassSurface: UIView {
    private let effectView = UIVisualEffectView(effect: nil)
    private var usesClearGlass = false
    private var glassTint: UIColor?
    private var interactive = false
    private var radius: CGFloat = 24
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
            MainActor.assumeIsolated { self?.updateEffect() }
        }
        updateEffect()
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
        updateEffect()
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
