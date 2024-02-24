import React, { useContext } from "react";
import logo from "/public/logo.png";
import styles from "/src/styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import profileIcon from "/public/profileDefault.png";
import LoginIcon from "/src/assets/login.svg";
import adminIcon from "/src/assets/admin-alt.svg";
import bulletinIcon from "/src/assets/bulletin.svg";
import { link } from "../../api/link";
import chechBoxIcon from "/src/assets/checkbox.svg";
import { Message } from "../Message/Message";
import { NavBarContext } from "./NavBarContext";

export const NavBar = () => {
  const [cookies] = useCookies(["jwt"]);
  const [display, setDisplay] = React.useState({
    auth: "flex",
    profile: "none",
  });

  const { userData } = useContext(NavBarContext);

  React.useEffect(() => {
    if (!!cookies.jwt) {
      setDisplay({
        auth: "none",
        profile: "flex",
      });
    } else {
      setDisplay({
        auth: "flex",
        profile: "none",
      });
    }
  }, [cookies, userData]);


  return (
    <nav className={styles.navbar}>
      <NavLink to={'/'} className={styles.logo__Container}>
        <img src={logo} alt="logo polytech" className={styles.logo} />
        <div className={styles.logo__TextContainer}>
          <h2 className={styles.logo__Title}>Polytech</h2>
          <p className={styles.logo__Text}>Доска Объявлений</p>
        </div>
      </NavLink>
      <div className={styles.navbar__LinksContainer}>
        <NavLink to={"/items/page/1"} className={styles.navbar__Link}>
          <img
            src={bulletinIcon}
            alt="bulletin icon"
            className={styles.navbar__Icons}
          />
          <p className={styles.navbar__LinkText}>Объявления</p>
        </NavLink>

        <NavLink to={"/items/addItem"} className={styles.navbar__Link}>
          <img
            src={chechBoxIcon}
            alt="bulletin icon"
            className={styles.navbar__Icons}
          />
          <p className={styles.navbar__LinkText}>Разместить</p>
        </NavLink>

        {userData.role && userData.role.name === "Admin" ? (
          <NavLink to={"/adminPanel"} className={styles.navbar__Link}>
            <Message userData={userData}/>
            <img src={adminIcon} alt="" className={styles.navbar__Icons} />
            <p className={styles.navbar__LinkText}>Админ панель</p>
          </NavLink>
        ) : (
          <></>
        )}

        <NavLink
          to={"/profile"}
          style={{ display: display.profile }}
          className={styles.navbar__Link}
        >
          <img
            src={
              userData.avatarUrl ? `${link}${userData.avatarUrl}` : profileIcon
            }
            alt="profile icon"
            className={styles.navbar__ProfileImg}
          />
          <p className={styles.navbar__LinkText}>Профиль</p>
        </NavLink>

        <NavLink
          to={"/signIn"}
          className={styles.navbar__Link}
          style={{ display: display.auth }}
        >
          <img
            src={LoginIcon}
            alt="authorization icon"
            className={styles.navbar__Icons}
          />
          <p className={styles.navbar__LinkText}>Авторизация</p>
        </NavLink>
      </div>
    </nav>
  );
};
