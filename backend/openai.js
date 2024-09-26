
import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


 const openai_summarize = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: `Summarize the following text:\n\n${text}`
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new Error('OpenAI summarization failed');
  }
};

export default openai_summarize;


