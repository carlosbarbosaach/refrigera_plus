import React, { useState, useEffect } from "react";
import Styles from '../../../Styles/Pages/Main/MainContent.module.scss';
import API from "../../../hooks/useApi";
import LupaIcon from '../../../assets/icon_lupa.svg';
import IconDown from '../../../assets/icon_down.svg';
import { ColorRing } from 'react-loader-spinner';
import ModalConfirmacao from '../MainContent/Modal/ModalConfirmacao';
import FiltroCategorias from '../../Filtros/FiltroCategorias';

function MainContent() {

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");
  const [numProdutosExibidos, setNumProdutosExibidos] = useState(4);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [produtoAExcluir, setProdutoAExcluir] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [produtosData, categoriasData] = await Promise.all([
          API.getProduto(),
          API.getCategoria()
        ]);

        const produtosWithQuantity = produtosData.map(produto => ({
          ...produto,
          quantidade: produto.quantidade || 0
        }));

        setProdutos(produtosWithQuantity);
        setCategorias(categoriasData);
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
      setMensagemErro("Erro ao enviar a quantidade atualizada. Por favor, tente novamente.");
    }
  };

  const confirmarDelecao = (produto) => {
    setProdutoAExcluir(produto);
  };

  const deletarProduto = async () => {
    if (!produtoAExcluir) return;

    try {
      const response = await fetch(`http://45.235.53.125:8080/api/produto/${produtoAExcluir.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao deletar o produto: ${errorData.message}`);
      }

      setProdutos(produtos.filter(produto => produto.id !== produtoAExcluir.id));
      setProdutoAExcluir(null);
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
      setMensagemErro("Erro ao deletar o produto. Por favor, tente novamente.");
    }
  };

  const mostrarMaisProdutos = () => {
    setNumProdutosExibidos(numProdutosExibidos + 5);
  };

  const incrementQuantity = async (id) => {
    const updatedProdutos = produtos.map(produto =>
      produto.id === id ? { ...produto, quantidade: produto.quantidade + 1 } : produto
    );
    setProdutos(updatedProdutos);
    const updatedProduto = updatedProdutos.find(produto => produto.id === id);
    await enviarQuantidadeAtualizada(updatedProduto);
  };

  const decrementQuantity = async (id) => {
    const updatedProdutos = produtos.map(produto =>
      produto.id === id && produto.quantidade > 0 ? { ...produto, quantidade: produto.quantidade - 1 } : produto
    );
    setProdutos(updatedProdutos);
    const updatedProduto = updatedProdutos.find(produto => produto.id === id);
    await enviarQuantidadeAtualizada(updatedProduto);
  };

  const handleCategoriaChange = (categoriaId) => {
    setCategoriaSelecionada(categoriaId);
  };

  const filtrarProdutos = (produto) => {
    return (
      produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) &&
      (categoriaSelecionada === null || produto.categoria?.id === categoriaSelecionada)
    );
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
          <div className={Styles.Main__container__SearchFilter}>
            <div className={Styles.Main__container__searchInput}>
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className={Styles.Main__container__searchInput__Styles}
              />
              <img className={Styles.Main__container__searchInput__lupaIcon} src={LupaIcon} alt="Ícone de Lupa" />
            </div>
            <FiltroCategorias
              className={Styles.Main__container__filtrocategoria}
              categorias={categorias}
              categoriaSelecionada={categoriaSelecionada}
              onCategoriaChange={handleCategoriaChange}
            />
          </div>
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
                      <h3>{produto.descricao}</h3>
                    </div>
                    <div className={Styles.Main__container__productInfo__PriceQuantity}>
                      <p
                        className={`ProductQuantity ${produto.quantidade < 5 ? "LowQuantity" : "HighQuantity"
                          }`}
                      >
                        Quantidade: <span className={Styles.spanQuantity}>{produto.quantidade}</span>
                      </p>
                      <div className={Styles.Main__container__buttonGroup}>
                        <div className={Styles.Main__container__buttonGroup__maismenos}>
                          <button
                            className={Styles.Main__container__buttonGroup__maisButton}
                            onClick={() => incrementQuantity(produto.id)}
                          >
                            +
                          </button>
                          <button
                            className={`${Styles.Main__container__buttonGroup__menosButton} ${produto.quantidade === 0 ? Styles.menosButtonDisabled : ''}`}
                            onClick={() => decrementQuantity(produto.id)}
                            disabled={produto.quantidade === 0}
                          >
                            -
                          </button>
                        </div>

                        <div className={Styles.Main__container__buttonGroup__excluir}>
                          <button
                            className={Styles.Main__container__buttonGroup__excluirButton}
                            onClick={() => confirmarDelecao(produto)}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          {!naoHaProdutos && produtos.length > numProdutosExibidos && (
            <div className={Styles.Main__container__ShowMoreButton}>
              <button className={Styles.Main__container__ButtonStyle} onClick={mostrarMaisProdutos}>
                Mostrar Mais <img src={IconDown} alt="Ícone de seta para baixo" />
              </button>
            </div>
          )}
        </div>
      )}
      <ModalConfirmacao
        produto={produtoAExcluir}
        onConfirm={deletarProduto}
        onCancel={() => setProdutoAExcluir(null)}
      />
    </main>
  );
}

export default MainContent;