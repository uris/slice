package com.slice;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.RenderEffect;
import android.graphics.RenderNode;
import android.graphics.Shader;
import android.os.Build;
import android.view.View;
import java.lang.reflect.Method;

/** Uniform, same-window backdrop blur. Older platforms draw only the fallback. */
public final class SliceBackgroundBlurView extends View {
  private double intensity = 12;
  private int fallbackColor = Color.argb(46, 128, 128, 128);
  private BackdropRenderer renderer;

  public SliceBackgroundBlurView(Context context) {
    super(context);
    setWillNotDraw(false);
    // Resolve a public API at runtime to avoid requiring SDK 37.2 to build consumers.
    // SDK_INT alone cannot distinguish Android's minor API releases.
    if (supportsNativeBlur()) {
      try {
        renderer = new BackdropRenderer();
      } catch (ReflectiveOperationException | LinkageError ignored) {
        renderer = null;
      }
    }
  }

  static boolean supportsNativeBlur() {
    if (Build.VERSION.SDK_INT < 37) return false;
    try {
      RenderNode.class.getMethod("setBackdropRenderEffect", RenderEffect.class);
      return true;
    } catch (ReflectiveOperationException | RuntimeException | LinkageError ignored) {
      return false;
    }
  }

  public void setIntensity(double value) {
    intensity = Double.isFinite(value) ? Math.max(0, Math.min(100, value)) : 12;
    invalidate();
  }

  public void setFallbackColor(Integer value) {
    fallbackColor = value == null ? Color.argb(46, 128, 128, 128) : value;
    invalidate();
  }

  @Override protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    if (intensity == 0) return;
    if (renderer != null && canvas.isHardwareAccelerated() && isHardwareAccelerated()) {
      try {
        float radius = (float) intensity * getResources().getDisplayMetrics().density;
        renderer.draw(canvas, getWidth(), getHeight(), radius);
        return;
      } catch (ReflectiveOperationException | RuntimeException | LinkageError ignored) {
        renderer = null;
      }
    }
    canvas.drawColor(fallbackColor);
  }

  @Override protected void onSizeChanged(int w, int h, int oldw, int oldh) {
    super.onSizeChanged(w, h, oldw, oldh);
    if (renderer != null) renderer.node.discardDisplayList();
  }

  @Override protected void onDetachedFromWindow() {
    if (renderer != null) renderer.node.discardDisplayList();
    super.onDetachedFromWindow();
  }

  // Keep newer graphics classes out of the View's fields on older Android releases.
  private static final class BackdropRenderer {
    final RenderNode node = new RenderNode("SliceBackgroundBlur");
    final Method setBackdropEffect;

    BackdropRenderer() throws ReflectiveOperationException {
      setBackdropEffect = RenderNode.class.getMethod("setBackdropRenderEffect", RenderEffect.class);
      node.setClipToBounds(true);
    }

    void draw(Canvas canvas, int width, int height, float radius) throws ReflectiveOperationException {
      setBackdropEffect.invoke(node, RenderEffect.createBlurEffect(radius, radius, Shader.TileMode.CLAMP));
      node.setPosition(0, 0, width, height);
      if (!node.hasDisplayList()) {
        node.beginRecording(width, height);
        node.endRecording();
      }
      canvas.drawRenderNode(node);
    }
  }
}
