import { computed, inject } from '@vue/composition-api';
import { TASKS_KEY, TASKS_OPS_KEY } from '@/constant';
import { requireNonnull } from '@universal/util/assert';
import { useStore } from './useStore';

export function useTask(taskHandle: string | Promise<any>) {
    const { state } = useStore();
    const handle = typeof taskHandle === 'string' ? taskHandle : (taskHandle as any).__tasks__[0];
    const taskState = state.task.tree[handle];
    const status = computed(() => taskState.status);
    const progress = computed(() => taskState.progress);
    const total = computed(() => taskState.total);
    const message = computed(() => taskState.message);
    function wait() {
        // return dispatch('waitTask', taskHandle);
    }
    return {
        name: taskState.name,
        time: taskState.time,
        progress,
        total,
        message,
        status,
        wait,
    };
}

export function useTaskCount() {
    const tasks = inject(TASKS_KEY);
    requireNonnull(tasks);
    const activeTasksCount = computed(
        () => tasks.value.filter(t => t.status === 'running').length,
    );
    return {
        activeTasksCount,
    };
}

export function useTasks() {
    const tasks = inject(TASKS_KEY);
    requireNonnull(tasks);
    const ops = inject(TASKS_OPS_KEY);
    requireNonnull(ops);
    const { pause, resume, cancel } = ops;
    return { tasks, pause, resume, cancel };
}