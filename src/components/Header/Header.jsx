import React from 'react';
import InputPesquisar from './components/InputPesquisar/InputPesquisar'
import BtnPesquisar from './components/BotaoPesquisar/BtnPesquisar'
import Styles from '../../Styles/Header/Header.module.scss';
import LogoRefrigera from '../../assets/logo_refrigera.png'
import iconHome from '../../assets/icon_home.svg'
import iconManagement from '../../assets/icon_management.svg'
import iconBox from '../../assets/icon_box.svg'

function Header() {
  return (
    <header className={Styles.Header}>
      <div className={Styles.Header__container}>
        <img src={LogoRefrigera} alt="Refrigera PluS" className={Styles.Header__container__logo} />
        <form className={Styles.Header__container__form}>
          <InputPesquisar />
          <BtnPesquisar />
        </form>
        <nav className={Styles.Header__container__nav}>
          <ul>
            <li className={Styles.Header__item}>
              <a className={Styles.Header__link} href="/">Página Inicial
                <img src={iconHome} alt="Icone Inicio" className={Styles.Header__container__icon} />
              </a>
            </li>
            <li className={Styles.Header__item}>
              <a className={Styles.Header__link} href="/gestao">Gestão
                <img src={iconManagement} alt="Icone Gestão" className={Styles.Header__container__icon} />
              </a>
            </li>
            <li className={Styles.Header__item}>
              <a className={Styles.Header__link} href="/estoque">Estoque
                <img src={iconBox} alt="Icone Estoque" className={Styles.Header__container__icon} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
