<script lang="ts">
    import { onMount } from 'svelte';
    import type { User } from '../../types';
    import ChatBox from '../common/ChatBox.svelte';
    import ChatInput from '../common/ChatInput.svelte';

    $: currentUser = null

    onMount(async () => {
        // Fetch user information from the API endpoint
        const response = await fetch('/api/user');
        currentUser = await response.json();
    });
</script>

<article>
    {#if (currentUser)}
        <ChatBox currentUser={currentUser}/>
        <ChatInput currentUser={currentUser}/>
    {/if}
</article>


