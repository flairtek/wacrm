export interface WhatsAppContactCard {
  name?: {
    formatted_name?: string
    first_name?: string
    last_name?: string
    middle_name?: string
    suffix?: string
    prefix?: string
  }
  phones?: Array<{
    phone?: string
    type?: string
    wa_id?: string
  }>
  emails?: Array<{
    email?: string
    type?: string
  }>
  addresses?: Array<{
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
    country_code?: string
    type?: string
  }>
  org?: {
    company?: string
    department?: string
    title?: string
  }
  urls?: Array<{
    url?: string
    type?: string
  }>
}

export interface WhatsAppOrder {
  catalog_id?: string
  text?: string
  product_items?: Array<{
    product_retailer_id?: string
    quantity?: string | number
    item_price?: string | number
    currency?: string
  }>
}

export interface WhatsAppSystem {
  body?: string
  new_wa_id?: string
  type?: string
}

/**
 * Checks whether a message's content_text represents an unsupported message placeholder
 * (either newly received or legacy rows from earlier webhook versions).
 */
export function isUnsupportedMessageText(text: string | null | undefined): boolean {
  if (!text) return false
  const trimmed = text.trim()
  return (
    trimmed.startsWith('[Unsupported message') ||
    trimmed.startsWith('[Tipo de mensaje no') ||
    trimmed.startsWith('[Mensaje no compatible') ||
    trimmed.startsWith('[Tipo de mensagem não') ||
    trimmed.startsWith('[Mensagem não suportada') ||
    trimmed.startsWith('[지원되지 않는')
  )
}

/**
 * Normalizes legacy or redundant unsupported message strings (such as "[Unsupported message type: unsupported]")
 * into a clean standard string "[Unsupported message]".
 */
export function cleanUnsupportedMessageText(text: string | null | undefined): string {
  if (!text) return ''
  const trimmed = text.trim()
  if (
    trimmed === '[Unsupported message type: unsupported]' ||
    trimmed === '[Unsupported message type]'
  ) {
    return '[Unsupported message]'
  }
  return text
}
export function formatUnsupportedMessage(
  type?: string,
  details?: string | null
): string {
  if (!type || type === 'unsupported') {
    if (details && details !== 'Message type is not supported') {
      return `[Unsupported message: ${details}]`
    }
    return '[Unsupported message]'
  }
  return `[Unsupported message: ${type}]`
}

/**
 * Formats incoming WhatsApp vCard / contact card payloads into legible text.
 */
export function formatContactCardMessage(
  contacts?: WhatsAppContactCard[]
): string {
  if (!contacts || contacts.length === 0) {
    return '📇 [Contact shared]'
  }

  const formatted = contacts.map((c) => {
    const name =
      c.name?.formatted_name ||
      [c.name?.first_name, c.name?.last_name].filter(Boolean).join(' ') ||
      'Contact'
    const lines: string[] = [`📇 ${name}`]

    if (c.org?.title || c.org?.company) {
      lines.push([c.org.title, c.org.company].filter(Boolean).join(' at '))
    }

    if (c.phones && c.phones.length > 0) {
      for (const p of c.phones) {
        if (p.phone) {
          lines.push(`📞 ${p.phone}${p.type ? ` (${p.type})` : ''}`)
        }
      }
    }

    if (c.emails && c.emails.length > 0) {
      for (const e of c.emails) {
        if (e.email) {
          lines.push(`✉️ ${e.email}${e.type ? ` (${e.type})` : ''}`)
        }
      }
    }

    if (c.urls && c.urls.length > 0) {
      for (const u of c.urls) {
        if (u.url) {
          lines.push(`🌐 ${u.url}`)
        }
      }
    }

    return lines.join('\n')
  })

  return formatted.join('\n\n')
}

/**
 * Formats incoming WhatsApp order / cart messages into legible text.
 */
export function formatOrderMessage(order?: WhatsAppOrder): string {
  if (!order) {
    return '🛒 [Order received]'
  }

  const lines: string[] = ['🛒 [Order received]']
  if (order.text) {
    lines.push(order.text)
  }

  if (order.product_items && order.product_items.length > 0) {
    for (const item of order.product_items) {
      const qty = item.quantity ? `${item.quantity}x ` : ''
      const price = item.item_price !== undefined
        ? ` (${item.item_price}${item.currency ? ` ${item.currency}` : ''})`
        : ''
      lines.push(`• ${qty}${item.product_retailer_id || 'Item'}${price}`)
    }
  }

  return lines.join('\n')
}

/**
 * Formats WhatsApp system events into legible text.
 */
export function formatSystemMessage(system?: WhatsAppSystem): string {
  if (!system) {
    return 'ℹ️ [System notification]'
  }
  const body =
    system.body ||
    (system.new_wa_id
      ? `User changed phone number to ${system.new_wa_id}`
      : '[System notification]')
  return `ℹ️ ${body}`
}
