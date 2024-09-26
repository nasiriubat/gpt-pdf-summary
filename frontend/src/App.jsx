import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <FileUpload />
      </main>
      <Footer />
    </div>
  );
}

export default App;
