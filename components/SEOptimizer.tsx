
import React, { useState, useCallback } from 'react';
import { getSeoAnalysis } from '../services/geminiService';
import { SEOAnalysis } from '../types';
import Spinner from './common/Spinner';
import Card from './common/Card';

const SEOptimizer: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!content.trim()) {
      setError('Please paste some content to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await getSeoAnalysis(content);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [content]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">SEO Content Optimizer</h2>
          <p className="text-gray-400">
            Paste your content below to get AI-powered SEO suggestions, including titles, meta descriptions, and keyword analysis.
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article content here..."
            className="w-full h-48 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : 'Analyze Content'}
          </button>
        </div>
      </Card>

      {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md">{error}</div>}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Suggested Titles" className="lg:col-span-2">
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                {analysis.suggestedTitles.map((title, index) => <li key={index}>{title}</li>)}
                </ul>
            </Card>

            <Card title="Meta Description">
                <p className="text-gray-300 italic">"{analysis.metaDescription}"</p>
            </Card>

            <Card title="Readability Analysis">
                <p className="text-2xl font-bold" style={{color: analysis.readabilityAnalysis.score === 'Good' ? '#4ade80' : '#f87171'}}>{analysis.readabilityAnalysis.score}</p>
                <p className="text-gray-300">{analysis.readabilityAnalysis.feedback}</p>
            </Card>
            
            <Card title="Primary Keywords">
                <div className="flex flex-wrap gap-2">
                {analysis.primaryKeywords.map((keyword, index) => (
                    <span key={index} className="bg-green-800 text-green-200 text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
                ))}
                </div>
            </Card>
            
            <Card title="Secondary Keywords">
                <div className="flex flex-wrap gap-2">
                {analysis.secondaryKeywords.map((keyword, index) => (
                    <span key={index} className="bg-purple-800 text-purple-200 text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
                ))}
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

export default SEOptimizer;
