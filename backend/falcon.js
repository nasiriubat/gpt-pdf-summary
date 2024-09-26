import {pipeline} from '@xenova/transformers';
const pipe = await pipeline("summarization", "falconsai/falcon-t5-small-summarization", {device: 0});

const falcon_summarize = async (text) => {
  try {
    const response = await pipe(text);
    console.log('FalconsAI response:', response);
    return response;
  } catch (error) {
    console.error('FalconsAI Error:', error);
    throw new Error('FalconsAI summarization failed');
  }
};

export default falcon_summarize;
