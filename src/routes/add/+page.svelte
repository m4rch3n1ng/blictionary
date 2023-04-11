<script lang="ts">
	import { page } from "$app/stores"
</script>


<form enctype="multipart/form-data" action="/app/add" method="post">
	<input name="file" type="file" />
	<button type="submit">submit</button>
	<input type="text" name="url" value={$page.url.href} hidden />
</form>
