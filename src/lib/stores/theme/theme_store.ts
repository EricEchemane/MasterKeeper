import { writable } from 'svelte/store';

const defaultTheme = 'light';

function getTheme() {
    if (typeof window === 'undefined') return defaultTheme;
    return window.localStorage.getItem('theme') || defaultTheme;
}

function createTheme() {
    const { subscribe, set, update } = writable(getTheme());

    function toggle() {
        update(currentTheme => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            window.localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    }

    function setTheme(newTheme: string) {
        set(newTheme);
        window.localStorage.setItem('theme', newTheme);
    }

    return {
        subscribe,
        toggle,
        setTheme,
        set
    };
}

export const theme = createTheme();