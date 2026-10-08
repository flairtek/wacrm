import { describe, it, expect } from 'vitest'
import {
  isUnsupportedMessageText,
  cleanUnsupportedMessageText,
  formatUnsupportedMessage,
  formatContactCardMessage,
  formatOrderMessage,
  formatSystemMessage,
} from './unsupported-message'

describe('unsupported-message utils', () => {
  describe('isUnsupportedMessageText', () => {
    it('returns true for legacy and current unsupported placeholders', () => {
      expect(isUnsupportedMessageText('[Unsupported message type: unsupported]')).toBe(true)
      expect(isUnsupportedMessageText('[Unsupported message type: poll]')).toBe(true)
      expect(isUnsupportedMessageText('[Unsupported message]')).toBe(true)
      expect(isUnsupportedMessageText('[Unsupported message: Polls are not supported]')).toBe(true)
      expect(isUnsupportedMessageText('[Unsupported message type]')).toBe(true)
      expect(isUnsupportedMessageText('[Tipo de mensaje no compatible]')).toBe(true)
      expect(isUnsupportedMessageText('[Tipo de mensagem não suportado]')).toBe(true)
      expect(isUnsupportedMessageText('[지원되지 않는 메시지 형식]')).toBe(true)
    })

    it('returns false for regular text and empty inputs', () => {
      expect(isUnsupportedMessageText(null)).toBe(false)
      expect(isUnsupportedMessageText(undefined)).toBe(false)
      expect(isUnsupportedMessageText('')).toBe(false)
      expect(isUnsupportedMessageText('Hello world')).toBe(false)
      expect(isUnsupportedMessageText('What is an unsupported message?')).toBe(false)
    })
  })

  describe('cleanUnsupportedMessageText', () => {
    it('cleans up legacy and redundant unsupported message strings', () => {
      expect(cleanUnsupportedMessageText('[Unsupported message type: unsupported]')).toBe('[Unsupported message]')
      expect(cleanUnsupportedMessageText('[Unsupported message type]')).toBe('[Unsupported message]')
      expect(cleanUnsupportedMessageText('[Unsupported message]')).toBe('[Unsupported message]')
    })

    it('preserves other messages untouched', () => {
      expect(cleanUnsupportedMessageText('Hello')).toBe('Hello')
      expect(cleanUnsupportedMessageText('[Unsupported message: Polls are not supported]')).toBe(
        '[Unsupported message: Polls are not supported]'
      )
      expect(cleanUnsupportedMessageText('')).toBe('')
      expect(cleanUnsupportedMessageText(null)).toBe('')
    })
  })

  describe('formatUnsupportedMessage', () => {
    it('formats type "unsupported" cleanly without redundancy', () => {
      expect(formatUnsupportedMessage('unsupported')).toBe('[Unsupported message]')
      expect(formatUnsupportedMessage('unsupported', 'Message type is not supported')).toBe('[Unsupported message]')
      expect(formatUnsupportedMessage(undefined)).toBe('[Unsupported message]')
    })

    it('includes specific details when provided', () => {
      expect(formatUnsupportedMessage('unsupported', 'Polls are not supported')).toBe(
        '[Unsupported message: Polls are not supported]'
      )
    })

    it('formats unknown types clearly', () => {
      expect(formatUnsupportedMessage('poll')).toBe('[Unsupported message: poll]')
      expect(formatUnsupportedMessage('payment')).toBe('[Unsupported message: payment]')
    })
  })

  describe('formatContactCardMessage', () => {
    it('formats contact cards with name, phone, email, and organization', () => {
      const result = formatContactCardMessage([
        {
          name: { formatted_name: 'Jane Doe' },
          org: { title: 'Sales Director', company: 'Acme Corp' },
          phones: [{ phone: '+1234567890', type: 'WORK' }],
          emails: [{ email: 'jane@acme.com', type: 'WORK' }],
          urls: [{ url: 'https://acme.com' }],
        },
      ])

      expect(result).toContain('📇 Jane Doe')
      expect(result).toContain('Sales Director at Acme Corp')
      expect(result).toContain('📞 +1234567890 (WORK)')
      expect(result).toContain('✉️ jane@acme.com (WORK)')
      expect(result).toContain('🌐 https://acme.com')
    })

    it('handles multiple contacts in one message', () => {
      const result = formatContactCardMessage([
        { name: { formatted_name: 'Alice' }, phones: [{ phone: '+111' }] },
        { name: { formatted_name: 'Bob' }, phones: [{ phone: '+222' }] },
      ])

      expect(result).toContain('📇 Alice')
      expect(result).toContain('📇 Bob')
      expect(result).toContain('+111')
      expect(result).toContain('+222')
    })

    it('falls back gracefully when contacts array is empty', () => {
      expect(formatContactCardMessage([])).toBe('📇 [Contact shared]')
      expect(formatContactCardMessage(undefined)).toBe('📇 [Contact shared]')
    })
  })

  describe('formatOrderMessage', () => {
    it('formats order with items and prices', () => {
      const result = formatOrderMessage({
        text: 'Please deliver ASAP',
        product_items: [
          { product_retailer_id: 'SKU-1', quantity: 2, item_price: 15.0, currency: 'USD' },
          { product_retailer_id: 'SKU-2', quantity: 1, item_price: 25.0, currency: 'USD' },
        ],
      })

      expect(result).toContain('🛒 [Order received]')
      expect(result).toContain('Please deliver ASAP')
      expect(result).toContain('• 2x SKU-1 (15 USD)')
      expect(result).toContain('• 1x SKU-2 (25 USD)')
    })

    it('falls back when order object is empty', () => {
      expect(formatOrderMessage(undefined)).toBe('🛒 [Order received]')
    })
  })

  describe('formatSystemMessage', () => {
    it('formats system notifications with body or phone change', () => {
      expect(formatSystemMessage({ body: 'Security code changed' })).toBe('ℹ️ Security code changed')
      expect(formatSystemMessage({ new_wa_id: '1234567890' })).toBe('ℹ️ User changed phone number to 1234567890')
      expect(formatSystemMessage(undefined)).toBe('ℹ️ [System notification]')
    })
  })
})
