<script lang="ts">
  import { getAntiForgeryToken } from "../../utils";

  let message = "";

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
    if (event.key === "Enter" && !event.shiftKey) {
      // Prevent the default behavior (form submission) on Enter press
      event.preventDefault();
      await handleSubmit();
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
    />
  </form>
</footer>
