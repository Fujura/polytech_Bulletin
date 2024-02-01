import { FC } from "react";
import styles from "/src/styles/Profile.module.css";
import { onShowLeftBar } from "./showLeftBar";


export const BurgerContainer: FC<{ setShowLeftBar: (show: boolean) => void; showLeftBar: boolean }> = ({ setShowLeftBar, showLeftBar }) => {
    return (
      <div
        className={styles.burgerContainer}
        onClick={() => onShowLeftBar(setShowLeftBar, showLeftBar)}
        style={
          showLeftBar
            ? { transform: "translateX(200px)" }
            : { transform: "translateX(0)" }
        }
      >
        <span className="burgerLine1"></span>
        <span className="burgerLine2"></span>
        <span className="burgerLine3"></span>
      </div>
    );
  };