import React, { useState } from 'react';
import { analyzeData } from './services/ApiService';

function App() {
    const [data, setData] = useState([]);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyze = async () => {
        try {
            const result = await analyzeData(data);
            setAnalysisResult(result);
        } catch (error) {
            console.error("Failed to analyze data", error);
        }
    };

    return (
        <div>
            <h1>LLMS Classroom</h1>
            {/* Add form to input data */}
            <button onClick={handleAnalyze}>Analyze Data</button>
            {analysisResult && <pre>{JSON.stringify(analysisResult, null, 2)}</pre>}
        </div>
    );
}

export default App;
