#import "RCTGlassTextView.h"
#import "SliceNative-Swift.h"
#import <React/RCTConversions.h>
#import <react/renderer/components/SliceNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/SliceNativeSpec/EventEmitters.h>
#import <react/renderer/components/SliceNativeSpec/Props.h>
#import <react/renderer/components/SliceNativeSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface RCTGlassTextView () <RCTSliceGlassTextViewProtocol>
@end

@implementation RCTGlassTextView {
  SliceGlassTextSurface *_surface;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<SliceGlassTextComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _props = std::make_shared<const SliceGlassTextProps>();
    _surface = [[SliceGlassTextSurface alloc] initWithFrame:self.bounds];
    self.contentView = _surface;
  }
  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &p = *std::static_pointer_cast<const SliceGlassTextProps>(props);
  NSString *alignment = @"auto";
  switch (p.alignment) {
    case SliceGlassTextAlignment::Left: alignment = @"left"; break;
    case SliceGlassTextAlignment::Center: alignment = @"center"; break;
    case SliceGlassTextAlignment::Right: alignment = @"right"; break;
    default: break;
  }
  NSString *ellipsize = @"tail";
  switch (p.ellipsize) {
    case SliceGlassTextEllipsize::Head: ellipsize = @"head"; break;
    case SliceGlassTextEllipsize::Middle: ellipsize = @"middle"; break;
    case SliceGlassTextEllipsize::Clip: ellipsize = @"clip"; break;
    default: break;
  }
  NSMutableDictionary *options = [@{
    @"text": @(p.text.c_str()), @"colorToken": @(p.colorToken.c_str()),
    @"fontFamily": @(p.fontFamily.c_str()), @"fontSize": @(p.fontSize),
    @"fontWeight": @(p.fontWeight.c_str()), @"letterSpacing": @(p.letterSpacing),
    @"lineHeight": @(p.lineHeight), @"maximumLines": @(p.maximumLines),
    @"allowFontScaling": @(p.allowFontScaling), @"maxFontSizeMultiplier": @(p.maxFontSizeMultiplier),
    @"alignment": alignment, @"ellipsize": ellipsize
  } mutableCopy];
  UIColor *foreground = RCTUIColorFromSharedColor(p.foregroundColor);
  if (foreground) options[@"foregroundColor"] = foreground;
  [_surface configure:options];
  [super updateProps:props oldProps:oldProps];
}

- (void)updateEventEmitter:(EventEmitter::Shared const &)eventEmitter {
  [super updateEventEmitter:eventEmitter];
  __weak RCTGlassTextView *weakSelf = self;
  _surface.onIntrinsicSizeChange = ^(double width, double height) {
    RCTGlassTextView *view = weakSelf;
    if (!view || !view->_eventEmitter) return;
    auto emitter = std::static_pointer_cast<const SliceGlassTextEventEmitter>(view->_eventEmitter);
    emitter->onIntrinsicSizeChange({.width = width, .height = height});
  };
  [_surface invalidateMeasurement];
}

- (void)prepareForRecycle {
  [super prepareForRecycle];
  [_surface reset];
}
@end

Class<RCTComponentViewProtocol> SliceGlassTextCls(void) { return RCTGlassTextView.class; }
