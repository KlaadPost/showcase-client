<script lang=ts>
    const profilePicFileName = "../../../pfp.jpeg"; // dist -> shwocase -> lib -> wwwroot
</script>

<style>    
    img.profile {
        width: 170px;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 20px;
    }
</style>

<section class="center">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img
        src={profilePicFileName}
        alt="Profile Picture"
        class="profile"
    />
    <h1>Klaas Post</h1>
</section>