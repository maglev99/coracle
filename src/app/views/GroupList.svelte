<script>
  import {filter, prop} from "ramda"
  import {modal} from "src/partials/state"
  import Content from "src/partials/Content.svelte"
  import Anchor from "src/partials/Anchor.svelte"
  import {Keys, Groups} from "src/app/engine"

  const joined = Groups.groups.derived(filter(prop('joined')))

  document.title = "Groups"
</script>

<Content>
  {#if Keys.canSign.get()}
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <i class="fa fa-server fa-lg" />
        <h2 class="staatliches text-2xl">Your groups</h2>
      </div>
      <Anchor theme="button-accent" href={() => modal.push({type: "group/create"})}>
        <i class="fa-solid fa-plus" /> Create Group
      </Anchor>
    </div>
    {#each $joined as group (group.id)}
      <div>{group.name}</div>
    {:else}
      <p class="text-center py-8">You haven't yet joined any groups.</p>
    {/each}
    <div class="mb-2 border-b border-solid border-gray-6 pt-2" />
  {/if}
</Content>
