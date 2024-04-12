import React, { useState } from 'react';
import './EstoqueContent.css';

function EstoqueContent() {
  const [categoriaId, setCategoriaId] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [imagem, setImagem] = useState(null);
  const [idProduto, setIdProduto] = useState(null);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const idImagem = await cadastrarImagem();
      const idProdutoResponse = await cadastrarProduto(idImagem);

      await atualizarProdutoComImagem(idImagem, idProdutoResponse);

      console.log('Produto cadastrado com sucesso e imagem associada.');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  return (
    <>
      <div className='containerForm'>
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>Página de Gestão</h2>
          <div className="form-group">
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
              ID da Categoria:
              <input
                className="form-control"
                name="categoriaId"
                type="number"
                value={categoriaId}
                onChange={handleInputChange}
              />
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
    </>
  );
}

export default EstoqueContent;