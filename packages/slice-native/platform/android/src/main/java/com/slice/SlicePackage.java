package com.slice;

import androidx.annotation.Nullable;
import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

public final class SlicePackage extends BaseReactPackage {
  @Override @Nullable public NativeModule getModule(String name, ReactApplicationContext context) {
    if (SliceDeviceCapabilitiesModule.NAME.equals(name)) return new SliceDeviceCapabilitiesModule(context);
    if (SliceTextInputKeyboardModule.NAME.equals(name)) return new SliceTextInputKeyboardModule(context);
    return null;
  }
  @Override public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      Map<String, ReactModuleInfo> modules = new HashMap<>();
      modules.put(SliceDeviceCapabilitiesModule.NAME, new ReactModuleInfo(
          SliceDeviceCapabilitiesModule.NAME, SliceDeviceCapabilitiesModule.NAME,
          false, false, false, true));
      modules.put(SliceTextInputKeyboardModule.NAME, new ReactModuleInfo(
          SliceTextInputKeyboardModule.NAME, SliceTextInputKeyboardModule.NAME,
          false, false, false, true));
      return modules;
    };
  }
  @Override public List<ViewManager> createViewManagers(ReactApplicationContext context) {
    return Collections.singletonList(new SliceBackgroundBlurManager());
  }
}
