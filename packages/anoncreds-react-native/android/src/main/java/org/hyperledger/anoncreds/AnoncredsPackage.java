package org.hyperledger.anoncreds;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import java.util.Collections;

public class AnoncredsPackage extends BaseReactPackage {
    @Nullable
    @Override
    public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext reactContext) {
        return name.equals(NativeAnoncredsSpec.NAME) ? new AnoncredsModule(reactContext) : null;
    }

    @NonNull
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        // A TurboModule isn't registered as a legacy native module, so only on the New Architecture
        return () -> Collections.singletonMap(
            NativeAnoncredsSpec.NAME,
            new ReactModuleInfo(
                NativeAnoncredsSpec.NAME,
                AnoncredsModule.class.getName(),
                false, // canOverrideExistingModule
                false, // needsEagerInit
                false, // isCxxModule
                BuildConfig.IS_NEW_ARCHITECTURE_ENABLED // isTurboModule
            )
        );
    }
}
