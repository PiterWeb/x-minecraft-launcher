import { computed, Ref } from '@vue/composition-api';
import { UpdateInfo } from 'electron-updater';
import { useStore } from './useStore';
import { useServiceOnly } from './useService';

export function useSettings() {
    const { state, commit } = useStore();
    const locales = computed(() => state.setting.locales || []);
    const selectedLocale = computed({
        get: () => locales.value.find(l => l === state.setting.locale) || 'en',
        set: v => commit('locale', v),
    });
    const allowPrerelease = computed({
        get: () => state.setting.allowPrerelease,
        set: v => commit('allowPrerelease', v),
    });
    const autoInstallOnAppQuit = computed({
        get: () => state.setting.autoInstallOnAppQuit,
        set: v => commit('autoInstallOnAppQuit', v),
    });
    const autoDownload = computed({
        get: () => state.setting.autoDownload,
        set: v => commit('autoDownload', v),
    });
    const useBmclAPI = computed({
        get: () => state.setting.useBmclAPI,
        set: v => commit('useBmclApi', v),
    });
    const readyToUpdate = computed(() => state.setting.readyToUpdate);
    const checkingUpdate = computed(() => state.setting.checkingUpdate);
    const downloadingUpdate = computed(() => state.setting.downloadingUpdate);
    const updateInfo: Ref<UpdateInfo> = computed(() => state.setting.updateInfo || {}) as any;


    return {
        ...useServiceOnly('BaseService', 'checkUpdate'),
        locales,
        selectedLocale,
        allowPrerelease,
        autoDownload,
        autoInstallOnAppQuit,
        useBmclAPI,
        readyToUpdate,
        checkingUpdate,
        downloadingUpdate,
        updateInfo,
    };
}

export function useUpdateInfo() {
    const { state } = useStore();
    const checkingUpdate = computed(() => state.setting.checkingUpdate);
    const downloadingUpdate = computed(() => state.setting.downloadingUpdate);
    const updateInfo = computed(() => state.setting.updateInfo);
    const readyToUpdate = computed(() => state.setting.readyToUpdate);
    return {
        checkingUpdate,
        downloadingUpdate,
        updateInfo,
        readyToUpdate,
        ...useServiceOnly('BaseService', 'downloadUpdate', 'quitAndInstall', 'checkUpdate'),
    };
}