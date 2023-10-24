<script>
    let name = "Klaas Post";
    let email = "klaas.post@windesheim.nl";
    let phone = "+31 0640940856";
    let address = "Windesheim - T, 8017 CA Zwolle";
    let githubLink = "https://github.com/KlaadPost";
</script>

<div class="container">
    <!-- Profile Section -->
    <section class="profile text-center">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
            src="https://cdn.discordapp.com/attachments/890578750763331674/1161595408326332466/ProfilePicture.jpg"
            alt="Profile Picture"
            class="img-thumbnail"
            style="max-width: 170px; max-height: 170px; border-radius: 50%; margin-bottom: 20px;"
        />
        <h1 class="name font-weight-bold">{name}</h1>
    </section>

    <!-- Divider -->
    <hr class="divider" />

    <!-- First Section -->
    <section class="education">
        <h2 class="title font-weight-bold">Opleidingen</h2>
        <div class="item">
            <h5 class="item-title font-weight-bold">Swaglord</h5>
            <p class="item-subtitle">Swag Academy, Sausland</p>
        </div>
        <div class="item">
            <h5 class="item-title font-weight-bold">HBO-ICT</h5>
            <p class="item-subtitle">
                Christelijke Hoge School Windesheim, Zwolle
            </p>
        </div>
    </section>

    <!-- Divider -->
    <hr class="divider" />

    <!-- Second Section -->
    <section class="contact">
        <h2 class="title font-weight-bold">Personalia</h2>
        <ul class="item-list list-unstyled">
            <li><span class="emoji">📧</span> Email: {email}</li>
            <li><span class="emoji">📞</span> Phone: {phone}</li>
            <li><span class="emoji">🏠</span> Address: {address}</li>
            <li>
                <span class="emoji">🔗</span> Links:
                <a href={githubLink}>GitHub</a>
            </li>
        </ul>
    </section>
</div>
