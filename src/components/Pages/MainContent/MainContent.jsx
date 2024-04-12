import React, { useState, useEffect } from "react";
import "./MainContent.css";
import API from "../../../hooks/useApi";

function MainContent() {
  const [produtos, setProdutos] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");
  const [numProdutosExibidos, setNumProdutosExibidos] = useState(4);
  const [carregando, setCarregando] = useState(true); // Estado para controlar o carregamento dos produtos

  useEffect(() => {
    async function fetchData() {
      try {
        const produtosData = await API.getProduto();
        setProdutos(produtosData);
        setCarregando(false); // Altera o estado de carregamento após receber os dados
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setMensagemErro(
          "Erro ao buscar dados da API. Por favor, tente novamente mais tarde."
        );
      }
    }
    fetchData();
  }, []);

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const mostrarMaisProdutos = () => {
    setNumProdutosExibidos(numProdutosExibidos + 5);
  };

  return (
    <main className="MainContent">
      {carregando ? ( // Renderiza uma mensagem de carregamento enquanto os produtos estão sendo buscados
        <p>Carregando...</p>
      ) : (
        <div className="ProductList">
          <ul className="ProductItems">
            {produtos.slice(0, numProdutosExibidos).map((produto) => (
              <li key={produto.id} className="ProductItem">
                {produto.idImagem && (
                  <div className='ProductImagem'>
                    <img src={`http://45.235.53.125:8080/api/imagem/${produto.idImagem}`} alt="" className="ProductImage" />
                  </div>
                )}
                <div className="ProductInfo">
                  <div className="InfoNameCategory">
                    <h3>{produto.nome}</h3>
                    <p className="ProductDetail">
                      Categoria:{" "}
                      {produto.categoria
                        ? produto.categoria.nome
                        : "Categoria não especificada"}
                    </p>
                  </div>
                  <div className="InfoPriceQuantity">
                    <p className="ProductDetail">
                      {formatPrice(produto.preco)}
                    </p>
                    <p
                      className={`ProductQuantity ${produto.quantidade < 5 ? "LowQuantity" : "HighQuantity"
                        }`}
                    >
                      Quantidade: {produto.quantidade}
                    </p>
                  </div>
                  <div className="InfoDescription">
                    <p className="ProductDetail">{produto.descricao}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {mensagemErro && <p className="ErrorMessage">{mensagemErro}</p>}
          {produtos.length > numProdutosExibidos && (
            <button className="ShowMoreButton" onClick={mostrarMaisProdutos}>
              Mostrar Mais
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default MainContent;
