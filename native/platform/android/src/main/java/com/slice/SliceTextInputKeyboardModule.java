package com.slice;

import android.content.Context;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.views.textinput.ReactEditText;

@ReactModule(name = SliceTextInputKeyboardModule.NAME)
public final class SliceTextInputKeyboardModule extends NativeTextInputKeyboardSpec {
  public static final String NAME = "SliceTextInputKeyboard";

  public SliceTextInputKeyboardModule(ReactApplicationContext context) { super(context); }

  @Override public String getName() { return NAME; }

  @Override public void restartInput(double viewTag, String returnKeyType, @Nullable String returnKeyLabel) {
    UiThreadUtil.runOnUiThread(() -> {
      ReactApplicationContext context = getReactApplicationContext();
      int tag = (int) viewTag;
      UIManager manager = UIManagerHelper.getUIManagerForReactTag(context, tag);
      if (manager == null) return;
      View view;
      try {
        view = manager.resolveView(tag);
      } catch (RuntimeException removedView) {
        // Fabric and legacy UIManagers throw different exceptions for removed tags.
        return;
      }
      if (!(view instanceof ReactEditText) || !view.isAttachedToWindow() || !view.isFocused()) return;

      // Apply the latest action through RN's own setters before restarting. Fabric
      // prop mounting can otherwise race the JS effect and expose the old action
      // to the new input connection. These updates do not touch text or selection.
      WritableMap props = Arguments.createMap();
      props.putString("returnKeyType", returnKeyType);
      props.putString("returnKeyLabel", returnKeyLabel);
      manager.synchronouslyUpdateViewOnUIThread(tag, props);
      InputMethodManager keyboard = (InputMethodManager) view.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
      if (keyboard != null) keyboard.restartInput(view);
    });
  }
}
