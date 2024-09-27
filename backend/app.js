import express from 'express';
import http from 'http'; 
import {Server } from 'socket.io';
import cors from 'cors';
import PdfParse from 'pdf-parse/lib/pdf-parse.js';
import multer from 'multer';
// import openai_summarize from './openai.js';
import hface_summarize from './hface.js';
import gemini_summarize from './gemini.js';


const app = express();
const server = http.createServer(app);
// const io = new Server (server); 
const io = new Server(server, {
  cors: {
    origin: 'https://gpt-pdf-summary-frontend.onrender.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Access-Control-Allow-Origin: gpt-pdf-summary-frontend.onrender.com'],
  },
});


const upload = multer(); 

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('upload_pdf', async (fileBuffer) => {
    try {
     
      const pdfText = await PdfParse(fileBuffer).then(data => data.text);
      
     
      const [summary1, summary2] = await Promise.all([
        // openai_summarize(pdfText),
        hface_summarize(pdfText),
        gemini_summarize(pdfText),
      ]);
      // console.log('Summaries:', summary1, summary2);
      socket.emit('summary1', summary1);
      socket.emit('summary2', summary2);
    } catch (error) {
      console.error('Error processing PDF:', error.message); 
      socket.emit('error', 'Error processing the PDF file');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
