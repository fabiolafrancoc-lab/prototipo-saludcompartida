// src/pages/Blog.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articles } from '../data.js/articles.js/index.js';
import ArticleCard from '../components/blog/ArticleCard';
import ArticleModal from '../components/blog/ArticleModal';
import VotingSection from '../components/blog/VotingSection';

export default function Blog() {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showVoting, setShowVoting] = useState(false);

  // Determine which dashboard to return to based on user's access code
  const [returnPath, setReturnPath] = useState('/page4');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('accessUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.accessCode === 'USA2025') {
          setReturnPath('/migrant');
        } else {
          setReturnPath('/page4');
        }
      }
    } catch (e) {
      setReturnPath('/page4');
    }
  }, []);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img 
            src="/saludcompartida logo WT.png" 
            alt="SaludCompartida" 
            className="h-16"
          />
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate(returnPath);
            }}
            className="text-gray-600 hover:text-gray-900 font-medium text-lg transition-colors"
          >
            Volver
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Blog de SaludCompartida
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Contenido valioso para tu bienestar y el de tu familia
          </p>
        </div>

        {/* Grid de Artículos (2 columnas) */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => handleArticleClick(article)}
            />
          ))}
        </div>

        {/* Sección de Votación */}
        <VotingSection />
      </div>

      {/* Modal de Artículo Completo */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={handleCloseArticle}
        />
      )}
    </div>
  );
}