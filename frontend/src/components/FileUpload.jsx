import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://llm-pdf-summary.onrender.com', {
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
    setSummary1(data.summary_text);
    setLoading(false);
  });

  socket.on('summary2', (data) => {
    setSummary2(data);
  });

  const copySummaryOne = () => {
    const summaryText = document.querySelector('.summary1').innerText;
    navigator.clipboard.writeText(summaryText);
  };
  const copySummaryTwo = () => {
    const summaryText = document.querySelector('.summary1').innerText;
    navigator.clipboard.writeText(summaryText);
  };

  return (
    <div>
      <div className="input">
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      </div>
      <div className="chat-box">
        <div>
          <h2>Model 1 Summary: <span className='model-name'>(facebook/bart-large-cnn)</span> <img className='copyicon' onClick={copySummaryOne} src="./copy.png" alt="copy" /></h2>
          
          {loading ?  <div className="parentloader"><div className="loader"></div>
            <p>Generating Summary...</p></div> : <p className='summary1'> {summary1}</p>}
        </div>
        <div>
          <h2>Model 2 Summary: <span className='model-name'>(gemini-1.5-flash)</span> <img className='copyicon' onClick={copySummaryTwo} src="./copy.png" alt="copy" /></h2>

          {loading ?  <div className="parentloader"><div className="loader"></div>
            <p>Generating Summary...</p></div> : <p className='summary2'>{summary2}</p>}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
