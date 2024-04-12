import React, { useState, useEffect } from 'react';
import './GestaoContent.css';
import bannerImage from '../../../assets/banner-analise.png'; // Importe a imagem do seu banner

function GestaoContent() {
  const [products, setProducts] = useState([]);
  const [lowStockPercentage, setLowStockPercentage] = useState(0);
  const [highStockPercentage, setHighStockPercentage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [showDataAnalysis, setShowDataAnalysis] = useState(false); // Estado para controlar a visibilidade da tela de análise de dados
  const [showPromotionsAnalysis, setShowPromotionsAnalysis] = useState(false); // Estado para controlar a visibilidade da tela de análise de promoções e descontos
  const [showFinancialAnalysis, setShowFinancialAnalysis] = useState(false); // Estado para controlar a visibilidade da tela de análise financeira e contabilidade

  useEffect(() => {
    if (showDataAnalysis || showPromotionsAnalysis || showFinancialAnalysis) {
      fetchProducts();
    }
  }, [showDataAnalysis, showPromotionsAnalysis, showFinancialAnalysis]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://45.235.53.125:8080/api/produto');
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da API');
      }
      const data = await response.json();
      setProducts(data);

      const lowStockProducts = data.filter(product => product.quantidade <= 10);
      const highStockProducts = data.filter(product => product.quantidade > 50);
      const totalProducts = data.length;

      const lowStockPercentage = (lowStockProducts.length / totalProducts) * 100;
      const highStockPercentage = (highStockProducts.length / totalProducts) * 100;

      setLowStockPercentage(lowStockPercentage);
      setHighStockPercentage(highStockPercentage);

      const total = data.reduce((accumulator, product) => accumulator + product.preco, 0);
      setTotalPrice(total);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao carregar os dados. Por favor, tente novamente mais tarde.');
    }
  };

  const getProgressBarColor = (percentage) => {
    if (percentage < 30) {
      return 'green';
    } else if (percentage < 70) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  const handleDataAnalysisClick = () => {
    setShowDataAnalysis(true);
    setShowPromotionsAnalysis(false);
    setShowFinancialAnalysis(false);
  };

  const handlePromotionsClick = () => {
    setShowPromotionsAnalysis(true);
    setShowDataAnalysis(false);
    setShowFinancialAnalysis(false);
  };

  const handleFinancialClick = () => {
    setShowFinancialAnalysis(true);
    setShowDataAnalysis(false);
    setShowPromotionsAnalysis(false);
  };

  return (
    <>
      <main className='GestaoContent'>
        <div className="banner-container">
          <img src={bannerImage} alt="Banner" className="banner-image" />
        </div>
        <h2>Página de Gestão</h2>
        <div className='GestaoContainer'>
          <div className='GestaoBox'>
            {/* Adicione eventos onClick para alterar os estados */}
            <a href="#" onClick={handleDataAnalysisClick}>Análise de Dados e Relatórios</a>
            <a href="#" onClick={handlePromotionsClick}>Gestão de Promoções e Descontos</a>
            <a href="#" onClick={handleFinancialClick}>Gestão Financeira e Contabilidade</a>
          </div>
        </div>
        <div className='containerAnalise'>
          {showDataAnalysis && (
            <div className='contentAnalise'>
              <h2>Análise de Dados e Relatórios</h2>
              <div>
                <p>Total de produtos cadastrados: {products.length}</p>
                <p>Produtos com alto estoque:</p>
                <div className="progress-bar" style={{ width: '300px' }}>
                  <div className="progress" style={{ width: `${highStockPercentage}%`, backgroundColor: getProgressBarColor(highStockPercentage) }}>{highStockPercentage.toFixed(2)}%</div>
                </div>
                <br />
                <p>Produtos com baixo estoque:</p>
                <div className="progress-bar" style={{ width: '300px' }}>
                  <div className="progress" style={{ width: `${lowStockPercentage}%`, backgroundColor: getProgressBarColor(lowStockPercentage) }}>{lowStockPercentage.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          )}
          {showPromotionsAnalysis && (
            <div className='contentAnalise'>
              <h2>Gestão de Promoções e Descontos</h2>
              <p>No momento não há promoções ou descontos disponíveis.</p>
            </div>
          )}
          {showFinancialAnalysis && (
            <div className='contentAnalise'>
              <h2>Gestão Financeira e Contabilidade</h2>
              <p>Aqui você pode visualizar e analisar dados financeiros e contábeis.</p>
              {/* Adicione outras informações relacionadas à gestão financeira e contabilidade */}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default GestaoContent;
