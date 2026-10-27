#import "SliceDeviceCapabilities.h"
#import <UIKit/UIKit.h>
#import <sys/utsname.h>
#import <cstdlib>

@implementation SliceDeviceCapabilities
RCT_EXPORT_MODULE(SliceDeviceCapabilities)

+ (BOOL)requiresMainQueueSetup { return NO; }

- (facebook::react::ModuleConstants<JS::NativeDeviceCapabilities::Constants>)constantsToExport {
  return [self getConstants];
}

- (facebook::react::ModuleConstants<JS::NativeDeviceCapabilities::Constants>)getConstants {
  struct utsname systemInfo;
  NSString *model = uname(&systemInfo) == 0 ? [NSString stringWithUTF8String:systemInfo.machine] : @"";
  // Simulator uname reports the host architecture; use the simulated device instead.
  const char *simulatorModel = getenv("SIMULATOR_MODEL_IDENTIFIER");
  if (simulatorModel != nullptr) { model = [NSString stringWithUTF8String:simulatorModel]; }
  BOOL supportsGlass = NO;
  if (@available(iOS 26.0, *)) { supportsGlass = YES; }
  return facebook::react::typedConstants<JS::NativeDeviceCapabilities::Constants>({
    .supportsLiquidGlass = (bool)supportsGlass,
    .supportsNativeBlur = true,
    .deviceName = [UIDevice currentDevice].name,
    .deviceModel = model ?: @"",
  });
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeDeviceCapabilitiesSpecJSI>(params);
}
@end
