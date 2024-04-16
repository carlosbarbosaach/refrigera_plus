import React from 'react';
import InputPesquisar from './components/InputPesquisar/InputPesquisar'
import BtnPesquisar from './components/BotaoPesquisar/BtnPesquisar'
import Styles from '../../Styles/Header/Header.module.scss';

function Header() {
  return (
    <header className={Styles.Header}>
      <div className={Styles.Header__container}>
        <h1 className={Styles.Header__container__title}>Refrigera PluS</h1>
        <form className={Styles.Header__container__form}>
          <InputPesquisar />
          <BtnPesquisar />
        </form>
        <nav className={Styles.Header__container__nav}>
          <ul>
            <li className={Styles.Header__item}>
              <a className={Styles.Header__link} href="/">Página Inicial</a>
            </li>
            <li className={Styles.Header__item}>
              <a className={Styles.Header__link} href="/gestao">Gestão</a>
            </li>
            <li className={Styles.Header__item}>
              <a className={Styles.Header__link} href="/estoque">Estoque</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
