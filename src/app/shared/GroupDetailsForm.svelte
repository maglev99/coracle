<script lang="ts">
  import {pluck} from 'ramda'
  import {getPublicKey} from 'nostr-tools'
  import {fly} from "src/util/transition"
  import {toast} from "src/partials/state"
  import Field from "src/partials/Field.svelte"
  import Toggle from "src/partials/Toggle.svelte"
  import MultiSelect from "src/partials/MultiSelect.svelte"
  import ImageInput from "src/partials/ImageInput.svelte"
  import Textarea from "src/partials/Textarea.svelte"
  import Input from "src/partials/Input.svelte"
  import Anchor from "src/partials/Anchor.svelte"
  import Content from "src/partials/Content.svelte"
  import Heading from "src/partials/Heading.svelte"
  import {Groups} from "src/app/engine"

  export let values
  export let onSubmit

  const searchRelays = q =>
    pluck('url', Nip65.searchRelays.get()(q))

  const submit = () => {
    toast.show("info", "Your group has been saved!")

    onSubmit(values)
  }

  document.title = "Create Group"
</script>

<form on:submit|preventDefault={submit} in:fly={{y: 20}}>
  <Content>
    <div class="mb-4 flex flex-col items-center justify-center">
      <Heading>Create Group</Heading>
      <p>Create a private place where members can talk.</p>
    </div>
    <div class="flex w-full flex-col gap-8">
      <Field label="Name" info="The name of the group">
        <Input bind:value={values.name} />
      </Field>
      <Field label="Picture" info="A picture for the group">
        <ImageInput
          bind:value={values.picture}
          icon="image-portrait"
          maxWidth={480}
          maxHeight={480} />
      </Field>
      <Field label="About" info="The group's decription">
        <Textarea bind:value={values.about} />
      </Field>
      <Field label="Relays" info="Which relays members should publish notes to">
        <MultiSelect search={searchRelays} bind:value={values.relays} />
      </Field>
      <Field label="Make Public" info="If enabled, this will generate a public listing for the group.">
        <Toggle bind:value={values.publish} />
      </Field>
      <Anchor tag="button" theme="button" type="submit" class="text-center">Save</Anchor>
    </div>
  </Content>
</form>
