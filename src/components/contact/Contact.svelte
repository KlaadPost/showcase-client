<script lang="ts">
    let firstName = "";
    let lastName = "";
    let phoneNumber = "";
    let email = "";
    let isSubmitting = false;
    let submissionStatus = "";

    const handleSubmit = async () => {
        isSubmitting = true;
        try {
            const response = await fetch("http://localhost:3000/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                }),
            });
            if (response.ok) {
                submissionStatus = "Contactverzoek verzonden";
                firstName = "";
                lastName = "";
                phoneNumber = "";
                email = "";
            } else {
                submissionStatus = "Contactverzoek gefaald ";
            }
        } catch (error) {
            submissionStatus = "Contactverzoek gefaald ";
        } finally {
            isSubmitting = false;
        }
    };
</script>

<div>
    <!-- Profile Picture Section -->
    <section>
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
            src="https://cdn.discordapp.com/attachments/890578750763331674/1161595408326332466/ProfilePicture.jpg"
            alt="Profile Picture"
            style="max-width: 170px; max-height: 170px; border-radius: 50%; margin-bottom: 20px;"
        />
        <h1>Klaas Post</h1>
    </section>

    <hr />

    <!-- Availability Section -->
    <section>
        <h3>Wanneer ben ik aanwezig?</h3>
        <figure class="grid">
            <div>ma 9-17</div>
            <div>di 9-17</div>
            <div>wo 9-17</div>
            <div>do 9-17</div>
            <div>vr 9-17</div>
        </figure>
    </section>

    <hr />

    <!-- Form Section -->
    <section class="form">
        <form on:submit|preventDefault={handleSubmit}>
            <div>
                <label for="first-name">Voornaam:</label>
                <input
                    type="text"
                    placeholder="Je voornaam"
                    id="first-name"
                    bind:value={firstName}
                    required
                />
            </div>
            <div>
                <label for="last-name">Achternaam:</label>
                <input
                    type="text"
                    placeholder="Je achternaam"
                    id="last-name"
                    bind:value={lastName}
                    required
                />
            </div>
            <div>
                <label for="phone-number">Telefoonnummer:</label>
                <input
                    type="text"
                    placeholder="Je telefoonnummer"
                    id="phone-number"
                    bind:value={phoneNumber}
                    required
                />
            </div>
            <div>
                <label for="email">Email:</label>
                <input
                    type="email"
                    placeholder="Je email"
                    id="email"
                    bind:value={email}
                    required
                />
            </div>
            <button
                aria-busy={isSubmitting}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Verzenden..." : "Verzend"}
            </button>
        </form>
        <p>{submissionStatus}</p>
    </section>
</div>
