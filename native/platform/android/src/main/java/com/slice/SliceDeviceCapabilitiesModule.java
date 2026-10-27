package com.slice;

import android.os.Build;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import java.util.HashMap;
import java.util.Map;

@ReactModule(name = SliceDeviceCapabilitiesModule.NAME)
public final class SliceDeviceCapabilitiesModule extends NativeDeviceCapabilitiesSpec {
  public static final String NAME = "SliceDeviceCapabilities";

  public SliceDeviceCapabilitiesModule(ReactApplicationContext context) { super(context); }

  @Override public String getName() { return NAME; }

  @Override protected Map<String, Object> getTypedExportedConstants() {
    Map<String, Object> result = new HashMap<>();
    result.put("supportsLiquidGlass", false);
    result.put("supportsNativeBlur", SliceBackgroundBlurView.supportsNativeBlur());
    result.put("deviceName", Build.MODEL);
    result.put("deviceModel", Build.MODEL);
    return result;
  }
}
