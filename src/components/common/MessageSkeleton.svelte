<script lang="ts">
    const getRandomWidth = (minWidthPercentage: number, maxWidthPercentage: number) => {
        return `${Math.random() * (maxWidthPercentage - minWidthPercentage) + minWidthPercentage}%`;
    };

    const shouldRenderSecondParagraph = Math.random() <= 0.2;
</script>

<style>
    .skeleton {
        position: relative;
        display: block;
        max-height: 25px; /* To account for the text not taking up the whole height */
        background: var(--pico-color); /* Gets color assigned by theme */
        animation: loading 1.5s infinite;
        border-radius: 6px;
        margin-bottom: 4px;
        overflow: hidden;
        opacity: 0.4;
    }

    .skeleton::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0)
        );
        animation: gleam 1.5s infinite;
    }

    @keyframes gleam {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
</style>

<hgroup>
    <div style="width:100%">
        <h6 class="skeleton" style="width: {getRandomWidth(20, 30)}; display: inline-block;">&nbsp;</h6>
        <small class="secondary skeleton" style="width: 20%; display: inline-block;">&nbsp;</small>
    </div>
    <p class="skeleton" style="width: {getRandomWidth(50, 90)}">&nbsp;</p>
    {#if shouldRenderSecondParagraph}
        <p class="skeleton" style="width: {getRandomWidth(50, 60)}">&nbsp;</p>
    {/if}
</hgroup>
