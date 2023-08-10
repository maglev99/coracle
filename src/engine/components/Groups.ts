import {pick} from 'ramda'
import {getPublicKey} from 'nostr-tools'
import {groupAttrs} from 'src/util/nostr'
import type {Group, GroupKey} from "src/engine/types"
import type {Engine} from "src/engine/Engine"
import {collection} from "src/engine/util/store"
import {unwrap} from 'src/engine/util/giftWrap'

export class Groups {
  adminKeys = collection<GroupKey>("pubkey")
  sharedKeys = collection<GroupKey>("pubkey")
  groups = collection<Group>("pubkey")
  events = collection<GroupEvent>("id")
  requests = collection<GroupEvent>("id")

  initialize(engine: Engine) {
    const handleGroupMeta = e => {
      const group = this.groups.key(e.pubkey).get()

      if (e.created_at < group?.updated_at) {
        return
      }

      const content = tryJson(() => pick(groupAttrs, JSON.parse(e.content))) as Partial<Group>

      if (!content?.name) {
        return
      }

      this.groups.key(e.id).merge({
        ...content,
        publish: true,
        pubkey: e.pubkey,
        updated_at: e.created_at,
        relays: Tags.from(e).relays(),
      })
    }

    const handleGroupModerators = (e: Event) => {
      console.error('Not implemented')
    }

    const withUnwrappedEvent = (privkey, e, cb) => {
      let wrap, seal, rumor

      try {
        ({wrap, seal, rumor} = unwrap(privkey, e))
      } catch (e) {
        console.warn(e)

        return
      }

      cb({wrap, seal, rumor})
    }

    const handleWrappedEventToMe = e => {
      const {pubkey, privkey} = engine.Keys.current.get() || {}

      if (Tags.from(e).getMeta('p') !== pubkey) {
        return
      }

      withUnwrappedEvent(privkey, e, ({wrap, seal, rumor}) => {
        if (rumor.kind === 24) {
          const privkey = Tags.from(rumor).getMeta('privkey')

          if (privkey) {
            const pubkey = getPublicKey(privkey)

            this.sharedKeys.key(pubkey).set({privkey, group: seal.pubkey})
          }
        }
      })
    }

    const handleWrappedEventToGroup = e => {
      const key = this.sharedKeys.key(e.pubkey).get()

      if (!key) {
        return
      }

      withUnwrappedEvent(key.privkey, e, ({wrap, seal, rumor}) => {
        if (rumor.kind === 10024) {
          handleGroupMeta(rumor)
        } else if (rumor.kind === 10025) {
          handleGroupModerators(rumor)
        } else {
          this.events.key(rumor.id).set({
            group: wrap.pubkey,
            author: seal.pubkey,
            kind: rumor.kind,
            content: rumor.content,
            tags: rumor.tags,
            wrap,
          })
        }
      })
    }

    const handleWrappedEventToAdmin = e => {
      const key = this.adminKeys.key(e.pubkey).get()

      if (!key) {
        return
      }

      withUnwrappedEvent(key.privkey, e, ({wrap, seal, rumor}) => {
        if ([25, 26].includes(rumor.kind)) {
          this.requests.key(rumor.id).set({
            resolved: false,
            group: key.group,
            author: seal.pubkey,
            kind: rumor.kind,
            content: rumor.content,
            tags: rumor.tags,
            wrap,
          })
        }
      })
    }

    engine.Events.addHandler(10024, handleGroupMeta)

    engine.Events.addHandler(10025, handleGroupModerators)

    engine.Events.addHandler(1059, (e: Event) => {
      handleWrappedEventToMe(e)
      handleWrappedEventToGroup(e)
      handleWrappedEventToAdmin(e)
    })

  }
}
