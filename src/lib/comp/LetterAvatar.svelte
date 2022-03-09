<script>
	export let nickname;
	export let size = 2.75;
</script>

<div class="avatar" style="width: {size}rem; height: {size}rem; font-size: calc({size}rem / 2)">
	{#if nickname && nickname.length > 0}
		{nickname[0].toUpperCase()}
	{/if}
</div>

<style>
	.avatar {
		background-color: var(--blue);
		border-radius: 50%;
		display: grid;
		place-items: center;
		line-height: 100%;
		color: white;
		font-weight: bold;
		border: 3px solid var(--bg);
		box-shadow: 0 0 2px hsla(0, 0%, 0%, 0.5);
	}
</style>
