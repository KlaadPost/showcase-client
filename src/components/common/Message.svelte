<script lang="ts">
    import type { ChatMessage } from "../../types";
    import { getAntiForgeryToken } from "../../utils";
    import Timestamp from "./Timestamp.svelte";
    export let chatMessage: ChatMessage;

    let deleteButtonDisabled = false;
    let isDeleting = false;

    const handleDelete = async () => {
        try 
        {
            isDeleting = true;

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
            // console.error("Error deleting chat message:", error);
        }
        finally
        {
            // In case message wasn't deleted
            isDeleting = false;
        }
    }
</script>

<style>
    .chatmessage {
        position: relative;
        transition: opacity var(--pico-transition);
    }

    .chatmessage:hover{
        opacity: 0.8;
    }

    button.delete {
        width: 1rem;
        height: 1rem;
        transition: opacity var(--pico-transition);
        position: absolute;
        top: -0.75rem;
        right: 1rem;
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    button.delete::before {
        flex-shrink: 0;
    }

    button.delete:not([aria-busy="true"]) {
        background-image: var(--pico-icon-close);
        background-position: center;
        background-size: auto 1rem;
        background-repeat: no-repeat;
    }

    hgroup.chatmessage:hover button.delete:not([disabled]) {
        opacity: 0.8; 
    }
</style>

<hgroup class="chatmessage">
    <button 
        class="delete secondary outline" 
        disabled={deleteButtonDisabled}
        on:click={handleDelete}
        title="Delete Message"
        aria-busy={isDeleting}/>
    <h6>
        {chatMessage.senderName}
        <Timestamp date={new Date(chatMessage.created)}/>
    </h6>
    <p>{chatMessage.message}</p>
</hgroup>
