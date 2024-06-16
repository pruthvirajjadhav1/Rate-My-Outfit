import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import AnalysisResults from './AnalysisResults';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (file) => {
    setImage(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setAnalysis(null);

    // Call your backend API to analyze the image
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://rate-my-outfit.onrender.com/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Error analyzing the image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Outfit Analyzer</h1>
      <ImageUpload onImageUpload={handleImageUpload} />
      {image && <img src={image} alt="Uploaded" className="uploaded-image" />}
      {loading && <p>Analyzing the image, please wait...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {analysis && <AnalysisResults analysis={analysis} />}
    </div>
  );
}

export default App;
