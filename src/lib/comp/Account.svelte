<script lang="ts">
	import { userStore } from '$lib/stores/user/user_store';
	import { viewEditStore } from '$lib/stores/user/view_edit_account';

	import type { Account } from '$lib/types/user';
	import { makePostOptions } from '$lib/util/makePostOptions';
	import Modal from './modal.svelte';

	export let account: Account;
	let showDeleteAccountModal = false;
	let showErrorModal = false;
	let removing = false;
	let error;

	const toggleDeleteAccountModal = () => (showDeleteAccountModal = !showDeleteAccountModal);
	const toggleErrorModal = () => (showErrorModal = !showErrorModal);

	const remove = async () => {
		toggleDeleteAccountModal();
		removing = true;
		const res = await fetch('/api/account/remove', makePostOptions({ id: account.id }));
		if (res.ok) {
			userStore.removeAccount(account.id);
		} else {
			toggleErrorModal();
			error = (await res.json()).message;
		}
		removing = false;
	};

	const view = (e: Event) => {
		e.stopPropagation();
		viewEditStore.setAccount(account);
		viewEditStore.toggleModal();
	};
</script>

<section class={'account' + (removing ? ' to-remove' : '')}>
	{#if account.url.trim().length === 0}
		<h4 class="label">{account.account_label}</h4>
	{:else}
		<a
			class="label"
			target="_blank"
			title={`Go to your ${account.account_label} account`}
			href={account.url}
		>
			{account.account_label} &#8599;
		</a>
	{/if}
	<div class="actions">
		<button on:click={view}> View </button>
		<div
			class="icon-button"
			role="button"
			on:click={(e) => {
				e.stopPropagation();
				toggleDeleteAccountModal();
			}}
		>
			<i class="bx bx-trash" />
		</div>
	</div>
</section>

{#if showDeleteAccountModal}
	<Modal
		title="Confirmation"
		content="Are you sure you want to remove this account?"
		outclick={toggleDeleteAccountModal}
		confirmTitle="Yes"
		actions={{
			cancel: toggleDeleteAccountModal,
			confirm: remove
		}}
	/>
{/if}
{#if showErrorModal}
	<Modal
		title={error || 'Attention!'}
		content="Unable to remove account. Please try again later."
		outclick={toggleErrorModal}
		confirmTitle="Ok"
		error={true}
		actions={{
			confirm: toggleErrorModal
		}}
	/>
{/if}

<style>
	.account {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		transition: 96ms;
		border-radius: 0.6rem;
		overflow: hidden;
	}
	.label {
		font-size: 1.2rem;
		font-weight: 600;
	}
	.account:hover {
		box-shadow: 0 0 16px -12px hsla(0, 0%, 0%, 1);
		background: var(--bg-main);
	}
	.actions {
		transform: scale(0.85) translateX(0.65rem);
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	a.label:hover {
		transition: 114ms;
		color: var(--blue);
	}
</style>
