import http from 'http';
import { expect } from 'chai';
import { Server } from 'socket.io';
import express from 'express';
import io from 'socket.io-client'; // Import socket.io-client

const app = express();

describe('PDF Summarizer API', () => {
  let server;
  let sio;
  let clientSocket;

  before((done) => {
    server = http.createServer(app);
    sio = new Server(server);

    server.listen(5001, () => {
      console.log('Test server running on port 5001');
      clientSocket = io('http://localhost:5001'); // Use imported socketClient
      clientSocket.on('connect', () => {
        console.log('Client connected');
        done(); // Call done when connected
      });
    });
  });

  after((done) => {
    clientSocket.close();
    sio.close();
    server.close(done);
  });

  describe('Socket.IO Events', () => {
    it('should summarize PDF content with both models', function (done) {
      this.timeout(10000); // Increase timeout to 10000ms

      const mockPdfBuffer = Buffer.from('Mock PDF content for testing.');

      let receivedSummary1 = false;
      let receivedSummary2 = false;

      clientSocket.emit('upload_pdf', mockPdfBuffer);

      clientSocket.on('summary1', (summary1) => {
        console.log('Received summary1:', summary1); // Debug log
        expect(summary1).to.exist; // Replace with specific assertions
        receivedSummary1 = true; // Flag that summary1 was received
      });

      clientSocket.on('summary2', (summary2) => {
        console.log('Received summary2:', summary2); // Debug log
        expect(summary2).to.exist; // Replace with specific assertions
        receivedSummary2 = true; // Flag that summary2 was received
      });

      // Check if both summaries are received
      const checkCompletion = setInterval(() => {
        if (receivedSummary1 && receivedSummary2) {
          clearInterval(checkCompletion);
          clientSocket.emit('disconnect');
          done();
        }
      }, 100); // Check every 100ms

      // Set a timeout to ensure the test fails if not completed
      setTimeout(() => {
        if (!receivedSummary1 || !receivedSummary2) {
          clearInterval(checkCompletion);
          clientSocket.emit('disconnect');
          done(new Error('Test timed out waiting for summaries.'));
        }
      }, 10000); // 10 seconds timeout
    });

    it('should handle errors when processing PDF', function (done) {
      this.timeout(10000); // Increase timeout to 10000ms

      clientSocket.emit('upload_pdf', null);

      clientSocket.on('error', (error) => {
        console.log('Error received:', error); // Debug log
        expect(error).to.equal('Error processing the PDF file');
        done();
      });
    });
  });
});
