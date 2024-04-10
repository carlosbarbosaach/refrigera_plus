import React, { Component } from 'react';

class EstoqueContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoriaId: 0,
      descricao: '',
      nome: '',
      preco: 0,
      quantidade: 0,
      imagem: null,
      idImagem: ''
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleImageChange = (event) => {
    this.setState({
      imagem: event.target.files[0]
    });
  }

  cadastrarImagem = async () => {
    try {
      const imagemData = new FormData();
      imagemData.append('imagem', this.state.imagem);

      const response = await fetch('http://45.235.53.125:8080/api/imagem', {
        method: 'POST',
        body: imagemData
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar imagem: ' + response.statusText);
      }

      const imageData = await response.json();
      const idImagem = imageData.id;
      this.setState({ idImagem });
      console.log('Imagem cadastrada com sucesso. ID:', idImagem);
    } catch (error) {
      console.error('Erro ao cadastrar imagem:', error);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    // Etapa 1: Cadastrar a imagem
    await this.cadastrarImagem();

    // Etapa 2: Cadastrar o produto usando o ID da imagem
    const { categoriaId, descricao, nome, preco, quantidade, idImagem } = this.state;
    const produtoData = {
      categoria: { id: categoriaId },
      descricao,
      nome,
      preco,
      quantidade,
      idImagem
    };

    try {
      const response = await fetch('http://45.235.53.125:8080/api/produto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoData)
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar produto: ' + response.statusText);
      }

      const produtoDataJson = await response.json();
      console.log('Produto cadastrado com sucesso:', produtoDataJson);
      // Lógica para finalizar o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>
            ID da Categoria:
            <input
              name="categoriaId"
              type="number"
              value={this.state.categoriaId}
              onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Descrição:
            <input
              name="descricao"
              type="text"
              value={this.state.descricao}
              onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Nome:
            <input
              name="nome"
              type="text"
              value={this.state.nome}
              onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Preço:
            <input
              name="preco"
              type="number"
              value={this.state.preco}
              onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Quantidade:
            <input
              name="quantidade"
              type="number"
              value={this.state.quantidade}
              onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Imagem:
            <input
              name="imagem"
              type="file"
              onChange={this.handleImageChange} />
          </label>
        </div>
        <button type="submit">Cadastrar Produto</button>
      </form>
    );
  }
}

export default EstoqueContent;
