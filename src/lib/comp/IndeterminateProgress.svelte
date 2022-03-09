<script>
	import { loading } from '$lib/stores/loading/loading_store';
</script>

{#if $loading}
	<main>
		<div class="line" />
		<div class="subline inc" />
		<div class="subline dec" />
	</main>
{/if}

<style>
	main {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100vw;
		height: 5px;
		overflow-x: hidden;
		z-index: 100;
	}
	.line {
		position: absolute;
		top: 0;
		opacity: 0.4;
		background: #4a8df8;
		width: 150%;
		height: 5px;
	}
	.subline {
		position: absolute;
		background: #4a8df8;
		height: 5px;
	}
	.inc {
		animation: increase 2s infinite;
	}
	.dec {
		animation: decrease 2s 0.5s infinite;
	}
	@keyframes increase {
		from {
			left: -5%;
			width: 5%;
		}
		to {
			left: 130%;
			width: 100%;
		}
	}
	@keyframes decrease {
		from {
			left: -80%;
			width: 80%;
		}
		to {
			left: 110%;
			width: 10%;
		}
	}
</style>
