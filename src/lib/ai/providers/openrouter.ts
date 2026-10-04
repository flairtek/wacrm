import { AiError, type ProviderResult } from '../types'
import { MAX_OUTPUT_TOKENS } from '../defaults'
import {
  mergeConsecutive,
  normalizeUsage,
  providerHttpError,
  toNetworkError,
  type ProviderArgs,
} from './shared'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface OpenRouterResponse {
  choices?: {
    message?: {
      content?: string | { type?: string; text?: string }[]
      reasoning?: string
    }
    text?: string
    finish_reason?: string
  }[]
  error?: {
    message?: string
    code?: number | string
    metadata?: unknown
  } | string
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

/**
 * Call OpenRouter's Chat Completions endpoint with the caller's own key.
 * Returns the raw assistant text + token usage (handoff parsing happens
 * in `generateReply`).
 */
export async function generateOpenRouter(args: ProviderArgs): Promise<ProviderResult> {
  const { apiKey, model, systemPrompt, messages, timeoutMs } = args

  const formattedMessages: { role: string; content: string }[] = []
  if (systemPrompt && systemPrompt.trim()) {
    formattedMessages.push({ role: 'system', content: systemPrompt.trim() })
  }
  for (const m of mergeConsecutive(messages)) {
    if (m.content && m.content.trim()) {
      formattedMessages.push({ role: m.role, content: m.content })
    }
  }

  let res: Response
  try {
    res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://flairtek.com',
        'X-Title': 'Flairtek WACRM',
      },
      body: JSON.stringify({
        model: model.trim(),
        messages: formattedMessages,
        max_tokens: MAX_OUTPUT_TOKENS,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (err) {
    throw toNetworkError(err)
  }

  if (!res.ok) {
    throw await providerHttpError('OpenRouter', res)
  }

  const data = (await res.json().catch(() => null)) as OpenRouterResponse | null
  if (!data) {
    throw new AiError('OpenRouter returned an unparseable response.', {
      code: 'invalid_response',
    })
  }

  if (data.error) {
    const errorMsg =
      typeof data.error === 'string'
        ? data.error
        : data.error.message || JSON.stringify(data.error)
    throw new AiError(`OpenRouter: ${errorMsg}`, {
      code: 'provider_error',
    })
  }

  const choice = data.choices?.[0]
  let text = ''

  if (typeof choice?.message?.content === 'string') {
    text = choice.message.content
  } else if (Array.isArray(choice?.message?.content)) {
    text = choice.message.content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
  } else if (typeof choice?.text === 'string') {
    text = choice.text
  } else if (typeof choice?.message?.reasoning === 'string') {
    text = choice.message.reasoning
  }

  if (!text || !text.trim()) {
    const finishReason = choice?.finish_reason ? ` (finish_reason: ${choice.finish_reason})` : ''
    throw new AiError(`OpenRouter returned an empty response${finishReason}.`, {
      code: 'empty_response',
    })
  }

  const usage = normalizeUsage({
    prompt: data.usage?.prompt_tokens,
    completion: data.usage?.completion_tokens,
    total: data.usage?.total_tokens,
  })

  return { text: text.trim(), usage }
}
