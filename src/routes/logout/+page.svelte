<script>
    import { onMount } from "svelte";

    onMount(() => {
        document.querySelector("form")?.submit();
    });
</script>

<form method="post"></form>
