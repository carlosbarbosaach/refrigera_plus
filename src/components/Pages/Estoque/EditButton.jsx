import React from 'react';
import PropTypes from 'prop-types';
// import styles from './EditButton.module.scss';

const EditButton = ({ product, onEdit }) => {
    const handleEdit = () => {
      onEdit(product);
    };
  
    return (
      <button onClick={handleEdit} style={{ backgroundColor: '#2196f3', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
        Editar
      </button>
    );
  };
  
  EditButton.propTypes = {
    product: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
  };
  
  export default EditButton;
