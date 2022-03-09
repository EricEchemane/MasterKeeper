<script lang="ts">
	import type { User } from '$lib/types/user';
	import { slide } from 'svelte/transition';
	import Account from './Account.svelte';
	import { viewEditStore } from '$lib/stores/user/view_edit_account';
	import ViewEdit from './ViewEdit.svelte';

	export let user: User;
	export let onadd: EventListener;
</script>

<main transition:slide={{ duration: 256 }}>
	{#if user.accounts.length === 0}
		<div class="empty-state">
			<img src="/assets/add_account.svg" alt="no accounts" />
			<h2 class="title">No accounts stored yet</h2>
			<button class="call-to-action" on:click={onadd}>Add some</button>
		</div>
	{:else}
		<div class="accounts">
			{#each user.accounts as account (account.id)}
				<Account {account} />
			{/each}
		</div>
	{/if}
</main>

{#if $viewEditStore.showModal}
	<ViewEdit />
{/if}

<style>
	main {
		padding: 1rem;
	}
	.empty-state {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
	}
	.empty-state img {
		width: min(200px, 90%);
	}
</style>
