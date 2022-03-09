<script lang="ts">
	export let avatar: string;
	export let alt: string;
	export let size = 3.75;
</script>

<div class="avatar-container" style="width: {size}rem; height: {size}rem">
	<img {alt} src={avatar} />
</div>

<style>
	.avatar-container:hover {
		box-shadow: 0 0 0 1px var(--gray1);
	}
	.avatar-container {
		border-radius: 50%;
		overflow: hidden;
		transition: 114ms;
		cursor: pointer;
	}
	img {
		width: 100%;
	}
</style>
