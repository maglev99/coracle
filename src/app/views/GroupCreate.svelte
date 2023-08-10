<script lang="ts">
  import {navigate} from 'svelte-routing'
  import {generatePrivateKey, getEventHash, getSignature, getPublicKey} from 'nostr-tools'
  import {now} from 'src/util/misc'
  import GroupDetailsForm from 'src/app/shared/GroupDetailsForm.svelte'
  import {Groups} from 'src/app/engine'
  import {wrap} from 'src/app/engine/util/giftWrap'

  const adminPrivkey = generatePrivateKey()
  const adminPubkey = getPublicKey(adminPrivkey)
  const sharedPrivkey = generatePrivateKey()
  const sharedPubkey = getPublicKey(sharedPrivkey)

  const onSubmit = ({name, about, picture, relays, publish}) => {
    Groups.adminKeys.key(adminPubkey).set({
      group: adminPubkey,
      pubkey: adminPubkey,
      privkey: adminPrivkey,
    })

    Groups.sharedKeys.key(sharedPubkey).set({
      group: adminPubkey,
      pubkey: sharedPubkey,
      privkey: sharedPrivkey,
    })

    const event = Builder.createGroupMeta({
      content: JSON.stringify({name, about, picture}),
      tags: relays.map(url => ["r", url]),
    })

    let signedEvent

    if (publish) {
      event.pubkey = pubkey
      event.created_at = now()
      event.id = getEventHash(event)
      event.sig = getSignature(event, privkey)

      signedEvent = event
    } else {
      signedEvent = wrap(adminPrivkey, sharedPubkey, sharedPrivkey, event)
    }

    Outbox.publish(signedEvent, relays)

    navigate(`/groups/${pubkey}/admin`)
  }
</script>

<GroupDetailsForm {onSubmit} values={{relays: []}}} />

