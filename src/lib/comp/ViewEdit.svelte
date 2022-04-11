<script lang="ts">
	import { loading } from '$lib/stores/loading/loading_store';
	import { userStore } from '$lib/stores/user/user_store';
	import { viewEditStore } from '$lib/stores/user/view_edit_account';
	import { clickOutside } from '$lib/util/clickoutside';
	import { makePostOptions } from '$lib/util/makePostOptions';
	import { onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import ErrorMessage from './ErrorMessage.svelte';
	import PasswordPortal from './PasswordPortal.svelte';

	type states = 'initial' | 'decrypted' | 'edit';

	let state: states = 'initial';
	let showPasswordPortal = false;
	let error;
	let disableAllInputs = true;
	let masterPassword: string = '';

	$: primaryButtonText = state === 'initial' ? 'Decrypt' : state === 'decrypted' ? 'Edit' : 'Save';
	$: account = $viewEditStore.account;

	onMount(() => {
		document.addEventListener('keydown', handleEscape);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', handleEscape);
	});

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') viewEditStore.toggleModal();
	};

	const dispatchAction = async () => {
		if (state === 'initial') togglePasswordPortal();
		else if (state === 'decrypted') {
			disableAllInputs = false;
			state = 'edit';
		} else if (state === 'edit') {
			loading.set(true);
			const res = await fetch(
				'/api/account/update',
				makePostOptions({
					id: $viewEditStore.account.id,
					username: $viewEditStore.account.username,
					password: $viewEditStore.account.password,
					url: $viewEditStore.account.url,
					account_label: $viewEditStore.account.account_label,
					masterPassword
				})
			);
			if (res.ok) {
				const updatedAccount = (await res.json()).updated;
				userStore.removeAccount(updatedAccount.id);
				userStore.addAccount(updatedAccount);
				viewEditStore.toggleModal();
			} else {
				error = (await res.json()).message || 'Something went wrong';
			}
			loading.set(false);
		}
	};

	const togglePasswordPortal = () => {
		showPasswordPortal = !showPasswordPortal;
	};

	// runs after password is submitted from password portal
	const submitDecrypt = async (event: CustomEvent) => {
		loading.set(true);
		togglePasswordPortal(); // close portal
		masterPassword = event.detail.password;
		const res = await fetch(
			'/api/account/decrypt',
			makePostOptions({
				masterPassword,
				username: account.username,
				password: account.password
			})
		);
		if (res.ok) {
			const data = await res.json();
			$viewEditStore.account = { ...account, username: data.username, password: data.password };
			error = null;
			state = 'decrypted';
		} else {
			error = (await res.json()).message || 'Something went wrong';
		}
		loading.set(false);
	};
</script>

<main
	aria-label="view or edit account"
	transition:slide={{ duration: 129 }}
	use:clickOutside
	on:outclick={viewEditStore.toggleModal}
>
	<div class="modal-title-bar">
		<h1 class="modal-title">View and edit account</h1>
	</div>
	<div class="content">
		<div class="field">
			<label for="account-label">Account label</label>
			<input
				disabled={disableAllInputs}
				bind:value={$viewEditStore.account.account_label}
				id="account-label"
				type="text"
				name="label"
			/>
		</div>
		<div class="field">
			<label for="username">Username</label>
			<input
				disabled={disableAllInputs}
				bind:value={$viewEditStore.account.username}
				id="username"
				type="text"
				name="username"
			/>
		</div>
		<div class="field">
			<label for="password">Password</label>
			<input
				disabled={disableAllInputs}
				bind:value={$viewEditStore.account.password}
				id="password"
				type="text"
				name="password"
			/>
		</div>
		<div class="field">
			<label for="url">Account url</label>
			<input
				disabled={disableAllInputs}
				bind:value={$viewEditStore.account.url}
				id="url"
				type="text"
				name="url"
			/>
		</div>
	</div>

	<ErrorMessage visible={!!error} message={error} />

	<div class="actions">
		<button on:click={dispatchAction} class="filled" disabled={$loading}>
			{primaryButtonText}
		</button>
		<button on:click={viewEditStore.toggleModal} disabled={$loading}> Close </button>
	</div>
</main>

{#if showPasswordPortal}
	<PasswordPortal
		on:submit={submitDecrypt}
		oncancel={togglePasswordPortal}
		outclick={togglePasswordPortal}
		okText="Continue"
	/>
{/if}

<style>
	input:disabled {
		pointer-events: none;
		background: var(--gray5);
	}
	main {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 8px 42px -4px hsla(0, 0%, 0%, 0.7);
		width: min(350px, 90vw);
		z-index: 5;
		border-radius: 0.5rem;
		overflow: hidden;
		background-color: var(--bg);
	}
	.modal-title-bar {
		width: 100%;
		color: white;
		border-radius: 0;
		background: var(--bg-main-dark);
	}
	.actions {
		display: flex;
		width: 100%;
		gap: 1rem;
		padding: 1rem 2rem;
		justify-content: center;
	}
	.content {
		padding: 1.5rem;
		padding-top: 1.5rem;
		text-align: center;
		line-height: 1.5em;
	}
	.actions button {
		width: 50%;
	}
	/* .modal-error {
		border: 2px solid red;
	} */
	.field {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: 0.8rem;
	}
	.field * {
		width: 100%;
		text-align: left;
	}
</style>
