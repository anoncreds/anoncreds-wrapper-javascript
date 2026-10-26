import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'
import type { JsonObject } from '../types'

export class KeyCorrectnessProof extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new KeyCorrectnessProof(
      NativeAnoncreds.instance.keyCorrectnessProofFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
