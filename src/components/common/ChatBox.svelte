<script lang="ts">
    import Message from "./Message.svelte";
    import MessageSkeleton from "./MessageSkeleton.svelte";
    import type { ChatMessage, User } from "../../types";
    import { onMount, afterUpdate } from "svelte";
    import * as signalR from "@microsoft/signalr";

    export let currentUser: User | null;
    
    let chatbox: HTMLElement;
    let chatMessages: ChatMessage[][] = [];
    let isLoadingMessages = true;

    let connection: signalR.HubConnection;

    let pageIndex = 0;
    const pageSize = 10;
    const timeFrame = 5;
    let initialLoad = true;
    let isUserScrolling = false;
    let endReached = false;

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
        
        if(endReached || isLoadingMessages)
        {
            return "Skipping fetch";
        }
        
        pageIndex++;

        try 
        {
            const response = await fetch(`/api/messages?pageIndex=${pageIndex}&pageSize=${pageSize}&timeFrame=${timeFrame}`);
            
            if (response.ok) 
            {
                const newMessages = await response.json();

                // Set endReached to true so no new request are made
                if(newMessages.length === 0)
                {
                    endReached = true;
                }

                chatMessages = [...newMessages, ...chatMessages];
            } 
            else 
            {
                // console.error(`Failed to fetch more chat messages. Status: ${response.status}`);
            }
        } 
        catch (error) 
        {
            // console.error("Error fetching more chat messages:", error);
        }
        finally
        {
            isLoadingMessages = false;
        }
    };

    onMount(async () => {
        try 
        {
            setTimeout(scrollToBottom, 0); 

            // Create SignalR connection
            connection = new signalR.HubConnectionBuilder()
                .withUrl("/chatHub")
                .build();

            connection.on("ReceiveMessage", (chatMessage) => {
                console.log("Chatmessage recieved: " + chatMessage.message)
                const lastGroup = chatMessages[chatMessages.length - 1]; 
                const firstMessage = lastGroup && lastGroup.length > 0 ? lastGroup[0] : null;

                if (firstMessage !== null && (new Date(chatMessage.created).getMinutes() - new Date(firstMessage.created).getMinutes()) <= timeFrame && firstMessage.senderId === chatMessage.senderId) {
                    // console.log(`
                    // ${new Date(chatMessage.created).getMinutes()} - ${new Date(firstMessage.created).getMinutes()} = ${new Date(chatMessage.created).getMinutes() - new Date(firstMessage.created).getMinutes()}\n
                    // ${firstMessage.senderName}, ${chatMessage.senderName}`)
                    
                    chatMessages = [...chatMessages.slice(0, -1), [...lastGroup, chatMessage]];
                } else {
                    // console.log("Message not within timeframe, adding to new group")
                    chatMessages = [...chatMessages, [chatMessage]];
                }

                if (!isUserScrolling) {
                    setTimeout(scrollToBottom, 0);
                }
            });

            connection.on('MessageDeleted', (deletedMessageId) => {
                // Find the group and delete the message
                const updatedChatMessages = chatMessages.map((group) => {
                    const messageIndex = group.findIndex((msg) => msg.id === deletedMessageId);

                    if (messageIndex !== -1) {
                        // Remove the message from the group
                        const updatedGroup = [...group.slice(0, messageIndex), ...group.slice(messageIndex + 1)];

                        // If the group is now empty, return an empty array to remove the group
                        return updatedGroup.length === 0 ? [] : updatedGroup;
                    }

                    return group;
                });

                chatMessages = updatedChatMessages.filter((group) => group.length > 0);
            });

            await connection.start();

            const response = await fetch("/api/messages");
            if (response.ok) 
            {
                chatMessages = await response.json();
                if (initialLoad) 
                {
                    setTimeout(scrollToBottom, 0); 
                    initialLoad = false;
                }
            } 
            else 
            {
                // console.error(`Failed to fetch chat messages. Status: ${response.status}`);
            }
        } 
        catch (error) 
        {
            // console.error("Error initializing SignalR:", error);
        }
        finally
        {
            isLoadingMessages = false;
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
        max-height: 58svh;
        min-height: 58svh;
        overflow-y: auto;
    }
</style>

<div class="chatbox" bind:this={chatbox}>
    {#if isLoadingMessages || currentUser == null}
        {#each Array(pageSize) as _}
            <MessageSkeleton />
        {/each}
    {:else}
        {#each chatMessages as chatMessageGroup}
            <Message chatMessageGroup={chatMessageGroup} currentUser={currentUser} />
        {/each}
    {/if}
</div>
