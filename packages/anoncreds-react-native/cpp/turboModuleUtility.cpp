#include <vector>

#include "turboModuleUtility.h"

namespace anoncredsTurboModuleUtility {

using byteVector = std::vector<uint8_t>;

std::shared_ptr<react::CallInvoker> invoker;

void registerTurboModule(jsi::Runtime &rt,
                         std::shared_ptr<react::CallInvoker> jsCallInvoker) {
  // Setting the callInvoker for async code
  invoker = jsCallInvoker;
  // Create a TurboModuleRustHostObject
  auto instance = std::make_shared<AnoncredsTurboModuleHostObject>(rt);
  // Create a JS equivalent object of the instance
  jsi::Object jsInstance = jsi::Object::createFromHostObject(rt, instance);
  // Register the object on global
  rt.global().setProperty(rt, "_anoncreds", std::move(jsInstance));
}

void assertValueIsObject(jsi::Runtime &rt, const jsi::Value *val) {
  val->asObject(rt);
}

jsi::Value anoncredsStringToValue(jsi::Runtime &rt, const char *value) {
  if (value == nullptr)
    return jsi::Value::null();

  // AnonCreds returns UTF-8, which createFromAscii would mangle
  auto string = jsi::String::createFromUtf8(rt, std::string(value));
  anoncreds_string_free(const_cast<char *>(value));
  return jsi::Value(std::move(string));
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             nullptr_t value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    object.setProperty(rt, "value", jsi::Value::null());
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             const char **value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    object.setProperty(rt, "value",
                       anoncredsStringToValue(rt, value ? *value : nullptr));
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code, int8_t *value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    auto valueWithoutNullptr =
        value == nullptr ? jsi::Value::null() : jsi::Value(rt, int(*value));
    object.setProperty(rt, "value", valueWithoutNullptr);
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             ObjectHandle *value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    auto valueWithoutNullptr =
        value == nullptr ? jsi::Value::null() : jsi::Value(rt, int(*value));
    object.setProperty(rt, "value", valueWithoutNullptr);
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             ByteBuffer *value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    auto valueWithoutNullptr =
        value == nullptr
            ? jsi::Value::null()
            : jsi::String::createFromUtf8(rt, value->data, value->len);
    object.setProperty(rt, "value", valueWithoutNullptr);

    if (value != nullptr) anoncreds_buffer_free(*value);
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             anoncreds::CredentialDefinitionReturn *value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    if (value == nullptr) {
      object.setProperty(rt, "value", jsi::Value::null());
    } else {
      auto objectValue = jsi::Object(rt);
      objectValue.setProperty(rt, "credentialDefinition",
                              int(value->credentialDefinition));
      objectValue.setProperty(rt, "credentialDefinitionPrivate",
                              int(value->credentialDefinitionPrivate));
      objectValue.setProperty(rt, "keyCorrectnessProof",
                              int(value->keyCorrectnessProof));
      object.setProperty(rt, "value", objectValue);
    }
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             anoncreds::CredentialRequestReturn *value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    if (value == nullptr) {
      object.setProperty(rt, "value", jsi::Value::null());
    } else {
      auto objectValue = jsi::Object(rt);
      objectValue.setProperty(rt, "credentialRequest",
                              int(value->credentialRequest));
      objectValue.setProperty(rt, "credentialRequestMetadata",
                              int(value->credentialRequestMetadata));
      object.setProperty(rt, "value", objectValue);
    }
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value
createReturnValue(jsi::Runtime &rt, ErrorCode code,
                  anoncreds::RevocationRegistryDefinitionReturn *value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    if (value == nullptr) {
      object.setProperty(rt, "value", jsi::Value::null());
    } else {
      auto objectValue = jsi::Object(rt);
      objectValue.setProperty(rt, "revocationRegistryDefinition",
                              int(value->revocationRegistryDefinition));
      objectValue.setProperty(rt, "revocationRegistryDefinitionPrivate",
                              int(value->revocationRegistryDefinitionPrivate));
      object.setProperty(rt, "value", objectValue);
    }
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
uint8_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                   bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return 0;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
int8_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                  bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return 0;

  if (value.isNumber())
    return value.asNumber();

  if (value.isBool())
    return value.getBool() ? 1 : 0;

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
std::string jsiToValue<std::string>(jsi::Runtime &rt, jsi::Object &options,
                                    const char *name, bool optional) {
  jsi::Value value = options.getProperty(rt, name);

  if ((value.isNull() || value.isUndefined()) && optional)
    return std::string();

  if (value.isString()) {
    auto x = value.asString(rt).utf8(rt);
    return x;
  }

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "string");
}

template <>
int64_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                   bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return 0;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
int32_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                   bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return 0;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
std::vector<int32_t>
jsiToValue<std::vector<int32_t>>(jsi::Runtime &rt, jsi::Object &options,
                                 const char *name, bool optional) {
  jsi::Value value = options.getProperty(rt, name);

  if (value.isObject() && value.asObject(rt).isArray(rt)) {
    std::vector<int32_t> vec = {};
    jsi::Array arr = value.asObject(rt).asArray(rt);
    size_t length = arr.length(rt);
    for (int i = 0; i < length; i++) {
      jsi::Value element = arr.getValueAtIndex(rt, i);
      if (element.isNumber()) {
        vec.push_back(element.asNumber());
      } else {
        throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
      }
    }
    return vec;
  }

  if (optional)
    return {};

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "Array<number>");
}

template <>
ObjectHandle jsiToValue(jsi::Runtime &rt, jsi::Object &options,
                        const char *name, bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return 0;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt,
                     errorPrefix + name + errorInfix + "ObjectHandle.handle");
};


// The array in options[name]. Missing optional arrays are empty
static std::vector<jsi::Value> jsiToArray(jsi::Runtime &rt,
                                          jsi::Object &options,
                                          const char *name, bool optional,
                                          const std::string &type) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return {};

  if (!value.isObject() || !value.asObject(rt).isArray(rt))
    throw jsi::JSError(rt, errorPrefix + name + errorInfix + type);

  jsi::Array array = value.asObject(rt).asArray(rt);
  size_t length = array.length(rt);

  std::vector<jsi::Value> elements;
  elements.reserve(length);
  for (size_t i = 0; i < length; i++) {
    elements.push_back(array.getValueAtIndex(rt, i));
  }
  return elements;
}

static jsi::Object jsiToObject(jsi::Runtime &rt, jsi::Value &value,
                               const char *name, const std::string &type) {
  if (!value.isObject())
    throw jsi::JSError(rt, errorPrefix + name + errorInfix + type);

  return value.asObject(rt);
}

static double jsiToNumber(jsi::Runtime &rt, jsi::Value &value,
                          const char *name, const std::string &type) {
  if (!value.isNumber())
    throw jsi::JSError(rt, errorPrefix + name + errorInfix + type);

  return value.asNumber();
}

FfiList_FfiStr StrList::ffi() & {
  pointers.clear();
  for (auto &string : strings) {
    pointers.push_back(string.c_str());
  }
  return FfiList_FfiStr{.count = pointers.size(), .data = pointers.data()};
}

FfiList_ObjectHandle ObjectHandleList::ffi() & {
  return FfiList_ObjectHandle{.count = handles.size(), .data = handles.data()};
}

FfiList_i32 I32List::ffi() & {
  return FfiList_i32{.count = values.size(), .data = values.data()};
}

FfiList_FfiCredentialEntry CredentialEntryList::ffi() & {
  return FfiList_FfiCredentialEntry{.count = entries.size(),
                                    .data = entries.data()};
}

FfiList_FfiCredentialProve CredentialProveList::ffi() & {
  for (size_t i = 0; i < proves.size(); i++) {
    proves[i].referent = referents[i].c_str();
  }
  return FfiList_FfiCredentialProve{.count = proves.size(),
                                    .data = proves.data()};
}

FfiList_FfiNonrevokedIntervalOverride NonrevokedIntervalOverrideList::ffi() & {
  for (size_t i = 0; i < overrides.size(); i++) {
    overrides[i].rev_reg_def_id = revocationRegistryDefinitionIds[i].c_str();
  }
  return FfiList_FfiNonrevokedIntervalOverride{.count = overrides.size(),
                                               .data = overrides.data()};
}

ByteBuffer Json::ffi() & {
  return ByteBuffer{.len = static_cast<int64_t>(json.size()),
                    .data = reinterpret_cast<uint8_t *>(json.data())};
}

template <>
StrList jsiToValue<StrList>(jsi::Runtime &rt, jsi::Object &options,
                            const char *name, bool optional) {
  StrList list;
  for (auto &element : jsiToArray(rt, options, name, optional, "Array<string>")) {
    if (!element.isString())
      throw jsi::JSError(rt, errorPrefix + name + errorInfix + "Array<string>");

    list.strings.push_back(element.asString(rt).utf8(rt));
  }
  return list;
}

template <>
ObjectHandleList jsiToValue<ObjectHandleList>(jsi::Runtime &rt,
                                              jsi::Object &options,
                                              const char *name, bool optional) {
  ObjectHandleList list;
  for (auto &element :
       jsiToArray(rt, options, name, optional, "Array<ObjectHandle.handle>")) {
    list.handles.push_back(ObjectHandle(
        jsiToNumber(rt, element, name, "Array<ObjectHandle.handle>")));
  }
  return list;
}

template <>
I32List jsiToValue<I32List>(jsi::Runtime &rt, jsi::Object &options,
                            const char *name, bool optional) {
  I32List list;
  for (auto &element : jsiToArray(rt, options, name, optional, "Array<number>")) {
    list.values.push_back(
        int32_t(jsiToNumber(rt, element, name, "Array<number>")));
  }
  return list;
}

template <>
CredentialEntryList
jsiToValue<CredentialEntryList>(jsi::Runtime &rt, jsi::Object &options,
                                const char *name, bool optional) {
  CredentialEntryList list;
  for (auto &element :
       jsiToArray(rt, options, name, optional, "Array<CredentialEntry>")) {
    auto entry = jsiToObject(rt, element, name, "Array<CredentialEntry>");

    FfiCredentialEntry ffiEntry;
    ffiEntry.credential = jsiToValue<ObjectHandle>(rt, entry, "credential");
    ffiEntry.timestamp = jsiToValue<int32_t>(rt, entry, "timestamp", true);
    ffiEntry.rev_state =
        jsiToValue<ObjectHandle>(rt, entry, "revocationState", true);
    list.entries.push_back(ffiEntry);
  }
  return list;
}

template <>
CredentialProveList
jsiToValue<CredentialProveList>(jsi::Runtime &rt, jsi::Object &options,
                                const char *name, bool optional) {
  CredentialProveList list;
  for (auto &element :
       jsiToArray(rt, options, name, optional, "Array<CredentialProve>")) {
    auto prove = jsiToObject(rt, element, name, "Array<CredentialProve>");

    // The referent pointer is set in ffi(), once the strings don't move anymore
    FfiCredentialProve ffiProve;
    ffiProve.entry_idx = jsiToValue<int64_t>(rt, prove, "entryIndex");
    ffiProve.referent = nullptr;
    ffiProve.is_predicate = jsiToValue<int8_t>(rt, prove, "isPredicate");
    ffiProve.reveal = jsiToValue<int8_t>(rt, prove, "reveal");
    list.referents.push_back(jsiToValue<std::string>(rt, prove, "referent"));
    list.proves.push_back(ffiProve);
  }
  return list;
}

template <>
NonrevokedIntervalOverrideList
jsiToValue<NonrevokedIntervalOverrideList>(jsi::Runtime &rt,
                                           jsi::Object &options,
                                           const char *name, bool optional) {
  NonrevokedIntervalOverrideList list;
  for (auto &element : jsiToArray(rt, options, name, optional,
                                  "Array<NonRevokedIntervalOverride>")) {
    auto intervalOverride = jsiToObject(rt, element, name,
                                "Array<NonRevokedIntervalOverride>");

    // The id pointer is set in ffi(), once the strings don't move anymore
    FfiNonrevokedIntervalOverride ffiOverride;
    ffiOverride.rev_reg_def_id = nullptr;
    ffiOverride.requested_from_ts =
        jsiToValue<int32_t>(rt, intervalOverride, "requestedFromTimestamp");
    ffiOverride.override_rev_status_list_ts =
        jsiToValue<int32_t>(rt, intervalOverride, "overrideRevocationStatusListTimestamp");
    list.revocationRegistryDefinitionIds.push_back(
        jsiToValue<std::string>(rt, intervalOverride, "revocationRegistryDefinitionId"));
    list.overrides.push_back(ffiOverride);
  }
  return list;
}

template <>
Json jsiToValue<Json>(jsi::Runtime &rt, jsi::Object &options, const char *name,
                      bool optional) {
  return Json{.json = jsiToValue<std::string>(rt, options, name, optional)};
}

template <>
FfiCredRevInfo jsiToValue(jsi::Runtime &rt, jsi::Object &options,
                          const char *name, bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return FfiCredRevInfo{};

  if (value.isObject()) {
    jsi::Object valueAsObject = value.asObject(rt);
    auto registryDefinition = jsiToValue<ObjectHandle>(
        rt, valueAsObject, "revocationRegistryDefinition");
    auto registryDefinitionPrivate = jsiToValue<ObjectHandle>(
        rt, valueAsObject, "revocationRegistryDefinitionPrivate");
    auto statusList =
        jsiToValue<ObjectHandle>(rt, valueAsObject, "revocationStatusList");
    auto registryIndex =
        jsiToValue<int64_t>(rt, valueAsObject, "registryIndex");

    return FfiCredRevInfo{.reg_def = registryDefinition,
                          .reg_def_private = registryDefinitionPrivate,
                          .status_list = statusList,
                          .reg_idx = registryIndex};
  }

  throw jsi::JSError(rt, errorPrefix + name + errorInfix +
                             "CredentialRevocationConfig");
};


} // namespace anoncredsTurboModuleUtility
