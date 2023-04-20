<script lang="ts">
	import { page } from "$app/stores"
</script>


<form enctype="multipart/form-data" action="/app/add" method="post">
	<div class="dropzone">
		<input name="file" type="file" />
	</div>
	<button type="submit">submit</button>
	<input type="text" name="url" value={$page.url.href} hidden />
</form>


<style>
	.dropzone {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		border-width: 2px;
		border-radius: 2px;
		border-color: #eeeeee;
		border-style: dashed;
		background-color: #fafafa;
		color: #bdbdbd;
		outline: none;
		transition: border 0.24s ease-in-out;
	}

	.dropzone:focus {
		border-color: #2196f3;
	}
</style>
