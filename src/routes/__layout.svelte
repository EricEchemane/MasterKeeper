<script>
	import { theme } from '$lib/stores/theme/theme_store';
	import fillSliderTracks from '$lib/slider';
	import { onMount } from 'svelte';
	import IndeterminateProgress from '$lib/comp/IndeterminateProgress.svelte';

	$: if (typeof window !== 'undefined') {
		$theme === 'dark'
			? document.body.classList.add('dark-theme')
			: document.body.classList.remove('dark-theme');
	}

	onMount(() => {
		fillSliderTracks();
	});
</script>

<IndeterminateProgress />
<main>
	<slot />
</main>

<style>
	main {
		max-width: 700px;
		margin: 0 auto;
	}
</style>
