#import "RCTGlassIconView.h"
#import "SliceNative-Swift.h"
#import <React/RCTConversions.h>
#import <react/renderer/components/SliceNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/SliceNativeSpec/Props.h>
#import <react/renderer/components/SliceNativeSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;
@interface RCTGlassIconView () <RCTSliceGlassIconViewProtocol>
@end
@implementation RCTGlassIconView {
  SliceGlassIconSurface *_surface;
}
+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<SliceGlassIconComponentDescriptor>();
}
- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _props = std::make_shared<const SliceGlassIconProps>();
    _surface = [[SliceGlassIconSurface alloc] initWithFrame:self.bounds];
    self.contentView = _surface;
  }
  return self;
}
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &p = *std::static_pointer_cast<const SliceGlassIconProps>(props);
  [_surface configureWithName:@(p.iconName.c_str()) tintToken:@(p.tintToken.c_str())
                  foreground:RCTUIColorFromSharedColor(p.foregroundColor) toggled:p.toggled filled:p.filled];
  [super updateProps:props oldProps:oldProps];
}
- (void)prepareForRecycle {
  [super prepareForRecycle];
  [_surface reset];
}
@end
Class<RCTComponentViewProtocol> SliceGlassIconCls(void) { return RCTGlassIconView.class; }
