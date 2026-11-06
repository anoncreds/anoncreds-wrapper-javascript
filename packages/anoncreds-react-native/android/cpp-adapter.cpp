#include <jni.h>
#include <jsi/jsi.h>
#include <fbjni/fbjni.h>
#include <ReactCommon/BindingsInstallerHolder.h>
#include <ReactCommon/CallInvokerHolder.h>

#include "turboModuleUtility.h"

using namespace facebook;

struct AnoncredsModule: jni::JavaClass<AnoncredsModule> {
public:
  __unused static constexpr auto kJavaDescriptor = "Lorg/hyperledger/anoncreds/AnoncredsModule;";

  static constexpr auto TAG = "Anoncreds";

  static void registerNatives() {
    javaClassStatic()->registerNatives({
      makeNativeMethod("installNative", AnoncredsModule::installNative),
      makeNativeMethod("getBindingsInstaller", AnoncredsModule::getBindingsInstaller),
    });
  }

private:
  static void installNative(jni::alias_ref<jni::JClass>,
                            jlong jsiRuntimePointer,
                            jni::alias_ref<facebook::react::CallInvokerHolder::javaobject> jsCallInvokerHolder) {

    auto runtime = reinterpret_cast<jsi::Runtime*>(jsiRuntimePointer);
    auto jsCallInvoker = jsCallInvokerHolder->cthis()->getCallInvoker();

    anoncredsTurboModuleUtility::registerTurboModule(*runtime, jsCallInvoker);
  }

  // React Native calls the installer when it creates the TurboModule, with a valid runtime
  // and call invoker also in bridgeless mode
  static jni::local_ref<react::BindingsInstallerHolder::javaobject> getBindingsInstaller(jni::alias_ref<AnoncredsModule>) {
    return react::BindingsInstallerHolder::newObjectCxxArgs(
        [](jsi::Runtime &runtime, const std::shared_ptr<react::CallInvoker> &callInvoker) {
          anoncredsTurboModuleUtility::registerTurboModule(runtime, callInvoker);
        });
  }
};

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
  return facebook::jni::initialize(vm, [] {
    AnoncredsModule::registerNatives();
  });
}
