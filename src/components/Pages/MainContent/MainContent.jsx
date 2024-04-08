import React, { useState, useEffect } from 'react';
import './MainContent.css';
import API from '../../../hooks/useApi';

function MainContent() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const produtosData = await API.getProduto();

        // Mapeia os produtos e faz uma nova solicitação para obter as imagens
        const produtosComImagens = await Promise.all(produtosData.map(async produto => {
          try {
            const imagemData = await API.fetchData(`/api/imagem/${produto.id}`, 'GET');
            // Verifica se existe uma imagem vinculada ao produto
            const idImagem = imagemData ? imagemData.id : null;
            // Adiciona o ID da imagem ao objeto do produto
            return { ...produto, idImagem: idImagem };
          } catch (error) {
            console.error(`Erro ao buscar imagem do produto ${produto.id}:`, error);
            return produto;
          }
        }));

        setProdutos(produtosComImagens);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="MainContent">
      <div className="ProductList">
        <ul className="ProductItems">
          {produtos.map(produto => (
            <li key={produto.id} className="ProductItem">
              {produto.idImagem && (
                <div className='ProductImagem'>
                  <img src={`http://45.235.53.125:8080/api/imagem/${produto.idImagem}`} alt="" className="ProductImage" />
                </div>
              )}
              <div className="ProductInfo">
                <div className='InfoNameCategory'>
                  <h3>{produto.nome}</h3>
                  <p className="ProductDetail">Categoria: {produto.categoria.nome}</p>
                </div>
                <div className='InfoPriceQuantity'>
                  <p className="ProductDetail"> <span>R$</span>{produto.preco}</p>
                  <p className="ProductDetail">Quantidade: {produto.quantidade}</p>
                </div>
                <div className='InfoDescription'>
                  <p className="ProductDetail">Descrição: {produto.descricao}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default MainContent;
