import { NativeAnoncreds } from '../register'

export class LinkSecret {
  public static create(): string {
    return NativeAnoncreds.instance.createLinkSecret()
  }
}
