import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nome:
          <input
            name="nome"
            type="text"
            value={nome}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          ID da Categoria:
          <input
            name="categoriaId"
            type="number"
            value={categoriaId}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Descrição:
          <input
            name="descricao"
            type="text"
            value={descricao}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Preço:
          <input
            name="preco"
            type="number"
            value={preco}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Quantidade:
          <input
            name="quantidade"
            type="number"
            value={quantidade}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Imagem:
          <input
            name="imagem"
            type="file"
            onChange={handleImageChange}
          />
        </label>
      </div>
      <button type="submit">Cadastrar Produto</button>
    </form>
  );
}

export default EstoqueContent;
