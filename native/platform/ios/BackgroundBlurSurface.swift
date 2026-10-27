import UIKit

@objc(SliceBackgroundBlurSurface)
public final class BackgroundBlurSurface: UIView {
    private let effectView = UIVisualEffectView(effect: nil)
    private var animator: UIViewPropertyAnimator?
    private var intensity: Double = 12
    private var fadeStop: Double = 0
    private var direction = "down"
    private var fallbackColor: UIColor = .secondarySystemBackground
    private var observer: NSObjectProtocol?

    public override init(frame: CGRect) {
        super.init(frame: frame)
        isUserInteractionEnabled = false
        addSubview(effectView)
        observer = NotificationCenter.default.addObserver(
            forName: UIAccessibility.reduceTransparencyStatusDidChangeNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            MainActor.assumeIsolated { self?.updateEffect() }
        }
    }

    public required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    deinit {
        animator?.stopAnimation(true)
        if let observer { NotificationCenter.default.removeObserver(observer) }
    }

    @objc public func configure(intensity: Double, fadeStop: Double, direction: String, fallbackColor: UIColor?) {
        self.intensity = intensity.isFinite ? min(100, max(0, intensity)) : 12
        self.fadeStop = fadeStop.isFinite ? min(1, max(0, fadeStop)) : 0
        self.direction = direction
        self.fallbackColor = fallbackColor ?? .secondarySystemBackground
        updateEffect()
        setNeedsLayout()
    }

    public override func didMoveToWindow() {
        super.didMoveToWindow()
        updateEffect()
    }

    private func updateEffect() {
        setNeedsLayout()
        animator?.stopAnimation(true)
        animator = nil
        effectView.effect = nil
        effectView.backgroundColor = .clear
        if UIAccessibility.isReduceTransparencyEnabled {
            effectView.backgroundColor = fallbackColor
        } else if intensity > 0, window != nil {
            let animator = UIViewPropertyAnimator(duration: 1, curve: .linear) { [weak self] in
                self?.effectView.effect = UIBlurEffect(style: .regular)
            }
            animator.pausesOnCompletion = true
            animator.startAnimation()
            animator.pauseAnimation()
            animator.fractionComplete = CGFloat(intensity / 100)
            self.animator = animator
        }
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        effectView.frame = bounds
        guard fadeStop > 0, !UIAccessibility.isReduceTransparencyEnabled else {
            effectView.mask = nil
            return
        }
        // Mask the effect view directly, never its parent. Reassign after resizing
        // so UIKit refreshes its internal copies of the mask.
        let mask = UIView(frame: effectView.bounds)
        let gradient = CAGradientLayer()
        gradient.frame = mask.bounds
        gradient.colors = [UIColor.clear.cgColor, UIColor.black.cgColor, UIColor.black.cgColor]
        gradient.locations = [0, NSNumber(value: fadeStop), 1]
        switch direction {
        case "up": gradient.startPoint = CGPoint(x: 0.5, y: 1); gradient.endPoint = CGPoint(x: 0.5, y: 0)
        case "left": gradient.startPoint = CGPoint(x: 1, y: 0.5); gradient.endPoint = CGPoint(x: 0, y: 0.5)
        case "right": gradient.startPoint = CGPoint(x: 0, y: 0.5); gradient.endPoint = CGPoint(x: 1, y: 0.5)
        default: gradient.startPoint = CGPoint(x: 0.5, y: 0); gradient.endPoint = CGPoint(x: 0.5, y: 1)
        }
        mask.layer.addSublayer(gradient)
        effectView.mask = mask
    }
}
