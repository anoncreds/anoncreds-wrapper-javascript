import type { JsonObject } from '../types'
import type { RevocationRegistryDefinition } from './RevocationRegistryDefinition'

import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'

export type UpdateRevocationRegistryOptions = {
  revocationRegistryDefinition: RevocationRegistryDefinition
  issued: number[]
  revoked: number[]
  tailsDirectoryPath: string
}

export class RevocationRegistry extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new RevocationRegistry(
      NativeAnoncreds.instance.revocationRegistryFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
