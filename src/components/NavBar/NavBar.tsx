import React from "react";
import logo from "/public/logo.png";
import styles from "/src/styles/NavBar.module.css";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import profileIcon from "/public/profileDefault.png";
import LoginIcon from "/src/assets/login.svg";
import adminIcon from "/src/assets/admin-alt.svg";
import bulletinIcon from "/src/assets/bulletin.svg";
import axios from "axios";
import { link } from "../../api/link";

export const NavBar = () => {
  const [cookies] = useCookies(["jwt"]);
  const [display, setDisplay] = React.useState({
    auth: "flex",
    profile: "none",
  });
  const [userData, setUserData] = React.useState({
    avatarUrl: "",
    role: {
      name: "",
    },
  });
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
  }, []);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${link}/api/users/me?populate=role`, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [cookies]);

  console.log(userData);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo__Container}>
        <img src={logo} alt="logo polytech" className={styles.logo} />
        <div className={styles.logo__TextContainer}>
          <h2 className={styles.logo__Title}>Polytech</h2>
          <p className={styles.logo__Text}>Доска Объявлений</p>
        </div>
      </div>
      <div className={styles.navbar__LinksContainer}>
        <Link to={"/items"} className={styles.navbar__Link}>
          <img
            src={bulletinIcon}
            alt="bulletin icon"
            className={styles.navbar__Icons}
          />
          <p className={styles.navbar__LinkText}>Объявления</p>
        </Link>

        {userData.role && userData.role.name === "Admin" ? (
          <Link to={"/adminPanel"} className={styles.navbar__Link}>
            <img src={adminIcon} alt="" className={styles.navbar__Icons} />
            <p className={styles.navbar__LinkText}>Админ панель</p>
          </Link>
        ) : (
          <></>
        )}

        <Link
          to={"/profile"}
          style={{ display: display.profile }}
          className={styles.navbar__Link}
        >
          <img
            src={
              userData.avatarUrl
                ? `${link}${userData.avatarUrl}`
                : profileIcon
            }
            alt="profile icon"
            className={styles.navbar__ProfileImg}
          />
          <p className={styles.navbar__LinkText}>Профиль</p>
        </Link>

        <Link
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
        </Link>
      </div>
    </nav>
  );
};