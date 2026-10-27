import type { NativeCredentialRevocationConfig } from '../Anoncreds'
import type { RevocationRegistryDefinition } from './RevocationRegistryDefinition'
import type { RevocationRegistryDefinitionPrivate } from './RevocationRegistryDefinitionPrivate'
import type { RevocationStatusList } from './RevocationStatusList'

export type CredentialRevocationConfigOptions = {
  registryDefinition: RevocationRegistryDefinition
  registryDefinitionPrivate: RevocationRegistryDefinitionPrivate
  statusList: RevocationStatusList
  registryIndex: number
}

export class CredentialRevocationConfig {
  private readonly registryDefinition: RevocationRegistryDefinition
  private readonly registryDefinitionPrivate: RevocationRegistryDefinitionPrivate
  private readonly statusList: RevocationStatusList
  private readonly registryIndex: number

  public constructor(options: CredentialRevocationConfigOptions) {
    this.registryDefinition = options.registryDefinition
    this.registryDefinitionPrivate = options.registryDefinitionPrivate
    this.statusList = options.statusList
    this.registryIndex = options.registryIndex
  }

  public get native(): NativeCredentialRevocationConfig {
    return {
      revocationRegistryDefinition: this.registryDefinition.handle,
      revocationRegistryDefinitionPrivate: this.registryDefinitionPrivate.handle,
      revocationStatusList: this.statusList.handle,
      registryIndex: this.registryIndex,
    }
  }
}
