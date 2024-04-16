import React, { useState, useEffect } from "react";
import Styles from '../../../Styles/Pages/Main/MainContent.module.scss'
import API from "../../../hooks/useApi";
import BuyButton from '../../BotaoComprar/BuyButton'

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
    <main className={Styles.Main}>
      {carregando ? ( // Renderiza uma mensagem de carregamento enquanto os produtos estão sendo buscados
        <p>Carregando...</p>
      ) : (
        <div className={Styles.Main__container}>
          <p className={Styles.Main__container__richTextTitle}>Nossos produtos</p>
          <ul className={Styles.Main__container__ul}>
            {produtos.slice(0, numProdutosExibidos).map((produto) => (
              <li key={produto.id} className={Styles.Main__container__ul__li}>
                {produto.idImagem && (
                  <div className={Styles.Main__container__imagem}>
                    <img src={`http://45.235.53.125:8080/api/imagem/${produto.idImagem}`} alt="Imagem do produto" />
                  </div>
                )}
                <div className={Styles.Main__container__productInfo}>
                  <div className={Styles.Main__container__productInfo__NameCategory}>
                    <h3>{produto.nome}</h3>
                    <p>
                      {" "}
                      {produto.categoria
                        ? produto.categoria.nome
                        : "Categoria não especificada"}
                    </p>
                  </div>
                  <div className={Styles.Main__container__productInfo__PriceQuantity}>
                    <p>
                      <span>{formatPrice(produto.preco)}</span>
                    </p>
                    <p
                      className={`ProductQuantity ${produto.quantidade < 5 ? "LowQuantity" : "HighQuantity"
                        }`}
                    >
                      Quantidade: {produto.quantidade}
                    </p>
                  </div>
                </div>
                <BuyButton />
              </li>
            ))}
          </ul>
          {mensagemErro && <p className={Styles.Main__ErrorMessage}>{mensagemErro}</p>}
          {produtos.length > numProdutosExibidos && (
            <div className={Styles.Main__container__ShowMoreButton}>
              <button className={Styles.Main__container__ButtonStyle} onClick={mostrarMaisProdutos}>
                Mostrar Mais
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default MainContent;
