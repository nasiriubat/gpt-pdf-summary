import { HfInference } from '@huggingface/inference'
import dotenv from 'dotenv'
dotenv.config()

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const hface_summarize = async (text) => {
    try {
        const response = await hf.summarization({
            model: 'facebook/bart-large-cnn',
            inputs: text,
            parameters: {
                max_length: 100
            }
        })
        return response
    } catch (error) {
        console.error('Hugging Face Error:', error)
        throw new Error('Hugging Face summarization failed')
    }
}

export default hface_summarize