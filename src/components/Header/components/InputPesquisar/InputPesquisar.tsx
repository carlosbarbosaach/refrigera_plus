import React from 'react';
import Styles from "../../../../Styles/Header/Input.module.scss"

function Header() {
    return (
        <>
            <input className={Styles.Input} type="text" placeholder="Pesquisar produtos..." />
        </>
    );
}

export default Header;
