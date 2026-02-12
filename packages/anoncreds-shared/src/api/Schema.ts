import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'
import type { JsonObject } from '../types'

export type CreateSchemaOptions = {
  name: string
  version: string
  issuerId: string
  attributeNames: string[]
}

export class Schema extends AnoncredsObject {
  public static create(options: CreateSchemaOptions) {
    return new Schema(NativeAnoncreds.instance.createSchema(options).handle)
  }

  public static fromJson(json: JsonObject) {
    return new Schema(NativeAnoncreds.instance.schemaFromJson({ json: JSON.stringify(json) }).handle)
  }
}
