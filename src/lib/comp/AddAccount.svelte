<script lang="ts">
	import { loading } from '$lib/stores/loading/loading_store';
	import { userStore } from '$lib/stores/user/user_store';
	import { makePostOptions } from '$lib/util/makePostOptions';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import ErrorMessage from './ErrorMessage.svelte';
	import PasswordPortal from './PasswordPortal.svelte';

	const dispatch = createEventDispatcher();

	let showPortal = false;
	let error;
	let addAccountForm = {
		accountLabel: '',
		username: '',
		password: '',
		url: ''
	};

	$: disableSave =
		$loading ||
		!addAccountForm.password.length ||
		!addAccountForm.username.length ||
		!addAccountForm.accountLabel.length;

	const save = (e: Event) => {
		e.preventDefault();
		showPortal = true;
	};

	const closePortal = () => {
		showPortal = false;
	};

	const submit = async (event) => {
		const masterPassword = event.detail.password;
		loading.set(true);

		const res = await fetch(
			'/api/account/add',
			makePostOptions({
				accountLabel: addAccountForm.accountLabel,
				username: addAccountForm.username,
				password: addAccountForm.password,
				url: addAccountForm.url,
				masterPassword
			})
		);
		if (res.ok) {
			userStore.addAccount((await res.json()).account);
			dispatch('success');
		} else {
			error = (await res.json()).message || 'An unknown error occurred';
		}

		closePortal();
		loading.set(false);
	};
</script>

<main transition:slide={{ duration: 256 }}>
	<form method="post" aria-label="add account form">
		<div class="field">
			<label for="account-label">Account label</label>
			<input
				bind:value={addAccountForm.accountLabel}
				id="account-label"
				type="text"
				name="label"
				placeholder="ex: main facebook"
				required
			/>
		</div>
		<div class="field">
			<label for="username">Username</label>
			<input
				bind:value={addAccountForm.username}
				id="username"
				autocomplete="username"
				type="text"
				name="username"
				placeholder="Account username"
				required
			/>
		</div>
		<div class="field">
			<label for="password">Password (Encrypted with your master password)</label>
			<input
				bind:value={addAccountForm.password}
				id="password"
				type="password"
				name="password"
				autocomplete="current-password"
				placeholder="Account password"
				required
			/>
		</div>
		<div class="field">
			<label for="url">Optional account url</label>
			<input
				bind:value={addAccountForm.url}
				id="url"
				type="text"
				name="url"
				placeholder="ex: https://facebook.com/username"
			/>
		</div>

		<ErrorMessage visible={!!error} message={error} />

		<button on:click={save} disabled={disableSave} class="filled" id="save"> Save </button>
	</form>
</main>

{#if showPortal}
	<PasswordPortal on:submit={submit} oncancel={closePortal} outclick={closePortal} />
{/if}

<style>
	main {
		padding: 1rem;
	}
	form {
		width: min(300px, 100%);
		margin: auto;
	}
	form,
	.field {
		display: flex;
		flex-direction: column;
	}
	.field {
		gap: 0.4rem;
	}
	form {
		gap: 1.2rem;
	}
	#save {
		width: 100%;
		margin-top: 1rem;
	}
</style>
