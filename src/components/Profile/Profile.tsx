import React, { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "/src/styles/Profile.module.css";
import arrow from "/src/assets/arrow-back.svg";
import { Loading } from "../Loading/Loading";
import { IProfile } from "../../interfaces/Profile/IProfile";
import { ItemList } from "./ItemsList/ItemsList";
import LeftSidebar from "./LeftSideBar/LeftSideBar";
import { BurgerContainer } from "./LeftSideBar/BurgerContainer";

export const Profile: FC<IProfile> = ({
  token,
  removeCookie,
  userData,
  setUpdatePage,
}) => {
  const [, setUserUpdated] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isAuth] = React.useState<boolean>(false);

  const navigate = useNavigate();
  const [showLeftBar, setShowLeftBar] = React.useState<boolean>(false);
  const [, setWindowWidth] = React.useState(window.innerWidth);

  const handleLogout = () => {
    removeCookie("jwt");
  };

  React.useEffect(() => {
    if (!!token) {
      setTimeout(() => {
        setIsFetching(false);
      }, 500);
    } else {
      setTimeout(() => {
        navigate("/signIn");
      }, 1000);
      
    }

    if (window.innerWidth > 768) {
      setShowLeftBar(true);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [token]);

  return (
    <div>
      {isFetching ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
    </div>
      ) : isAuth ? (
        <p className={styles.status}>Вы не авторизованы! </p>
      ) : (
        <>
          <div>
            <Link to={"/"}>
              <img src={arrow} className={styles.arrow} />
            </Link>
          </div>
          {!!userData && !isFetching ? (
            <div className={styles.profile__Container}>
              {/* Left Sidebar Component */}
              <LeftSidebar
                options={{
                  userData: userData,
                  setShowLeftBar: setShowLeftBar,
                  showLeftBar: showLeftBar,
                  token: token,
                  setUserUpdated: setUserUpdated,
                  handleLogout: handleLogout,
                }}
              />
              {/* Burger Container Component */}
              <BurgerContainer
                setShowLeftBar={setShowLeftBar}
                showLeftBar={showLeftBar}
              />
              {/* Item List Component */}
              <ItemList
                options={{
                  userData: userData,
                  token: token,
                  setUpdatePage: setUpdatePage,
                }}
              />{" "}
            </div>
          ) : !userData && isFetching ? (
            <Loading />
          ) : (
            <p className={styles.status}>Вы не авторизованы</p>
          )}
        </>
      )}
    </div>
  );
};
