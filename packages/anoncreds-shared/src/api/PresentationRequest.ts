import type { JsonObject } from '../types'

import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'

export class PresentationRequest extends AnoncredsObject {
  public static fromJson(json: JsonObject) {
    return new PresentationRequest(
      NativeAnoncreds.instance.presentationRequestFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
