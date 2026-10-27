#import "RCTLiquidGlassView.h"
#import "SliceNative-Swift.h"
#import <React/RCTConversions.h>

#import <react/renderer/components/SliceNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/SliceNativeSpec/Props.h>
#import <react/renderer/components/SliceNativeSpec/RCTComponentViewHelpers.h>
#import <react/renderer/graphics/Color.h>

using namespace facebook::react;

@interface RCTLiquidGlassView () <RCTSliceLiquidGlassViewViewProtocol>
@end

@implementation RCTLiquidGlassView {
  SliceLiquidGlassSurface *_surface;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<SliceLiquidGlassViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _props = std::make_shared<const SliceLiquidGlassViewProps>();
    _surface = [[SliceLiquidGlassSurface alloc] initWithFrame:self.bounds];
    [self addSubview:_surface];
  }
  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const SliceLiquidGlassViewProps>(props);
  [_surface configureWithClear:newProps.glassStyle == SliceLiquidGlassViewGlassStyle::Clear
                         tint:RCTUIColorFromSharedColor(newProps.glassTintColor)
                  interactive:newProps.interactive
                 cornerRadius:newProps.cornerRadius];
  [super updateProps:props oldProps:oldProps];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  // Fill the entire view, including Yoga padding. Child frames already include padding.
  _surface.frame = self.bounds;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_surface.reactContentView insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  [_surface configureWithClear:NO tint:nil interactive:NO cornerRadius:24];
}

@end

// Also supports component discovery in React Native versions using the class provider.
Class<RCTComponentViewProtocol> SliceLiquidGlassViewCls(void)
{
  return RCTLiquidGlassView.class;
}
