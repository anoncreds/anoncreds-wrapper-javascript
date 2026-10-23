import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'
import type { JsonObject } from '../types'

export class CredentialDefinitionPrivate extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new CredentialDefinitionPrivate(
      NativeAnoncreds.instance.credentialDefinitionPrivateFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
