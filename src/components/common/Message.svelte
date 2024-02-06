<script lang="ts">
    import type { ChatMessage } from "../../types";
    import Timestamp from "./Timestamp.svelte";
    export let chatMessage: ChatMessage;
</script>

<hgroup>
    <h6>{chatMessage.senderName}&nbsp;<Timestamp date={new Date(chatMessage.created)}/></h6>
    <p>{chatMessage.message}</p>
</hgroup>
