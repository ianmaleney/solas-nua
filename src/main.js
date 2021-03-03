import App from './App.svelte';

let url = window.location.href

const app = new App({
	target: document.body,
	props: {
		url: url
	}
});

export default app;