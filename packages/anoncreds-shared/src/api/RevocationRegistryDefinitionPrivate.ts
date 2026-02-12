import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'
import type { JsonObject } from '../types'

export class RevocationRegistryDefinitionPrivate extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new RevocationRegistryDefinitionPrivate(
      NativeAnoncreds.instance.revocationRegistryDefinitionPrivateFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
