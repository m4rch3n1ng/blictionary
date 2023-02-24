<script>
	import icon from "$lib/assets/icon.webp"
</script>


<a href="/" class="wrap">

	<img alt="icon" src={icon} />

	<div class="h">blictionary</div>
	
</a>

<style>
	a {
		color: var(--text-color);
		text-decoration: none;
	}

	.wrap {
		display: flex;
		align-items: center;
		margin-right: 5px;
	}

	img {
		/* margin: 0 10px 0 5px; */
		margin: 0 5px;
		border-radius: 6px;
		width: var(--header-item-height);
		height: var(--header-item-height);
	}

	.h {
		/* font-size: var(--font-size-h); */
				
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 5px;
	}
</style>
