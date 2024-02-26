<script lang="ts">
  import { getAntiForgeryToken } from "../../utils";

  let lastSubmissionTime: number = 0;
  const cooldownPeriod: number = 500;
  
  let message = "";
  let isSubmitting = false;
  $: isInvalid = message.length > 1200 || null

  const handleSubmit = async () => {
    isSubmitting = true;
    try 
    {
      const antiForgeryToken = await getAntiForgeryToken();
      const requestBody = JSON.stringify({ Message: message });
      await fetch("https://localhost:44336/Chat", 
      {
        method: "POST",
        headers: 
        {
          "Content-Type": "application/json",
          'RequestVerificationToken': antiForgeryToken,
        },
        body: requestBody
      });
    }
    finally
    {
      isSubmitting = false;
      message = "";
    }
  };

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key !== "Enter") 
    {
      return;
    }

    event.preventDefault();

    if (message.trim() === "") 
    {
      return;
    }

    const currentTime = Date.now();

    if (currentTime - lastSubmissionTime <= cooldownPeriod) 
    {
      return;
    }

    lastSubmissionTime = currentTime;

    if (isInvalid) 
    {
      return;
    }

    await handleSubmit();
  };
</script>

<footer>
  <form class="container">
    <input
      type="text"
      bind:value={message}
      class="message-input"
      placeholder="Write a message..."
      on:keydown={handleKeyDown}
      aria-invalid={isInvalid}
    />
    {#if isSubmitting}
      <progress />
    {:else}
      <progress max="1200" value={message.length} />
    {/if}
  </form>
</footer>
