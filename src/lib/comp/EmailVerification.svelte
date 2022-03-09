<script lang="ts">
	import { loading } from '$lib/stores/loading/loading_store';
	import generate7DigitPasscode from '$lib/util/generate7DigitPasscode';
	import { makePostOptions } from '$lib/util/makePostOptions';
	import { validateEmail } from '$lib/util/validators';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import ErrorMessage from './ErrorMessage.svelte';

	const dispatch = createEventDispatcher();

	let email: string = '';
	let passcode: string;
	let recievedPasscode: string = '';
	let state: string = 'to be sent';
	let error;
	let codeNotMatch = false;
	$: disableSend = email.trim().length < 10 || !validateEmail(email) || $loading;
	$: disableVerifyBtn = recievedPasscode.trim().length < 7 || $loading;

	const send = async () => {
		passcode = generate7DigitPasscode();
		loading.set(true);
		const res = await fetch('/api/send-otp', makePostOptions({ email, passcode }));
		res.ok ? (state = 'sent') : (error = (await res.json()).message || 'Something went wrong');
		loading.set(false);
	};

	const verify = () => {
		codeNotMatch = passcode !== recievedPasscode;
		if (!codeNotMatch) {
			dispatch('verify', {
				email: email
			});
		}
	};
</script>

{#if state === 'to be sent'}
	<section aria-label="input email form" role="form" in:slide>
		<input type="text" id="email" name="email" bind:value={email} placeholder="Your email here" />

		<ErrorMessage visible={error} message={error} />

		<button on:click={send} disabled={disableSend} class="filled"> Send me an OTP </button>
		<a
			href="login"
			style="pointer-events: {$loading ? 'none' : 'visible'};"
			sveltekit:prefetch
			class="small"
		>
			Already have an account? Login instead
		</a>
	</section>
{:else if state === 'sent'}
	<section aria-label="input email form" role="form" in:slide>
		<p>Please check your inbox for the OTP</p>
		<input
			type="text"
			id="recievedPasscode"
			name="recievedPasscode"
			bind:value={recievedPasscode}
			placeholder="Enter the code here"
		/>
		<ErrorMessage visible={codeNotMatch} message={'Incorrect passcode'} />

		<button on:click={verify} disabled={disableVerifyBtn} class="filled"> Verify </button>
	</section>
{/if}

<style>
	section {
		width: min(300px, 90%);
		margin: 3rem auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
	}
	input,
	button {
		width: 100%;
	}
	a {
		margin-top: 0.8rem;
	}
</style>
