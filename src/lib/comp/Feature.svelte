<script lang="ts">
	import { features } from '$lib/features';
	import type { Feature } from '$lib/types/Feature';
	import { slide } from 'svelte/transition';

	export let feature: Feature;
	export let index: number;
</script>

{#if index < features.length - 1}
	{#key feature}
		<section aria-label={'Feature:' + feature.title} transition:slide>
			<img src={feature.illustration} alt={feature.title} />
			<h3 class="title">{feature.title}</h3>
		</section>
	{/key}
{:else}
	{#key feature}
		<section aria-label={'Feature:' + feature.title} in:slide>
			<img src={feature.illustration} alt={feature.title} />
			<h3 class="title">{feature.title}</h3>
		</section>
	{/key}
{/if}

<style>
	section {
		margin: 4rem auto 2rem;
	}
	img {
		display: block;
		margin: auto;
		height: 214px;
		max-width: 90%;
	}
	.title {
		text-align: center;
		margin: 2rem auto;
	}
</style>
