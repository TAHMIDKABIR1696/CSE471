import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT || 5000),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-5.2'
}
