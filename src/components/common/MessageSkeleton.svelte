<script lang="ts">
    const getRandomWidth = (minWidthPercentage: number, maxWidthPercentage: number) => {
        return `${Math.random() * (maxWidthPercentage - minWidthPercentage) + minWidthPercentage}%`;
    };

    const shouldRenderSecondParagraph = Math.random() <= 0.2;
</script>

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
