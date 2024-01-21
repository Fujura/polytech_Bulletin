import { FC } from "react";
import header__Img from "/public/header-img.png";
import styles from "/src/styles/Header.module.css";

export const Header: FC = () => {
  return (
    <header>
     
      <div className={styles.header__Container}>

          <img src={header__Img} alt="" className={styles.header__Img}/>

        <div className={styles.title__Container}>
          <h1 className={styles.title}>Polytech </h1>
          <p className={styles.preTitle}>Доска Объявлений</p>
          <button>Подробнее..</button>
        </div>
      </div>
    </header>
  );
};
