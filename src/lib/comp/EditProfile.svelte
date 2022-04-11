<script lang="ts">
	import { loading } from '$lib/stores/loading/loading_store';
	import { userStore } from '$lib/stores/user/user_store';
	import type { User } from '$lib/types/user';
	import { makePostOptions } from '$lib/util/makePostOptions';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import AvatarSelector from './AvatarSelector.svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import ImgAvatar from './ImgAvatar.svelte';
	import LetterAvatar from './LetterAvatar.svelte';
	import PasswordPortal from './PasswordPortal.svelte';

	const dispatch = createEventDispatcher();

	let user: User = { ...$userStore };
	let showAvatarOptions = false;
	let showImgUrlInput = false;
	let disableSave = true;
	let initialLoad = true;
	let showPasswordPortal = false;
	let error;

	$: if (user.nickname || user.master_avatar) {
		if (initialLoad) {
			initialLoad = false;
		} else disableSave = false;
	}
	const passwordSubmit = (e: CustomEvent) => {
		showPasswordPortal = false;
		save(e.detail.password);
	};
	const toggleAvatarOptions = () => (showAvatarOptions = !showAvatarOptions);
	const toggleImgUrlInput = () => (showImgUrlInput = !showImgUrlInput);

	onMount(() => {
		document.addEventListener('keydown', handleEscape);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', handleEscape);
	});

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') close();
	};

	const save = async (masterPassword: string) => {
		loading.set(true);
		const res = await fetch(
			'api/edit-profile',
			makePostOptions({
				masterPassword,
				nickname: user.nickname,
				master_avatar: user.master_avatar
			})
		);
		if (res.ok) {
			const updated = (await res.json()).updated;
			error = null;
			userStore.update((curUser) => {
				return {
					...updated,
					accounts: curUser.accounts
				};
			});
			dispatch('close');
		} else {
			error = (await res.json()).message || 'Something went wrong';
		}
		loading.set(false);
	};

	const close = () => {
		dispatch('close');
	};

	const setAvatar = (event: CustomEvent) => {
		user.master_avatar = event.detail.avatarPath;
		toggleAvatarOptions();
	};
</script>

{#if showPasswordPortal}
	<PasswordPortal
		on:submit={passwordSubmit}
		oncancel={() => (showPasswordPortal = false)}
		outclick={() => {}}
	/>
{/if}

<main aria-label="Edit Profile" transition:slide={{ duration: 114 }}>
	{#if showAvatarOptions}
		<AvatarSelector outclick={() => (showAvatarOptions = false)} on:select={setAvatar} />
	{/if}
	<div class="modal-title-bar">
		<h1 class="modal-title">Edit Profile</h1>
	</div>
	<div class="content">
		<div class="avatar">
			{#if user.master_avatar}
				<ImgAvatar avatar={user.master_avatar} alt={user.nickname} size={5.1} />
			{:else}
				<LetterAvatar nickname={user.nickname} size={5} />
			{/if}
			<div class="avatar-actions">
				<button on:click={toggleAvatarOptions}>Choose avatar</button>
				<button on:click={toggleImgUrlInput}>or paste image url</button>
			</div>
		</div>
		{#if showImgUrlInput}
			<div class="field" transition:slide={{ duration: 114 }}>
				<label for="nickname"> Replace img url below </label>
				<input
					type="text"
					id="avatar"
					bind:value={user.master_avatar}
					placeholder="Past your image url here"
				/>
			</div>
		{/if}
		<div class="field">
			<label for="nickname">Edit nickname</label>
			<input type="text" id="nickname" bind:value={user.nickname} />
		</div>
	</div>

	<ErrorMessage visible={!!error} message={error} />

	<div class="actions">
		<button
			class="filled"
			disabled={disableSave || $loading}
			on:click={() => (showPasswordPortal = true)}
		>
			Save
		</button>
		<button on:click={close} disabled={$loading}> Cancel </button>
	</div>
</main>

<style>
	.avatar {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin: 0 0 1.5rem;
	}
	.avatar-actions {
		transform: scale(0.9);
	}
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
		z-index: 8;
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--bg);
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
		padding: 1.5rem 2rem;
		text-align: center;
		line-height: 1.5em;
	}
	.actions button {
		width: 50%;
	}
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
