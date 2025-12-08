import type { JsonObject } from '../types'

import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'

export class CredentialDefinitionPrivate extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new CredentialDefinitionPrivate(
      NativeAnoncreds.instance.credentialDefinitionPrivateFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
