import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

export const Progress = tweened(0, {
    duration: 400,
    easing: cubicOut
});