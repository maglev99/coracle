<script lang="ts">
  export let label
  export let info
</script>

<div class="flex flex-col gap-1">
  <div class="flex items-center gap-2">
    <label class="text-bold">{label}</label>
    <slot />
  </div>
  <p class="text-sm text-gray-4">{info}</p>
</div>
