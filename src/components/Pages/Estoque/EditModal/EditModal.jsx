// EditModal.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './EditModal.module.scss';

const EditModal = ({ product, onSave, onClose }) => {
    const [editedProduct, setEditedProduct] = useState({ ...product });
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        fetch('http://45.235.53.125:8080/api/categoria')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar categorias');
                }
                return response.json();
            })
            .then(data => {
                setCategorias(data); // Define as categorias obtidas da API
            })
            .catch(error => {
                console.error('Erro ao buscar categorias:', error);
                // Aqui você pode tratar o erro de acordo com as necessidades da sua aplicação
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleSave = () => {
        onSave(editedProduct);
        onClose();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalContent__Heading}>Editar Produto</h2>
                <form>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="nome">Nome:</label>
                        <input className={styles.modalContent__formGroup__Input} type="text" id="nome" name="nome" value={editedProduct.nome} onChange={handleChange} />
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="descricao">Descrição</label>
                        <input className={styles.modalContent__formGroup__Input} type="text" id="descricao" name="descricao" value={editedProduct.descricao} onChange={handleChange} />
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="preco">Preço:</label>
                        <input className={styles.modalContent__formGroup__Input} type="number" id="preco" name="preco" value={editedProduct.preco} onChange={handleChange} />
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="quantidade">Quantidade:</label>
                        <input className={styles.modalContent__formGroup__Input} type="number" id="quantidade" name="quantidade" value={editedProduct.quantidade} onChange={handleChange} />
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="categoria">Categoria:</label>
                        <select className={styles.modalContent__formGroup__Select} id="categoria" name="categoria" value={editedProduct.categoria} onChange={handleChange}>
                            <option value="">Selecione uma categoria</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </select>
                    </div>
                    <button type="button" onClick={handleSave} className={styles.modalContent__buttonSave}>Salvar</button>
                    <button type="button" onClick={onClose} className={styles.modalContent__buttonCancel}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

EditModal.propTypes = {
    product: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditModal;
