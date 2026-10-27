package com.slice;

import androidx.annotation.Nullable;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.SliceBackgroundBlurManagerDelegate;
import com.facebook.react.viewmanagers.SliceBackgroundBlurManagerInterface;

public final class SliceBackgroundBlurManager extends SimpleViewManager<SliceBackgroundBlurView>
    implements SliceBackgroundBlurManagerInterface<SliceBackgroundBlurView> {
  private final ViewManagerDelegate<SliceBackgroundBlurView> delegate = new SliceBackgroundBlurManagerDelegate<>(this);
  @Override protected ViewManagerDelegate<SliceBackgroundBlurView> getDelegate() { return delegate; }
  @Override public String getName() { return "SliceBackgroundBlur"; }
  @Override protected SliceBackgroundBlurView createViewInstance(ThemedReactContext context) {
    return new SliceBackgroundBlurView(context);
  }
  @Override @ReactProp(name = "blurIntensity", defaultDouble = 12)
  public void setBlurIntensity(SliceBackgroundBlurView view, double value) { view.setIntensity(value); }
  @Override @ReactProp(name = "fallbackColor", customType = "Color")
  public void setFallbackColor(SliceBackgroundBlurView view, @Nullable Integer value) { view.setFallbackColor(value); }
  // Directional fading is intentionally iOS-only.
  @Override @ReactProp(name = "fadeStop", defaultDouble = 0)
  public void setFadeStop(SliceBackgroundBlurView view, double value) {}
  @Override @ReactProp(name = "direction")
  public void setDirection(SliceBackgroundBlurView view, @Nullable String value) {}
}
