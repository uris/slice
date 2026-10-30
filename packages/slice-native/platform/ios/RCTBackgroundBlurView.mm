#import "RCTBackgroundBlurView.h"
#import "SliceNative-Swift.h"
#import <React/RCTConversions.h>
#import <react/renderer/components/SliceNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/SliceNativeSpec/Props.h>
#import <react/renderer/components/SliceNativeSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;
@interface RCTBackgroundBlurView () <RCTSliceBackgroundBlurViewProtocol>
@end
@implementation RCTBackgroundBlurView {
  SliceBackgroundBlurSurface *_surface;
}
+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<SliceBackgroundBlurComponentDescriptor>();
}
- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _props = std::make_shared<const SliceBackgroundBlurProps>();
    _surface = [[SliceBackgroundBlurSurface alloc] initWithFrame:self.bounds];
    self.contentView = _surface;
  }
  return self;
}
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &p = *std::static_pointer_cast<const SliceBackgroundBlurProps>(props);
  NSString *direction = @"down";
  switch (p.direction) {
    case SliceBackgroundBlurDirection::Up: direction = @"up"; break;
    case SliceBackgroundBlurDirection::Left: direction = @"left"; break;
    case SliceBackgroundBlurDirection::Right: direction = @"right"; break;
    default: break;
  }
  [_surface configureWithIntensity:p.blurIntensity fadeStop:p.fadeStop direction:direction fallbackColor:RCTUIColorFromSharedColor(p.fallbackColor)];
  [super updateProps:props oldProps:oldProps];
}
- (void)prepareForRecycle {
  [super prepareForRecycle];
  [_surface configureWithIntensity:12 fadeStop:0 direction:@"down" fallbackColor:nil];
}
@end
Class<RCTComponentViewProtocol> SliceBackgroundBlurCls(void) { return RCTBackgroundBlurView.class; }
