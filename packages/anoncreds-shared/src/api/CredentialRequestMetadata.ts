import type { JsonObject } from '../types'

import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'

export class CredentialRequestMetadata extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new CredentialRequestMetadata(
      NativeAnoncreds.instance.credentialRequestMetadataFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
