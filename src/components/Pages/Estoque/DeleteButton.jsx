import React from 'react';
import PropTypes from 'prop-types';
// import styles from './DeleteButton.module.scss';

const DeleteButton = ({ productId, onDelete }) => {
    const handleDelete = async () => {
      try {
        const response = await fetch(`http://45.235.53.125:8080/api/produto/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        onDelete(productId);
      } catch (err) {
        console.error("Erro ao deletar o produto:", err);
      }
    };
  
    return (
      <button onClick={handleDelete} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
        Deletar
      </button>
    );
  };
  
  DeleteButton.propTypes = {
    productId: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
  };
  
  export default DeleteButton;
