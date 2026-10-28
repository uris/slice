import UIKit

/// UILabel keeps semantic foreground colors inside UIKit's glass content hierarchy.
@objc(SliceGlassTextSurface)
public final class GlassTextSurface: UIView {
    @objc public let label = UILabel()
    @objc public var onIntrinsicSizeChange: ((Double, Double) -> Void)?
    private var options: NSDictionary = [:]
    private var lastMeasuredSize: CGSize?

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
        label.backgroundColor = .clear
        label.isAccessibilityElement = false
        addSubview(label)
        if #available(iOS 17.0, *) {
            registerForTraitChanges([UITraitPreferredContentSizeCategory.self]) {
                (view: GlassTextSurface, _: UITraitCollection) in
                view.updateText()
            }
        }
    }

    public required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    @objc public func configure(_ options: NSDictionary) {
        self.options = options
        updateText()
    }

    private func number(_ key: String, default fallback: CGFloat) -> CGFloat {
        guard let value = options[key] as? NSNumber, value.doubleValue.isFinite else { return fallback }
        return CGFloat(value.doubleValue)
    }

    private func updateText() {
        let pointSize = max(1, number("fontSize", default: 16))
        let weightName = options["fontWeight"] as? String ?? "400"
        let weight: UIFont.Weight
        switch weightName {
        case "100": weight = .ultraLight
        case "200": weight = .thin
        case "300": weight = .light
        case "500": weight = .medium
        case "600": weight = .semibold
        case "700", "bold": weight = .bold
        case "800": weight = .heavy
        case "900": weight = .black
        default: weight = .regular
        }
        var font = UIFont.systemFont(ofSize: pointSize, weight: weight)
        if let family = options["fontFamily"] as? String, !family.isEmpty,
           let namedFont = UIFont(name: family, size: pointSize) {
            let descriptor = namedFont.fontDescriptor.addingAttributes([
                .traits: [UIFontDescriptor.TraitKey.weight: weight]
            ])
            font = UIFont(descriptor: descriptor, size: pointSize)
        }
        let allowsScaling = options["allowFontScaling"] as? Bool ?? true
        if allowsScaling {
            let metrics = UIFontMetrics(forTextStyle: .body)
            let maximum = number("maxFontSizeMultiplier", default: 0)
            if maximum >= 1 {
                font = metrics.scaledFont(for: font, maximumPointSize: pointSize * maximum, compatibleWith: traitCollection)
            } else {
                font = metrics.scaledFont(for: font, compatibleWith: traitCollection)
            }
        }
        label.font = font
        label.numberOfLines = max(0, (options["maximumLines"] as? NSNumber)?.intValue ?? 0)
        switch options["alignment"] as? String {
        case "left": label.textAlignment = .left
        case "right": label.textAlignment = .right
        case "center": label.textAlignment = .center
        default: label.textAlignment = .natural
        }
        switch options["ellipsize"] as? String {
        case "head": label.lineBreakMode = .byTruncatingHead
        case "middle": label.lineBreakMode = .byTruncatingMiddle
        case "clip": label.lineBreakMode = .byClipping
        default: label.lineBreakMode = .byTruncatingTail
        }
        if let foreground = options["foregroundColor"] as? UIColor {
            label.textColor = foreground
        } else {
            var token = options["colorToken"] as? String ?? "core-text-primary"
            if token.isEmpty { token = "core-text-primary" }
            label.textColor = SliceColors.uiColor(named: token)
        }
        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = label.textAlignment
        paragraph.lineBreakMode = label.lineBreakMode
        let scale = font.pointSize / pointSize
        let lineHeight = max(0, number("lineHeight", default: 0)) * scale
        if lineHeight > 0 {
            paragraph.minimumLineHeight = lineHeight
            paragraph.maximumLineHeight = lineHeight
        }
        // Leave foregroundColor out of the attributed string: UILabel owns the
        // dynamic semantic color rather than freezing a resolved CGColor here.
        label.attributedText = NSAttributedString(
            string: options["text"] as? String ?? "",
            attributes: [.font: font, .kern: number("letterSpacing", default: 0) * scale, .paragraphStyle: paragraph]
        )
        invalidateMeasurement()
    }

    @objc public func invalidateMeasurement() {
        lastMeasuredSize = nil
        setNeedsLayout()
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        label.frame = bounds
        guard onIntrinsicSizeChange != nil else { return }
        let natural = label.sizeThatFits(CGSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude))
        var availableWidth = natural.width
        if bounds.width > 0 { availableWidth = bounds.width }
        let constrained = label.sizeThatFits(CGSize(width: availableWidth, height: CGFloat.greatestFiniteMagnitude))
        let measured = CGSize(width: ceil(natural.width), height: ceil(constrained.height))
        guard measured != lastMeasuredSize else { return }
        lastMeasuredSize = measured
        onIntrinsicSizeChange?(Double(measured.width), Double(measured.height))
    }

    @objc public func reset() {
        onIntrinsicSizeChange = nil
        options = [:]
        label.attributedText = nil
        label.textColor = .label
        lastMeasuredSize = nil
    }
}
