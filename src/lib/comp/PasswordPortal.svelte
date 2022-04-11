<script lang="ts">
	import { clickOutside } from '$lib/util/clickoutside';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	onMount(() => {
		document.addEventListener('keydown', handleEscape);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', handleEscape);
	});

	const handleEscape = (e: KeyboardEvent) => {
		e.stopPropagation();
		if (e.key === 'Escape') outclick();
	};

	export let outclick;
	export let oncancel: EventListener;
	export let okText = 'Ok';
	let password = '';

	const submit = (e: Event) => {
		e.preventDefault();
		if (password.length < 8) return;
		dispatch('submit', { password });
	};
</script>

<div
	aria-label="modal"
	id="modal"
	use:clickOutside
	on:outclick={outclick}
	transition:slide={{ duration: 114 }}
>
	<div class="modal-title-bar">
		<h1 class="modal-title">Master</h1>
	</div>
	<form class="content" method="post" on:submit={submit}>
		<p>Please enter your Master Password</p>
		<!-- svelte-ignore a11y-autofocus -->
		<input
			type="password"
			autofocus={true}
			bind:value={password}
			placeholder="Password"
			autocomplete="current-password"
		/>
	</form>

	<div class="actions">
		<button on:click={submit} class="filled"> {okText} </button>
		<button on:click={oncancel}>Cancel</button>
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
		background: var(--bg);
		/* backdrop-filter: blur(100px); */
	}
	.modal-title-bar {
		width: 100%;
		color: white;
		border-radius: 0;
		background: var(--bg-main-dark);
	}
	.content {
		padding: 1rem 2rem;
		padding-top: 1.5rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.content p {
		margin-bottom: 0.5rem;
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
</style>
