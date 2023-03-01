<script>
	import "./view.css"
</script>


<div class="main">
	<slot />
</div>


<style>
	.main {
		margin-right: 80px;
		margin-left: 80px;
		width: auto;
	}

	@media (max-width: 1000px) {
		.main {
			margin: 0 1rem;
		}
	}

	@media (min-width: 1600px) {
		.main {
			position: static;
			width: 1440px;
			margin-right: auto;
			margin-left: auto;
		}
	}
</style>
