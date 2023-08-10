import type {Event as NostrToolsEvent, UnsignedEvent} from "nostr-tools"

export type Event = NostrToolsEvent & {
  seen_on: string[]
}

export type Rumor = UnsignedEvent & {
  id: string
}

export type ZapEvent = Event & {
  invoiceAmount: number
  request: Event
}

export type DisplayEvent = Event & {
  zaps: Event[]
  replies: DisplayEvent[]
  reactions: Event[]
  matchesFilter?: boolean
}

export type Filter = {
  ids?: string[]
  kinds?: number[]
  authors?: string[]
  since?: number
  until?: number
  limit?: number
  search?: string
  [key: `#${string}`]: string[]
}

export type DynamicFilter = Omit<Filter, "authors"> & {
  authors?: string[] | "follows" | "network" | "global"
}

export type Zapper = {
  pubkey: string
  lnurl: string
  callback: string
  minSendable: number
  maxSendable: number
  nostrPubkey: string
  created_at: number
  updated_at: number
}

export type Handle = {
  profile: Record<string, any>
  pubkey: string
  address: string
  created_at: number
  updated_at: number
}

export type RelayInfo = {
  contact?: string
  description?: string
  last_checked?: number
  supported_nips?: number[]
  limitation?: {
    payment_required?: boolean
    auth_required?: boolean
  }
}

export type Relay = {
  url: string
  count?: number
  first_seen?: number
  info?: RelayInfo
}

export type RelayPolicyEntry = {
  url: string
  read: boolean
  write: boolean
}

export type RelayPolicy = {
  pubkey: string
  created_at: number
  updated_at: number
  relays: RelayPolicyEntry[]
}

export type GraphEntry = {
  pubkey: string
  updated_at: number
  petnames_updated_at?: number
  petnames?: string[][]
  mutes_updated_at?: number
  mutes?: string[][]
}

export type Profile = {
  pubkey: string
  created_at?: number
  updated_at?: number
  name?: string
  nip05?: string
  lud16?: string
  about?: string
  banner?: string
  picture?: string
  display_name?: string
}

export type Channel = {
  id: string
  name?: string
  about?: string
  picture?: string
  pubkey: string
  updated_at: number
  last_sent?: number
  last_received?: number
  last_checked?: number
  joined?: boolean
  hints: string[]
}

export type Group = {
  pubkey: string
  name?: string
  about?: string
  picture?: string
  publish?: boolean
  updated_at: number
  relays: string[]
  joined?: boolean
}

export type GroupKey = {
  group: string
  pubkey: string
  privkey: string
}

export type GroupEvent = {
  id: string
  group: string
  author: string
  kind: number
  content: string
  tags: string[][]
  wrap: Event
  resolved?: boolean
}

export type Contact = {
  id: string
  pubkey: string
  updated_at: number
  last_sent?: number
  last_received?: number
  last_checked?: number
  hints: string[]
}

export type Message = {
  id: string
  contact?: string
  channel?: string
  pubkey: string
  created_at: number
  content: string
  tags: string[][]
}

export type Topic = {
  name: string
  count?: number
}

export type List = {
  name: string
  naddr: string
  pubkey: string
  tags: string[][]
  updated_at: number
  created_at: number
  deleted_at?: number
}

export type Env = {
  IMGPROXY_URL: string
  DUFFLEPUD_URL: string
  MULTIPLEXTR_URL: string
  FORCE_RELAYS: string[]
  COUNT_RELAYS: string[]
  SEARCH_RELAYS: string[]
  DEFAULT_RELAYS: string[]
  ENABLE_ZAPS: boolean
  [key: string]: any
}

export type KeyState = {
  method: string
  pubkey: string
  privkey: string | null
  bunkerKey: string | null
}
