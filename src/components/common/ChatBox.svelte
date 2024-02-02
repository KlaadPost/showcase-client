<script lang="ts">
    import Message from "./Message.svelte";
    import type { ChatMessage } from "../../types";
    import { onMount, afterUpdate } from "svelte";
    import * as signalR from "@microsoft/signalr";

    let chatbox: HTMLElement;
    let chatMessages: ChatMessage[] = [];
    let connection: signalR.HubConnection;

    let pageIndex = 0;
    const pageSize = 20;
    let initialLoad = true;
    let isUserScrolling = false;

    const scrollToBottom = () => {
        chatbox.scrollTop = chatbox.scrollHeight;
    };

    const handleScroll = async () => {
        const isAtBottom = chatbox.scrollHeight - chatbox.scrollTop === chatbox.clientHeight;
        isUserScrolling = !isAtBottom;

        if(chatbox.scrollTop === 0)
        {
            chatbox.scrollTop = 1;
            await fetchMoreMessages();
        }
    };

    const fetchMoreMessages = async () => {
        pageIndex++;
        try {
            const response = await fetch(`https://localhost:44336/Chat/Messages?pageIndex=${pageIndex}&pageSize=${pageSize}`);
            if (response.ok) {
                const newMessages = await response.json();
                chatMessages = [...newMessages, ...chatMessages];
                if (!isUserScrolling) {
                    scrollToBottom();
                }
            } else {
                console.error(`Failed to fetch more chat messages. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching more chat messages:", error);
        }
    };

    onMount(async () => {
        try {
            // Create SignalR connection
            connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:44336/chatHub")
                .build();

            connection.on("ReceiveMessage", chatMessage => {
                chatMessages = [...chatMessages, chatMessage];
                if (!isUserScrolling) {
                    setTimeout(scrollToBottom, 0);
                }
            });

            await connection.start();

            const response = await fetch("https://localhost:44336/Chat/Messages");
            if (response.ok) {
                chatMessages = await response.json();
                if (initialLoad) {
                    setTimeout(scrollToBottom, 0); 
                    initialLoad = false;
                }
            } else {
                console.error(`Failed to fetch chat messages. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error initializing SignalR:", error);
        }
    });

    afterUpdate(() => {
        chatbox.addEventListener('scroll', handleScroll);
        return () => {
            chatbox.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<style>
    .chatbox {
        max-height: 60svh;
        overflow-y: auto;
    }
</style>

<div class="chatbox" bind:this={chatbox}>
    {#each chatMessages as chatMessage (chatMessage.id)}
        <Message chatMessage={chatMessage} />
    {/each}
</div>
