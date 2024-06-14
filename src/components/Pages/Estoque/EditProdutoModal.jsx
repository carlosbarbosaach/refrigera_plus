import React, { useState } from 'react';

const EditProdutoModal = ({ produto, categorias, onEdit, onClose }) => {
  const [nome, setNome] = useState(produto.nome);
  const [quantidade, setQuantidade] = useState(produto.quantidade);
  const [preco, setPreco] = useState(produto.preco);
  const [categoriaId, setCategoriaId] = useState(produto.categoria.id);
  const [imagem, setImagem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEdit = async () => {
    setIsLoading(true);
    setError(null);

    const editedProduto = {
      id: produto.id,
      nome,
      quantidade,
      preco,
      categoriaId,
      imagem // Imagem editada, pode ser null se não for alterada
    };

    try {
      const formData = new FormData();
      formData.append('id', produto.id);
      formData.append('nome', nome);
      formData.append('quantidade', quantidade);
      formData.append('preco', preco);
      formData.append('categoriaId', categoriaId);
      if (imagem) {
        formData.append('imagem', imagem);
      }

      const response = await fetch('http://45.235.53.125:8080/api/produto', {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao editar o produto');
      }

      const updatedProduto = await response.json();
      onEdit(updatedProduto);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content-edit">
        <h2>Editar Produtoo</h2>
        {error && <p className="error">{error}</p>}
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <label htmlFor="quantidade">Quantidade:</label>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
        />
        <label htmlFor="preco">Preço:</label>
        <input
          type="number"
          value={preco}
          onChange={(e) => setPreco(Number(e.target.value))}
        />
        <label htmlFor="categoria">Categoria:</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
        >
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
          ))}
        </select>
        <label htmlFor="imagem">Imagem:</label>
        <input
          type="file"
          onChange={(e) => setImagem(e.target.files[0])}
        />
        <button onClick={handleEdit} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
        <button onClick={onClose} disabled={isLoading}>Cancelar</button>
      </div>
    </div>
  );
};

export default EditProdutoModal;
