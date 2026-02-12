import { NativeAnoncreds } from '../register'

export class Nonce {
  public static generate(): string {
    return NativeAnoncreds.instance.generateNonce()
  }
}
