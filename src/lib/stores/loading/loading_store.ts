import { writable } from 'svelte/store';

function createLoadingStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        set,
    };
}

export const loading = createLoadingStore();