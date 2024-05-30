import React, { useState, useEffect } from "react";
import Styles from '../../../Styles/Pages/Main/MainContent.module.scss';
import API from "../../../hooks/useApi";
import BuyButton from '../../BotaoComprar/BuyButton';
import LupaIcon from '../../../assets/icon_lupa.svg';
import IconDown from '../../../assets/icon_down.svg';
import CarrinhoIcon from '../../../assets/icon_bag.svg';
import Modal from './Modal/Modal';
import { ColorRing } from 'react-loader-spinner'

function MainContent() {
  const [produtos, setProdutos] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");
  const [numProdutosExibidos, setNumProdutosExibidos] = useState(4);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [contadorCliques, setContadorCliques] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtosNoCarrinho, setProdutosNoCarrinho] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const produtosData = await API.getProduto();
        setProdutos(produtosData);
        setCarregando(false);
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
    return `${price.toFixed(2)}`;
  };

  const mostrarMaisProdutos = () => {
    setNumProdutosExibidos(numProdutosExibidos + 5);
  };

  const adicionarAoCarrinho = (produto) => {
    setContadorCliques(contadorCliques + 1);
    if (produtosNoCarrinho[produto.id]) {
      setProdutosNoCarrinho({
        ...produtosNoCarrinho,
        [produto.id]: produtosNoCarrinho[produto.id] + 1
      });
    } else {
      setProdutosNoCarrinho({
        ...produtosNoCarrinho,
        [produto.id]: 1
      });
    }
  };

  const filtrarProdutos = (produto) => {
    return produto.nome.toLowerCase().includes(pesquisa.toLowerCase());
  };

  const produtosFiltrados = produtos.filter(filtrarProdutos);
  const naoHaProdutos = produtosFiltrados.length === 0;

  return (
    <main className={Styles.Main}>
      {carregando ? (
        <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#3889F2', '#076DF2', '#0554F2', '#3889F2', '#0554F2']}
        />
      ) : (
        <div className={Styles.Main__container}>
          <div className={Styles.Main__container__searchInput}>
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className={Styles.Main__container__searchInput__Styles}
            />
            <img className={Styles.Main__container__searchInput__lupaIcon} src={LupaIcon} alt="Icone de Lupa" />
          </div>
          <div className={Styles.Main__container__Wrapper}>
            {produtosFiltrados.length > 0 && (
              <p className={Styles.Main__container__richTextTitle}>Nossos produtos</p>
            )}
            {contadorCliques > 0 && (
              <div className={Styles.Main__container__Wrapper__carrinho} onClick={() => setModalAberto(true)}>
                <img src={CarrinhoIcon} alt="Ícone de Carrinho" />
                <p className={Styles.Main__container__Wrapper__contadorCliques}>{contadorCliques}</p>
              </div>
            )}
          </div>
          {produtosFiltrados.length === 0 && pesquisa.length > 0 && (
            <p className={Styles.Main__container__notProduct}>Nenhum produto encontrado com o termo de pesquisa "{pesquisa}".</p>
          )}
          <ul className={Styles.Main__container__ul}>
            {produtosFiltrados
              .slice(0, numProdutosExibidos)
              .map((produto) => (
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
                        {produto.categoria ? produto.categoria.nome : "Categoria não especificada"}
                      </p>
                    </div>
                    <div className={Styles.Main__container__productInfo__PriceQuantity}>
                      <p>
                        R$<span>{formatPrice(produto.preco)}</span>
                      </p>
                      <p
                        className={`ProductQuantity ${produto.quantidade < 5 ? "LowQuantity" : "HighQuantity"
                          }`}
                      >
                        Quantidade: <span className={Styles.spanQuantity}>{produto.quantidade}</span>
                      </p>
                    </div>
                  </div>
                  <BuyButton onClick={() => adicionarAoCarrinho(produto)} />
                </li>
              ))}
          </ul>
          {mensagemErro && <p className={Styles.Main__ErrorMessage}>{mensagemErro}</p>}
          {!naoHaProdutos && produtos.length > numProdutosExibidos && (
            <div className={Styles.Main__container__ShowMoreButton}>
              <button className={Styles.Main__container__ButtonStyle} onClick={mostrarMaisProdutos}>
                Mostrar Mais <img src={IconDown} alt="Ícone de seta para baixo" />
              </button>
            </div>
          )}
          {modalAberto && (
            <Modal
              produtosNoCarrinho={produtosNoCarrinho}
              onClose={() => setModalAberto(false)}
            />
          )}
        </div>
      )}
    </main>
  );
}

export default MainContent;
