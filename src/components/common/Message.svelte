<script lang="ts">
    import type { ChatMessage } from "../../types";
    import { getAntiForgeryToken } from "../../utils";
    import Timestamp from "./Timestamp.svelte";
    export let chatMessage: ChatMessage;

    let deleteButtonDisabled = false;

    const handleDelete = async () => {
        try 
        {
            const antiForgeryToken = await getAntiForgeryToken();
            // Process or send the message here
            const requestBody = JSON.stringify({ Id: chatMessage.id });
            await fetch("https://localhost:44336/Chat", {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                'RequestVerificationToken': antiForgeryToken,
                },
                body: requestBody
            });
        } 
        catch (error) 
        {
            console.error("Error deleting chat message:", error);
        }
    }
</script>

<style>
    .chatmessage {
        position: relative;
    }

    button.delete {
        width: 1rem;
        height: 1rem;
        background-image: var(--icon-close);
        background-position: center;
        background-size: auto 1rem;
        background-repeat: no-repeat;
        transition: opacity var(--transition);
        position: absolute;
        top: 0;
        right: 0;
        margin-right: 1rem;
        opacity: 0;
    }

    hgroup.chatmessage:hover button.delete:not([disabled]) {
        opacity: 1; 
    }
</style>

<hgroup class="chatmessage">
    <button 
        class="delete secondary outline" 
        disabled={deleteButtonDisabled}
        on:click={handleDelete}/>
    <h6>
        {chatMessage.senderName}
        <Timestamp date={new Date(chatMessage.created)}/>
    </h6>
    <p>{chatMessage.message}</p>
</hgroup>
