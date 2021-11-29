import { provide } from '@vue/composition-api'
import { useDialog } from '.'
import { useJavaWizardDialog } from './useDialog'
import { IssueHandler, useModResource, useRouter, useService } from '/@/hooks'
import { Issue, IssueType } from '/@shared/entities/issue'
import { InstanceModsServiceKey } from '/@shared/services/InstanceModsService'
import { InstanceResourcePacksServiceKey } from '/@shared/services/InstanceResourcePacksService'

export function provideIssueHandler() {
  const { push } = useRouter()
  const { show: showModDialog } = useDialog('download-missing-mods' as any) // TODO: fix this
  const { install } = useService(InstanceModsServiceKey)
  const { resources } = useModResource()

  const handlerRegistry: Record<string, (issue: Issue) => void> = {}

  provide(IssueHandler, handlerRegistry)

  function register(issue: IssueType, f: (issue: Issue) => void) {
    handlerRegistry[issue] = f
  }

  register('missingModsOnServer', showModDialog)
  register('unknownMod', () => push('/mod-setting'))
  register('incompatibleMod', () => push('/mod-setting'))
  register('incompatibleResourcePack', () => push('/resource-pack-setting'))
  register('requireForge', () => push('/version-setting'))
  register('requireFabric', () => push('/version-setting'))
  register('requireFabricAPI', () => {
    const fabric = resources.value.find((r) => r.type === 'fabric' && r.metadata.id === 'fabric')
    if (fabric) {
      install({ mods: [fabric] })
    } else {
      push('/curseforge/mc-mods/306612')
    }
  })
}