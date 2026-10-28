package org.hyperledger.anoncreds;

import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;
import javax.annotation.Nonnull;

// The spec that codegen generates from src/specs/NativeAnoncreds.ts, for the old architecture where codegen doesn't
// run. Keep it in sync with the spec
public abstract class NativeAnoncredsSpec extends ReactContextBaseJavaModule implements TurboModule {
    public static final String NAME = "Anoncreds";

    public NativeAnoncredsSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public @Nonnull String getName() {
        return NAME;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    @DoNotStrip
    public abstract boolean install();
}
