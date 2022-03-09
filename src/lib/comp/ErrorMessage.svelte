<script lang="ts">
	export let message: string;
	export let visible: boolean;
	export let marginY = 0;
</script>

{#if visible}
	<p style="margin: {marginY}rem auto;">{message}</p>
{/if}

<style>
	p {
		text-align: center;
		font-size: 0.9rem;
		color: var(--red);
	}
</style>
