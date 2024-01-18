<script lang="ts">
    import { getAntiForgeryToken } from "../../utils";

    let message = "";
  
    const handleSubmit = async () => {
      const requestBody = JSON.stringify( {Message: message });
      const antiForgeryToken = await getAntiForgeryToken();

      if (message.trim() !== "") {
        // Process or send the message here
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
  
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        // Prevent the default behavior (form submission) on Enter press
        event.preventDefault();
        handleSubmit();
      }
    };
  </script>
 
  <form on:submit|preventDefault={handleSubmit}>
    <textarea bind:value={message} maxlength="1000" class="message-input" on:keyup={handleKeyUp}/>
  </form>