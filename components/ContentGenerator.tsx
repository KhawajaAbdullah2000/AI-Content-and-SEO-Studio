
import React, { useState, useCallback } from 'react';
import { generateContentForTopic } from '../services/geminiService';
import Spinner from './common/Spinner';
import Card from './common/Card';
import ReactMarkdown from 'react-markdown';

const ContentGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const content = await generateContentForTopic(topic);
      setGeneratedContent(content);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">AI Content Generator</h2>
          <p className="text-gray-400">
            Enter a topic or a keyword, and our AI will write a high-quality, SEO-friendly article for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'The Future of Renewable Energy'"
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : 'Generate Content'}
            </button>
          </div>
        </div>
      </Card>

      {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md">{error}</div>}

      {generatedContent && (
        <Card title="Generated Article">
          <pre className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed bg-gray-900 p-4 rounded-md border border-gray-700">
               <ReactMarkdown>{generatedContent}</ReactMarkdown>
          </pre>
        </Card>
      )}
    </div>
  );
};

export default ContentGenerator;
