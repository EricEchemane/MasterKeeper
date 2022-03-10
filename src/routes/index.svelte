<script lang="ts">
	import FeatureComp from '$lib/comp/Feature.svelte';
	import { goto, prefetch } from '$app/navigation';
	import { onMount } from 'svelte';
	import { features } from '$lib/features';
	import { Progress } from '$lib/tweeners';

	onMount(() => {
		prefetch('/create');
	});

	let i = 0;
	$: currentFeature = features[i];

	const next = () => {
		if (i < features.length - 1) {
			i += 1;
			Progress.set(i);
		} else {
			goto('/create');
		}
	};
</script>

<h1 class="title">Master Keeper</h1>
<p class="description">An encrypted account storage system</p>

<FeatureComp index={i} feature={currentFeature} />

<progress max="3" value={$Progress} />

<div class="actions">
	{#if $Progress < 3}
		<button id="next" class="filled" on:click={next}> &#x2192 </button>
	{:else}
		<button id="next-2" class="filled" on:click={next}> Start now! </button>
	{/if}
</div>

<style>
	.description {
		text-align: center;
	}
	#next {
		display: block;
		margin: auto;
		width: min(256px, 100%);
		padding: 1rem;
		font-weight: 600;
		font-size: 2rem;
	}
	#next-2 {
		display: block;
		margin: auto;
		width: min(256px, 100%);
		padding: 1rem;
	}
	progress {
		width: min(256px, 100%);
		display: block;
		margin: 0 auto 0.5rem;
		height: 7px;
	}
	.actions {
		padding-bottom: 3rem;
	}
</style>
