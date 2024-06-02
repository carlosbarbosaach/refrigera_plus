import React, { useState, useEffect } from 'react';
import Styles from '../../../Styles/Pages/Estoque/EstoqueContent.module.scss';
import GetEstoque from "./GetEstoque";
import { FaArrowUp } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

function EstoqueContent() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [imagem, setImagem] = useState(null);
  const [idProduto, setIdProduto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://45.235.53.125:8080/api/categoria');
        if (!response.ok) {
          throw new Error('Erro ao obter categorias: ' + response.statusText);
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao obter categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'categoriaId':
        setCategoriaId(value);
        break;
      case 'descricao':
        setDescricao(value);
        break;
      case 'nome':
        setNome(value);
        break;
      case 'preco':
        setPreco(value);
        break;
      case 'quantidade':
        setQuantidade(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (event) => {
    setImagem(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const idImagem = await cadastrarImagem();
      const idProdutoResponse = await cadastrarProduto(idImagem);

      await atualizarProdutoComImagem(idImagem, idProdutoResponse);

      console.log('Produto cadastrado com sucesso e imagem associada.');
      setShowModal(false); // Fechar o modal após o cadastro do produto
      toast.success('Produto cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  const cadastrarImagem = async () => {
    try {
      const imagemData = new FormData();
      imagemData.append('imagem', imagem);

      const response = await fetch('http://45.235.53.125:8080/api/imagem', {
        method: 'POST',
        body: imagemData
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar imagem: ' + response.statusText);
      }

      const imageData = await response.json();
      const idImagem = imageData.id;
      console.log('Imagem cadastrada com sucesso. ID:', idImagem);
      return idImagem; // Retorna o ID da imagem
    } catch (error) {
      console.error('Erro ao cadastrar imagem:', error);
      throw error;
    }
  };

  const cadastrarProduto = async (idImagem) => {
    try {
      const produtoData = {
        categoria: { id: categoriaId },
        descricao,
        nome,
        preco,
        quantidade,
        idImagem // ID da imagem cadastrada
      };

      const response = await fetch('http://45.235.53.125:8080/api/produto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(produtoData)
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar produto: ' + response.statusText);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const produtoDataResponse = await response.json();
        const idProdutoResponse = produtoDataResponse.id;
        setIdProduto(idProdutoResponse);
        return idProdutoResponse;
      } else {
        const text = await response.text();
        console.log('Resposta do servidor:', text);
        return null;
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      throw error;
    }
  };

  const atualizarProdutoComImagem = async (idImagem, idProdutoResponse) => {
    try {
      const url = `http://45.235.53.125:8080/api/produto/addImagem?imagem=${idImagem}&produto=${idProdutoResponse}`;

      const response = await fetch(url, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto com imagem: ' + response.statusText);
      }

      console.log('Produto atualizado com imagem com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar produto com imagem:', error);
      throw error;
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToastClose = () => {
    setShowToast(false);
    window.location.reload();
  };

  return (
    <>
      <div className={Styles.EstoqueMain}>
        <button className={Styles.Estoque__add_button} onClick={openModal}>
          Adicionar Novo Produto
        </button>
        <GetEstoque />
        {showModal && (
          <div className={Styles.Modal} onClick={closeModal}>
            <div className={Styles.Modal__content} onClick={(e) => e.stopPropagation()}>
              <button className={Styles.Modal__close} onClick={closeModal}>X</button>
              <form className={Styles.Modal__content__form} onSubmit={handleSubmit}>
                <div className={Styles.Modal__content__formGroup}>
                  <h2 className={Styles.Modal__content__title}>Adicionar Novo Produto</h2>
                  <label className={Styles.Modal__content__label} htmlFor="nome">
                    Nome:
                    <input
                      className={Styles.Modal__content__formControl}
                      name="nome"
                      type="text"
                      value={nome}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className={Styles.Modal__content__formGroup}>
                  <label className={Styles.Modal__content__label} htmlFor="categoriaId">
                    Categoria:
                    <select
                      className={Styles.Modal__content__formControl}
                      name="categoriaId"
                      value={categoriaId}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={Styles.Modal__content__formGroup}>
                  <label className={Styles.Modal__content__label} htmlFor="preco">
                    Preço:
                    <input
                      className={Styles.Modal__content__formControl}
                      name="preco"
                      type="number"
                      value={preco}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className={Styles.Modal__content__formGroup}>
                  <label className={Styles.Modal__content__label} htmlFor="quantidade">
                    Quantidade:
                    <input
                      className={Styles.Modal__content__formControl}
                      name="quantidade"
                      type="number"
                      value={quantidade}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className={Styles.Modal__content__formGroup}>
                  <label className={Styles.Modal__content__label} htmlFor="descricao">
                    Descrição:
                    <textarea
                      className={Styles.Modal__content__formControl}
                      name="descricao"
                      value={descricao}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className={Styles.Modal__content__formGroup}>
                  <label className={Styles.Modal__content__label} htmlFor="imagem">
                    Imagem:
                    <input
                      className={Styles.Modal__content__formControl}
                      name="imagem"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className={Styles.Modal__content__containerAdd}>
                  <button className={Styles.Modal__content__containerAdd__addButton} type="submit">Cadastrar Produto</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showScrollButton && (
          <button className={Styles.ScrollToTopButton} onClick={scrollToTop}>
            <FaArrowUp />
          </button>
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          onClose={handleToastClose}
        />
        {showToast && (
          toast.success('Produto cadastrado com sucesso!')
        )}
      </div>
    </>
  );
}

export default EstoqueContent;
