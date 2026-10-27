package com.slice;

import androidx.annotation.Nullable;
import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import java.util.Collections;
import java.util.List;

public final class SlicePackage extends BaseReactPackage {
  @Override @Nullable public NativeModule getModule(String name, ReactApplicationContext context) {
    return SliceDeviceCapabilitiesModule.NAME.equals(name) ? new SliceDeviceCapabilitiesModule(context) : null;
  }
  @Override public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> Collections.singletonMap(SliceDeviceCapabilitiesModule.NAME, new ReactModuleInfo(
        SliceDeviceCapabilitiesModule.NAME, SliceDeviceCapabilitiesModule.NAME,
        false, false, false, true));
  }
  @Override public List<ViewManager> createViewManagers(ReactApplicationContext context) {
    return Collections.singletonList(new SliceBackgroundBlurManager());
  }
}
