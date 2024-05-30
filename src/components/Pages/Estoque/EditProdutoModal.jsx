// EditProdutoModal.js

import React, { useState } from 'react';

const EditProdutoModal = ({ produto, categorias, onEdit, onClose }) => {
  const [nome, setNome] = useState(produto.nome);
  const [quantidade, setQuantidade] = useState(produto.quantidade);
  const [preco, setPreco] = useState(produto.preco);
  const [categoriaId, setCategoriaId] = useState(produto.categoria.id);
  const [imagem, setImagem] = useState(null);

  const handleEdit = () => {
    const editedProduto = {
      id: produto.id,
      nome,
      quantidade,
      preco,
      categoriaId,
      imagem // Imagem editada, pode ser null se não for alterada
    };
    onEdit(editedProduto);
  };

  return (
    <div className="modal">
      <div className="modal-content-edit">
        <h2>Editar Produto</h2>
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
          onChange={(e) => setQuantidade(e.target.value)} 
        />
        <label htmlFor="preco">Preço:</label>
        <input 
          type="number" 
          value={preco} 
          onChange={(e) => setPreco(e.target.value)} 
        />
        <label htmlFor="categoria">Categoria:</label>
        <select 
          value={categoriaId} 
          onChange={(e) => setCategoriaId(e.target.value)} 
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
        <button onClick={handleEdit}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default EditProdutoModal;
