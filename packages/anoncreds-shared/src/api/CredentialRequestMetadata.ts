import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'
import type { JsonObject } from '../types'

export class CredentialRequestMetadata extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new CredentialRequestMetadata(
      NativeAnoncreds.instance.credentialRequestMetadataFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
