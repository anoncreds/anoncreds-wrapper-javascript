import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'
import type { JsonObject } from '../types'
import type { RevocationRegistryDefinition } from './RevocationRegistryDefinition'

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
