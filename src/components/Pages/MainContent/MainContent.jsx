import { useState, useEffect } from "react";
import "./MainContent.css";
import API from "../../../hooks/useApi";
import BuyButton from "../../BotaoComprar/BuyButton";

function MainContent() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const produtosData = await API.getProduto();
        console.log("Dados dos produtos:", produtosData);
        setProdutos(produtosData);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setMensagemErro(
          "Erro ao buscar dados da API. Por favor, tente novamente mais tarde."
        );
      }
    }

    fetchData();
  }, []);

  const handleBuyButtonClick = (produtoId) => {
    const produtoExistente = carrinho.find((item) => item.id === produtoId);
    const produto = produtos.find((p) => p.id === produtoId);

    if (produtoExistente) {
      if (produtoExistente.quantidade + 1 <= 10) {
        const novoCarrinho = carrinho.map((item) =>
          item.id === produtoId
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
        setCarrinho(novoCarrinho);
        setMensagemErro("");
      } else {
        setMensagemErro(
          "Você não pode comprar mais de 10 unidades deste produto."
        );
      }
    } else {
      if (produto) {
        setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
        setMensagemErro("");
      }
    }
  };

  return (
    <main className="MainContent">
      <div className="ProductList">
        <ul className="ProductItems">
          {produtos.map((produto) => (
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
                    {" "}
                    <span>R$ </span>
                    {produto.preco}
                  </p>
                  <p
                    className={`ProductQuantity ${
                      produto.quantidade < 10 ? "LowQuantity" : "HighQuantity"
                    }`}
                  >
                    Quantidade: {produto.quantidade}
                  </p>
                </div>
                <div className="InfoDescription">
                  <p className="ProductDetail">{produto.descricao}</p>
                  <BuyButton onClick={() => handleBuyButtonClick(produto.id)} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        {mensagemErro && <p className="ErrorMessage">{mensagemErro}</p>}
        <div className="Carrinho">
          <h2>Carrinho</h2>
          <ul>
            {carrinho.map((item) => (
              <li key={item.id}>
                {item.nome} - Quantidade: {item.quantidade}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default MainContent;
