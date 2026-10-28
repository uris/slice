#import "RCTGlassButtonView.h"
#import "SliceNative-Swift.h"
#import <React/RCTConversions.h>
#import <react/renderer/components/SliceNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/SliceNativeSpec/EventEmitters.h>
#import <react/renderer/components/SliceNativeSpec/Props.h>
#import <react/renderer/components/SliceNativeSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface RCTGlassButtonView () <RCTSliceGlassButtonViewProtocol>
- (void)installSurface;
@end

@implementation RCTGlassButtonView {
  SliceGlassButtonSurface *_surface;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<SliceGlassButtonComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _props = std::make_shared<const SliceGlassButtonProps>();
    [self installSurface];
  }
  return self;
}

- (void)installSurface {
  UIButton *previousButton = _surface.button;
  _surface = [[SliceGlassButtonSurface alloc] initWithFrame:self.bounds];
  self.contentView = _surface;
  // Fabric diffs accessibility props against the host's previous props. Preserve
  // them on the new control so unchanged values survive that diff on reuse.
  if (previousButton) {
    UIButton *button = _surface.button;
    button.isAccessibilityElement = previousButton.isAccessibilityElement;
    button.accessibilityLabel = previousButton.accessibilityLabel;
    button.accessibilityHint = previousButton.accessibilityHint;
    button.accessibilityValue = previousButton.accessibilityValue;
    button.accessibilityTraits = previousButton.accessibilityTraits;
    button.accessibilityIdentifier = previousButton.accessibilityIdentifier;
    button.accessibilityLanguage = previousButton.accessibilityLanguage;
  }
  __weak RCTGlassButtonView *weakSelf = self;
  _surface.onButtonEvent = ^(NSDictionary *payload) {
    RCTGlassButtonView *view = weakSelf;
    if (!view || !view->_eventEmitter) return;
    auto emitter = std::static_pointer_cast<const SliceGlassButtonEventEmitter>(view->_eventEmitter);
    SliceGlassButtonEventEmitter::OnButtonEvent event;
    event.kind = [payload[@"kind"] UTF8String];
    event.locationX = [payload[@"locationX"] doubleValue];
    event.locationY = [payload[@"locationY"] doubleValue];
    event.pageX = [payload[@"pageX"] doubleValue];
    event.pageY = [payload[@"pageY"] doubleValue];
    event.timestamp = [payload[@"timestamp"] doubleValue];
    emitter->onButtonEvent(event);
  };
  _surface.onIntrinsicSizeChange = ^(double width, double height) {
    RCTGlassButtonView *view = weakSelf;
    if (!view || !view->_eventEmitter) return;
    auto emitter = std::static_pointer_cast<const SliceGlassButtonEventEmitter>(view->_eventEmitter);
    emitter->onIntrinsicSizeChange({.width = width, .height = height});
  };
}

// Fabric accessibility props belong to the actual control, avoiding duplicate elements.
- (NSObject *)accessibilityElement { return _surface.button; }

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &p = *std::static_pointer_cast<const SliceGlassButtonProps>(props);
  NSString *preference = @"system";
  if (p.themePreference == SliceGlassButtonThemePreference::Light) preference = @"light";
  if (p.themePreference == SliceGlassButtonThemePreference::Dark) preference = @"dark";
  NSString *iconPosition = @"left";
  if (p.iconPosition == SliceGlassButtonIconPosition::Right) iconPosition = @"right";
  NSString *glassStyle = @"regular";
  if (p.glassStyle == SliceGlassButtonGlassStyle::Clear) glassStyle = @"clear";
  NSMutableDictionary *options = [@{
    @"label": @(p.label.c_str()), @"iconName": @(p.iconName.c_str()),
    @"iconPosition": iconPosition,
    @"glassStyle": glassStyle,
    @"themePreference": preference, @"tintToken": @(p.tintToken.c_str()),
    @"textTintToken": @(p.textTintToken.c_str()), @"iconTintToken": @(p.iconTintToken.c_str()),
    @"disabled": @(p.disabled), @"iconSize": @(p.iconSize), @"cornerRadius": @(p.cornerRadius),
    @"minimumSize": @(p.minimumSize), @"paddingTop": @(p.paddingTop), @"paddingBottom": @(p.paddingBottom),
    @"paddingLeading": @(p.paddingLeading), @"paddingTrailing": @(p.paddingTrailing), @"iconGap": @(p.iconGap),
    @"fontFamily": @(p.fontFamily.c_str()), @"fontSize": @(p.fontSize), @"fontWeight": @(p.fontWeight.c_str()),
    @"letterSpacing": @(p.letterSpacing), @"allowFontScaling": @(p.allowFontScaling),
    @"hasLongPress": @(p.hasLongPress), @"delayLongPress": @(p.delayLongPress)
  } mutableCopy];
  UIColor *glassTint = RCTUIColorFromSharedColor(p.glassTintColor);
  if (glassTint) options[@"glassTintColor"] = glassTint;
  [_surface configure:options];
  [super updateProps:props oldProps:oldProps];
  [_surface setHitTestInsets:self.hitTestEdgeInsets];
}

- (void)updateEventEmitter:(EventEmitter::Shared const &)eventEmitter {
  [super updateEventEmitter:eventEmitter];
  [_surface invalidateMeasurement];
}

- (void)prepareForRecycle {
  [super prepareForRecycle];
  _surface.onButtonEvent = nil;
  _surface.onIntrinsicSizeChange = nil;
  [_surface reset];
  // Resetting UIButton.Configuration does not restore UIKit's cached glass
  // material after Fabric reuse. Keep the host, but give its next mount a fresh
  // native surface/control, with event handlers bound to this host again.
  [self installSurface];
}
@end

Class<RCTComponentViewProtocol> SliceGlassButtonCls(void) { return RCTGlassButtonView.class; }
