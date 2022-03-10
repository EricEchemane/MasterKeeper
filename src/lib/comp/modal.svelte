<script lang="ts">
	import { clickOutside } from '$lib/util/clickoutside';
	import { onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let title: string;
	export let error = false;
	export let content: string;
	export let outclick: any;
	export let confirmTitle: string = 'ok';
	export let actions: any = {};

	onMount(() => {
		document.addEventListener('keydown', handleEscape);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', handleEscape);
	});

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') outclick();
	};
</script>

<div
	class={`modal${error ? '-error' : ''}`}
	aria-label="modal"
	id="modal"
	use:clickOutside
	on:outclick={outclick}
	transition:slide={{ duration: 114 }}
>
	<div class="modal-title-bar">
		<h1 class="modal-title">{title}</h1>
	</div>
	<div class="content">
		{content}
	</div>
	<div class="actions">
		{#if actions.confirm}
			<button on:click={actions.confirm} class="filled"> {confirmTitle} </button>
		{/if}
		{#if actions.cancel}
			<button on:click={actions.cancel}>Cancel</button>
		{/if}
	</div>
</div>

<style>
	#modal {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 8px 42px -4px hsla(0, 0%, 0%, 0.7);
		width: min(400px, 90vw);
		z-index: 10;
		border-radius: 0.5rem;
		overflow: hidden;
		backdrop-filter: blur(100px);
	}
	.modal-title-bar {
		width: 100%;
		color: white;
		border-radius: 0;
		background: var(--bg-main-dark);
	}
	.content {
		padding: 1rem;
		padding-top: 1.5rem;
		text-align: center;
		line-height: 1.5em;
	}
	.actions {
		display: flex;
		width: 100%;
		gap: 1rem;
		padding: 1rem 2rem;
		justify-content: center;
	}
	.actions button {
		width: 50%;
	}
	.modal-error {
		border: 2px solid red;
	}
</style>
