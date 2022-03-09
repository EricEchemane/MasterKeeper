<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/comp/ErrorMessage.svelte';
	import { loading } from '$lib/stores/loading/loading_store';
	import { setCookie } from '$lib/util/cookie';
	import { makePostOptions } from '$lib/util/makePostOptions';
	import { validateEmail } from '$lib/util/validators';
	import { slide } from 'svelte/transition';

	let email: string = '';
	let password: string = '';
	let error;
	$: disabledLogin = !validateEmail(email) || password.length < 8 || $loading;

	const login = async (e: Event) => {
		e.preventDefault();
		loading.set(true);
		const res = await fetch('/api/login', makePostOptions({ email, password }));
		if (res.ok) {
			setCookie('userid', (await res.json()).token);
			goto('me');
		} else {
			error = (await res.json()).message || 'Something went wrong';
		}
		loading.set(false);
	};
</script>

<form aria-label="input email form" in:slide method="post">
	<h2 class="title">Master Login</h2>
	<input
		type="text"
		name="email"
		autocomplete="email"
		placeholder="Your email"
		disabled={$loading}
		bind:value={email}
	/>
	<input
		type="password"
		name="password"
		autocomplete="current-password"
		placeholder="Your master password"
		disabled={$loading}
		bind:value={password}
	/>

	<ErrorMessage visible={!!error} message={error} />

	<button disabled={disabledLogin} on:click={login} class="filled" id="login"> Login </button>

	<a
		style="pointer-events: {$loading ? 'none' : 'visible'};"
		href="create"
		disabled={!$loading}
		sveltekit:prefetch
		class="small"
	>
		Don't have an account? Create one
	</a>
</form>

<style>
	form {
		width: min(300px, 90%);
		margin: auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
	}
	input {
		width: 100%;
	}
	#login {
		width: 100%;
	}
</style>
