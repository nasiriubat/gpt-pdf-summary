import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});

const FileUpload = () => {
  const [summary1, setSummary1] = useState('');
  const [summary2, setSummary2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        socket.emit('upload_pdf', reader.result);
        setLoading(true);
      };
    }
  };

  socket.on('summary1', (data) => {
    setSummary1(data);
    setLoading(false);
  });

  socket.on('summary2', (data) => {
    setSummary2(data);
  });

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <div className="chat-box">
        <div>
          <h2>Model 1 Summary:</h2>
          <p>{loading ? 'Loading...' : summary1}</p>
        </div>
        <div>
          <h2>Model 2 Summary:</h2>
          <p>{summary2}</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
