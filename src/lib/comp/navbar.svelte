<script lang="ts">
	import listenToDropdown from '$lib/dropdown';
	import { theme } from '$lib/stores/theme/theme_store';
	import { onMount } from 'svelte';
	import LetterAvatar from './LetterAvatar.svelte';
	import type { User } from '$lib/types/user';
	import Modal from './modal.svelte';
	import { deleteCookie } from '$lib/util/cookie';
	import { goto } from '$app/navigation';
	import EditProfile from './EditProfile.svelte';
	import ImgAvatar from './ImgAvatar.svelte';

	export let user: User;
	let showModal = false;
	let showEditProfile = false;

	const toggleTheme = () => theme.toggle();

	const modalClose = () => (showModal = false);

	const logout = () => {
		showModal = false;
		deleteCookie('userid');
		goto('login');
	};

	onMount(() => {
		listenToDropdown();
	});

	const github = () => {
		window.open('https://github.com/EricEchemane/MasterKeeper');
	};
	const closeEditProfile = () => (showEditProfile = false);
</script>

<nav aria-label="user dashboard">
	<div class="menu-wrapper">
		<div id="profile">
			{#if user.master_avatar.trim().length === 0}
				<LetterAvatar nickname={user.nickname} />
			{:else}
				<ImgAvatar avatar={user.master_avatar} alt={user.nickname} size={3.2} />
			{/if}

			<div class="text">
				<h2>{user.nickname}</h2>
				<p class="small">{user.master_email}</p>
			</div>
		</div>
		<div class="menu-items" role="option">
			<div class="menu-item" on:click={() => (showEditProfile = true)}>Edit profile</div>
			<div class="menu-item" on:click={() => (showModal = true)}>Log out</div>
		</div>
	</div>

	<div class="flex" />

	{#if $theme == 'dark'}
		<div class="icon-button" role="button" on:click={toggleTheme}>
			<i class="bx bx-sun" />
		</div>
	{:else}
		<div class="icon-button" role="button" on:click={toggleTheme}>
			<i class="bx bx-moon" />
		</div>
	{/if}
	<div class="icon-button" role="button" on:click={github}>
		<i class="bx bxl-github" />
	</div>
</nav>

{#if showModal}
	<Modal
		title="Confirmation"
		content="Are you sure you want to log out?"
		outclick={modalClose}
		confirmTitle="Yes"
		actions={{
			confirm: logout,
			cancel: () => (showModal = false)
		}}
	/>
{/if}
{#if showEditProfile}
	<EditProfile on:close={closeEditProfile} on:close={() => (showEditProfile = false)} />
{/if}

<style>
	nav {
		background: var(--bg);
		cursor: default;
		display: flex;
		padding: 1rem;
		align-items: center;
	}
	.flex {
		flex: 1;
	}
	#profile {
		box-shadow: none;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		cursor: pointer;
	}
</style>
