<script lang="ts">
	import EmailVerification from '$lib/comp/EmailVerification.svelte';
	import ErrorMessage from '$lib/comp/ErrorMessage.svelte';
	import Modal from '$lib/comp/modal.svelte';
	import { loading } from '$lib/stores/loading/loading_store';
	import { makePostOptions } from '$lib/util/makePostOptions';
	import { slide } from 'svelte/transition';

	let verified = false;
	let email: string = '';
	let nickname: string = '';
	let password: string = '';
	let confirmPassword: string = '';
	let error;
	let showModal = false;
	let useCreated = false;

	$: disableSubmit =
		password.length < 7 || password !== confirmPassword || nickname.trim().length < 2 || $loading;

	const handlVerify = (event) => {
		email = event.detail.email;
		verified = true;
	};

	const submit = (e: Event) => {
		e.preventDefault();
		if (showModal) return;
		showModal = true;
	};

	const modalClose = () => {
		showModal = false;
	};

	const save = async () => {
		showModal = false;
		loading.set(true);
		const res = await fetch(
			'/api/create',
			makePostOptions({
				nickname: nickname,
				email: email,
				password: password
			})
		);
		if (res.ok) {
			useCreated = true;
		} else {
			error = (await res.json()).message || 'Something went wrong';
		}
		loading.set(false);
	};
</script>

{#if !useCreated}
	<h2 class="title">Create your account</h2>
{/if}

{#if !verified && !useCreated}
	<EmailVerification on:verify={handlVerify} />
{/if}
{#if verified && !useCreated}
	<form aria-label="input email form" in:slide>
		<p>One last step and you're good to go!</p>
		<input type="text" value={email} name="email" disabled />
		<input
			placeholder="Your nickname here"
			autocomplete="name"
			disabled={$loading}
			type="text"
			name="nickname"
			bind:value={nickname}
		/>
		<input
			placeholder="Password"
			autocomplete="new-password"
			disabled={$loading}
			type="password"
			name="password"
			bind:value={password}
		/>
		<input
			placeholder="Confirm your password"
			autocomplete="password"
			disabled={$loading}
			type="password"
			name="confirmPassword"
			bind:value={confirmPassword}
		/>
		<ErrorMessage message={error} visible={error} />
		<button on:click={submit} disabled={disableSubmit} class="filled" id="submit"> Create </button>
		<a
			style="pointer-events: {$loading ? 'none' : 'visible'};"
			href="login"
			sveltekit:prefetch
			class="small"
		>
			Already have an account? Login instead
		</a>
	</form>
{/if}

{#if useCreated}
	<section aria-label="Successfully created" in:slide>
		<h2 class="title">Successfully created!</h2>
		<p>You can now login with your new account.</p>
		<a href="login" sveltekit:prefetch class="small">
			<button class="call-to-action">Login</button>
		</a>
	</section>
{/if}

{#if showModal}
	<Modal
		title="Important!"
		content="Do not forget your password as it is your master password for encrypting and decrypting your data"
		outclick={modalClose}
		confirmTitle="Save!"
		actions={{
			confirm: save,
			cancel: () => (showModal = false)
		}}
	/>
{/if}

<style>
	form,
	section {
		width: min(300px, 90%);
		margin: 3rem auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
	}
	input {
		width: 100%;
	}
	#submit {
		width: 100%;
	}
</style>
