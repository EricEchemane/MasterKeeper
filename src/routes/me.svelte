<script lang="ts">
	import AddAccount from '$lib/comp/AddAccount.svelte';
	import MyAccounts from '$lib/comp/MyAccounts.svelte';
	import Navbar from '$lib/comp/navbar.svelte';
	import { userStore } from '$lib/stores/user/user_store';
	import type { User } from '$lib/types/user';
	import { onMount } from 'svelte';

	export let user: User;
	let tab = 0;

	$: {
		if ($userStore) user = $userStore;
	}

	onMount(() => {
		userStore.set(user);
	});

	const accountAddedHandler = () => {
		user = $userStore;
		tab = 0;
	};
</script>

<svelte:head>
	<title>{user.nickname.toUpperCase()} - Master Keeper</title>
</svelte:head>

<main>
	<Navbar {user} />

	<div id="tab-switcher">
		<div class="multi-switch-option-wrapper">
			<label for="small" class="multi-switch-option">
				<input type="radio" name="size" id="small" checked value={0} bind:group={tab} />
				<span class="text"> My accounts </span>
			</label>
			<label for="Medium" class="multi-switch-option">
				<input type="radio" name="size" id="Medium" value={1} bind:group={tab} />
				<span class="text"> Add account </span>
			</label>
		</div>
	</div>

	{#if tab === 0}
		<MyAccounts {user} onadd={() => (tab = 1)} />
	{:else}
		<AddAccount on:success={accountAddedHandler} />
	{/if}
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
	}
	#tab-switcher {
		margin: 2rem 0;
		display: grid;
		place-items: center;
	}
</style>
