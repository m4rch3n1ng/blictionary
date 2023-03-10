<script>
	import icon from "$lib/assets/icon.webp"
</script>


<a href="/" class="wrap">
	<img alt="icon" src={icon} />
	<div id="blitionary-title">blictionary</div>
</a>

<style>
	a {
		color: var(--text-color);
		text-decoration: none;

		transition: color 0.25s;
	}

	a:focus-visible {
		outline: 2px solid var(--text-color);
		outline-offset: 3px;
	}

	.wrap {
		display: flex;
		align-items: center;
	}

	img {
		margin: 0;
		border-radius: 6px;

		width: var(--header-item-height);
		height: var(--header-item-height);
	}

	#blitionary-title {
		font-size: var(--font-size-h);
		font-weight: 700;
		margin: 0;
		margin-left: 0.4em;
	}

	@media screen and (max-width: 550px) {
		#blitionary-title {
			display: none;
		}
	}
</style>
