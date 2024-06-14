import React, { useState, useEffect } from "react";
import Styles from '../../../Styles/Pages/Main/MainContent.module.scss';
import API from "../../../hooks/useApi";
import LupaIcon from '../../../assets/icon_lupa.svg';
import IconDown from '../../../assets/icon_down.svg';
import { ColorRing } from 'react-loader-spinner';

function MainContent() {
  const [produtos, setProdutos] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");
  const [numProdutosExibidos, setNumProdutosExibidos] = useState(4);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const produtosData = await API.getProduto();
        const produtosWithQuantity = produtosData.map(produto => ({ ...produto, quantidade: produto.quantidade || 0 }));
        setProdutos(produtosWithQuantity);
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

  const enviarQuantidadeAtualizada = async (produto) => {
    try {
      const response = await fetch(`http://45.235.53.125:8080/api/produto/${produto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantidade: produto.quantidade
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na atualização do produto: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao enviar a quantidade atualizada:", error);
      setMensagemErro("Erro ao atualizar a quantidade do produto. Por favor, tente novamente.");
    }
  };

  const deletarProduto = async (id) => {
    try {
      const response = await fetch(`http://45.235.53.125:8080/api/produto/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao deletar o produto: ${errorData.message}`);
      }

      setProdutos(produtos.filter(produto => produto.id !== id));
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
      setMensagemErro("Erro ao deletar o produto. Por favor, tente novamente.");
    }
  };

  const mostrarMaisProdutos = () => {
    setNumProdutosExibidos(numProdutosExibidos + 5);
  };

  const incrementQuantity = (id) => {
    const updatedProdutos = produtos.map(produto =>
      produto.id === id ? { ...produto, quantidade: produto.quantidade + 1 } : produto
    );
    setProdutos(updatedProdutos);
    const updatedProduto = updatedProdutos.find(produto => produto.id === id);
    enviarQuantidadeAtualizada(updatedProduto);
  };

  const decrementQuantity = (id) => {
    const updatedProdutos = produtos.map(produto =>
      produto.id === id && produto.quantidade > 0 ? { ...produto, quantidade: produto.quantidade - 1 } : produto
    );
    setProdutos(updatedProdutos);
    const updatedProduto = updatedProdutos.find(produto => produto.id === id);
    enviarQuantidadeAtualizada(updatedProduto);
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
                      <h3>{produto.descricao}</h3>
                      <p>
                        {produto.categoria ? produto.categoria.nome : "Categoria não especificada"}
                      </p>
                    </div>
                    <div className={Styles.Main__container__productInfo__PriceQuantity}>
                      <p
                        className={`ProductQuantity ${produto.quantidade < 5 ? "LowQuantity" : "HighQuantity"
                          }`}
                      >
                        Quantidade: <span className={Styles.spanQuantity}>{produto.quantidade}</span>
                      </p>
                      <div className={Styles.Main__container__buttonGroup}>
                        <button
                          className={Styles.Main__container__button}
                          onClick={() => incrementQuantity(produto.id)}
                        >
                          +
                        </button>
                        <button
                          className={Styles.Main__container__button}
                          onClick={() => decrementQuantity(produto.id)}
                        >
                          -
                        </button>
                        <button
                          className={Styles.Main__container__button}
                          onClick={() => deletarProduto(produto.id)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
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
        </div>
      )}
    </main>
  );
}

export default MainContent;
