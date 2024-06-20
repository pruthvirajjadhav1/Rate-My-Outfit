import React from 'react';
import './AnalysisResults.css';

const AnalysisResults = ({ analysis }) => {
  return (
    <div className="analysis-results">
      <h2>Analysis Results</h2>
      <p><strong>Rating:</strong> {analysis.rating}</p>
      <p><strong>Comments:</strong> {analysis.comments}</p>
      <p><strong>Suggestions:</strong> {analysis.suggestions}</p>
    </div>
  );
};

export default AnalysisResults;
