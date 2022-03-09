<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import ImgAvatar from './ImgAvatar.svelte';
	import { clickOutside } from '$lib/util/clickoutside';

	export let outclick;
	let avatarsPath: string[] = [
		'/avatars/female_brown_hair.svg',
		'/avatars/female_green_hair.svg',
		'/avatars/female_pink_hair.svg',
		'/avatars/female_purple_hair.svg',
		'/avatars/male_brown_hair.svg',
		'/avatars/male_orange_hair.svg',
		'/avatars/male_rockstar.svg',
		'/avatars/nerd_female.svg',
		'/avatars/nerd_male.svg'
	];
	const dispatch = createEventDispatcher();

	const select = (avatarPath: string) => {
		dispatch('select', { avatarPath });
	};
</script>

<section
	aria-label="choose avatar"
	transition:slide={{ duration: 228 }}
	use:clickOutside
	on:outclick={outclick}
>
	{#each avatarsPath as avatar, i}
		<div on:click={() => select(avatar)}>
			<ImgAvatar {avatar} alt={`avatar-${i}`} />
		</div>
	{/each}
</section>

<style>
	section {
		padding: 1.5rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(3, 1fr);
		position: absolute;
		background: var(--bg-main);
		justify-content: center;
		z-index: 7;
		border-radius: 1rem;
		box-shadow: 0 4px 24px -4px hsla(0, 0%, 0%, 0.3);
		border: 1px solid var(--gray3);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
