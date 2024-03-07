<script lang="ts">
    import type { ChatMessage, User } from "../../types";
    import { getAntiForgeryToken } from "../../utils";
    import Timestamp from "./Timestamp.svelte";

    export let chatMessageGroup: ChatMessage[]
    const firstMessage: ChatMessage = chatMessageGroup[0]

    export let currentUser: User;

    let deleteButtonDisabled = false;
    let isDeleting = false;

    const canDelete = (senderId: string) => {
        return (currentUser.role >= 1) || currentUser.id === senderId 
    }

    const handleDelete = async (message: ChatMessage) => {
        try 
        {
            isDeleting = true;

            const antiForgeryToken = await getAntiForgeryToken();
            // Process or send the message here
            const requestBody = JSON.stringify({ Id: message.id });
            await fetch("https://localhost:44336/api/messages", {
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

    .chatmessage:hover {
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

    .chatmessage:hover button.delete:not([disabled]) {
        opacity: 0.8; 
    }
</style>

<hgroup>
    <strong>
        {#if currentUser.role == 2}
            <a href={"https://localhost:44336/Admin/Edit/" + firstMessage.senderId}>{firstMessage.senderName}</a>
        {:else}
            {firstMessage.senderName}
        {/if}
        <Timestamp date={new Date(firstMessage.created)}/>
    </strong>
    <hgroup>
        {#each chatMessageGroup as chatMessage (chatMessage.id)}
            <p class="chatmessage">
                {chatMessage.message}
                {#if canDelete(chatMessage.senderId)}
                    <button 
                    class="delete secondary outline" 
                    disabled={deleteButtonDisabled}
                    on:click={() => handleDelete(chatMessage)}
                    title="Delete Message"
                    aria-busy={isDeleting}/>
                {/if}
            </p>
        {/each}
    </hgroup>
</hgroup>