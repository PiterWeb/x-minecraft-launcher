import { computed, InjectionKey, provide, Ref, ref } from 'vue'

import { injection } from '@/util/inject'
import { useBroadcastChannel } from './broadcastChannel'

export const kDialogModel: InjectionKey<DialogModel> = Symbol('ShowingDialog')

export function useZipFilter() {
  const { t } = useI18n()
  const zipFilter = reactive({
    extensions: ['zip'],
    name: computed(() => t('extensions.zip')),
  })
  return zipFilter
}

export function useModrinthFilter() {
  const { t } = useI18n()
  const filter = reactive({
    extensions: ['mrpack'],
    name: computed(() => t('extensions.mrpack')),
  })
  return filter
}

export type DialogModel<T = any> = Ref<{
  dialog: string
  parameter: T
}>

export function useDialogModel(): DialogModel {
  const model = ref({ dialog: '', parameter: undefined })
  const channel = new BroadcastChannel('dialog')
  channel.addEventListener('message', (e) => {
    console.log(e)
    if (e.data.dialog === model.value.dialog) return
    model.value = e.data
  })
  watch(model, (value) => {
    channel.postMessage(value)
  })
  return model
}

export interface DialogKey<T> extends String { }

/**
 * Use a shared dialog between pages
 */
export function useDialog<T = any>(dialogName: DialogKey<T> = '', onShown?: (param: T) => void, onHide?: () => void) {
  const model = injection(kDialogModel)
  const isShown = computed({
    get: () => model.value.dialog === dialogName,
    set: (v: boolean) => {
      if (v) {
        show()
      } else {
        hide()
      }
    },
  })
  function hide() {
    if (model.value.dialog === dialogName) {
      console.log(`hide ${dialogName}`)
      model.value = { dialog: '', parameter: undefined }
    }
  }
  function show(param?: T) {
    if (model.value.dialog !== dialogName) {
      console.log(`show ${dialogName}`)
      model.value = { dialog: dialogName as string, parameter: param }
    }
  }
  watch(isShown, (value) => {
    if (value) {
      onShown?.(model.value.parameter)
    } else {
      onHide?.()
    }
  })

  return {
    dialog: model as DialogModel<T>,
    show,
    hide,
    isShown,
  }
}
