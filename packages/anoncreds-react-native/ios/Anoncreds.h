#ifdef RCT_NEW_ARCH_ENABLED
#import <RNAnoncredsSpec/RNAnoncredsSpec.h>

@interface Anoncreds: NSObject <NativeAnoncredsSpec>

@end
#else
#import <React/RCTBridgeModule.h>

@interface Anoncreds: NSObject <RCTBridgeModule>

@end
#endif
