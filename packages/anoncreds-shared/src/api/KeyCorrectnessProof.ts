import type { JsonObject } from '../types'

import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'

export class KeyCorrectnessProof extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new KeyCorrectnessProof(
      NativeAnoncreds.instance.keyCorrectnessProofFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
