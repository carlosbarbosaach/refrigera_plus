import React, { useState, useEffect } from 'react';
import './EstoqueContent.css';
import GetEstoque from "./GetEstoque";

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
        const idProdutoResponse = produtoDataResponse.id; // Armazena o ID do produto
        setIdProduto(idProdutoResponse); // Armazena o ID do produto no estado
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

  return (
    <>
      <div className='containerForm'>
      <button className="btn-add" onClick={openModal}>
          Adicionar Novo Produto
        </button>
        <GetEstoque />
        {showModal && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={closeModal}>X</button>
              <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                <h2>Adicionar Novo Produto</h2>
                  <label htmlFor="nome">
                    Nome:
                    <input
                      className="form-control"
                      name="nome"
                      type="text"
                      value={nome}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="categoriaId">
                    Categoria:
                    <select
                      className="form-control"
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
                <div className="form-group">
                  <label htmlFor="preco">
                    Preço:
                    <input
                      className="form-control"
                      name="preco"
                      type="number"
                      value={preco}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="quantidade">
                    Quantidade:
                    <input
                      className="form-control"
                      name="quantidade"
                      type="number"
                      value={quantidade}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="descricao" className="form-label">
                    Descrição:
                    <textarea
                      className="form-control"
                      name="descricao"
                      value={descricao}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="imagem">
                    Imagem:
                    <input
                      className="form-control"
                      name="imagem"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <button className="btn-submit" type="submit">Cadastrar Produto</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EstoqueContent;
