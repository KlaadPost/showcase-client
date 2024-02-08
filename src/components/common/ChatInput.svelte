<script lang="ts">
  import { getAntiForgeryToken } from "../../utils";

  let message = "";
  $: isInvalid = message.length > 1200 || null

  const handleSubmit = async () => {
    const antiForgeryToken = await getAntiForgeryToken();

    if (message.trim() !== "") {
      // Process or send the message here
      const requestBody = JSON.stringify({ Message: message });
      await fetch("https://localhost:44336/Chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'RequestVerificationToken': antiForgeryToken,
        },
        body: requestBody
      });

      // Clear the input field after submitting
      message = "";
    }
  };

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) 
    {
      event.preventDefault();
      if(!isInvalid)
      {
        await handleSubmit();
      }
    }
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
    <progress max="1200" value={message.length}/>
  </form>
</footer>
