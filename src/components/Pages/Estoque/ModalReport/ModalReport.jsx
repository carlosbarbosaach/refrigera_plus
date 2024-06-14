import React from 'react';
import PropTypes from 'prop-types';
import styles from './ModalReport.module.scss';

const ModalReport = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <p className={styles.modalContent__Paragraph}>{message}</p>
                <div className={styles.modalButtons}>
                    <button className={styles.modalButton} onClick={onConfirm}>Confirmar</button>
                    <button className={styles.modalButton} onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

ModalReport.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ModalReport;
