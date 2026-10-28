import UIKit

/// UIImageView owns the template mask and its dynamic native Slice foreground.
@objc(SliceGlassIconSurface)
public final class GlassIconSurface: UIView {
    @objc public let imageView = UIImageView()

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
        imageView.contentMode = .scaleAspectFit
        imageView.isAccessibilityElement = false
        addSubview(imageView)
    }

    public required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    @objc public func configure(name: String, tintToken: String, foreground: UIColor?, toggled: Bool, filled: Bool) {
        // Invalid names clear stale artwork when a Fabric host is reused.
        imageView.image = SliceNativeIcon(rawValue: name)?.uiImage(toggled: toggled, filled: filled)
        if let foreground {
            imageView.tintColor = foreground
        } else {
            var token = tintToken
            if token.isEmpty { token = "core-icon-primary" }
            imageView.tintColor = SliceColors.uiColor(named: token)
        }
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        imageView.frame = bounds
    }

    @objc public func reset() {
        imageView.image = nil
        imageView.tintColor = nil
    }
}
