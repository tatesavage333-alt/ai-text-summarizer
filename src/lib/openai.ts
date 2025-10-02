import OpenAI from 'openai'
import { SummaryStyle } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SUMMARY_PROMPTS = {
  concise: `Please provide a concise summary of the following text. Keep it brief and to the point, highlighting only the most important information:`,
  detailed: `Please provide a detailed summary of the following text. Include key points, important details, and context while maintaining clarity:`,
  'bullet-points': `Please provide a summary of the following text in bullet point format. Organize the information into clear, digestible bullet points:`
}

export async function generateSummary(
  text: string,
  style: SummaryStyle = 'concise'
): Promise<string> {
  try {
    if (!text.trim()) {
      throw new Error('Text cannot be empty')
    }

    if (text.length > 10000) {
      throw new Error('Text is too long. Please limit to 10,000 characters.')
    }

    const prompt = SUMMARY_PROMPTS[style]
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates high-quality summaries of text content.'
        },
        {
          role: 'user',
          content: `${prompt}\n\n${text}`
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    })

    const summary = completion.choices[0]?.message?.content?.trim()
    
    if (!summary) {
      throw new Error('Failed to generate summary')
    }

    return summary
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    if (error instanceof Error) {
      throw new Error(`Summary generation failed: ${error.message}`)
    }
    
    throw new Error('Summary generation failed: Unknown error')
  }
}
