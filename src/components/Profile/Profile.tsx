import axios from "axios";
import React, { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { link } from "../../api/link";
import styles from "/src/styles/Profile.module.css";
import profileIcon from "/public/profileDefault.png";
import logoutIcon from "/src/assets/logout.svg";
import { UploadAvatar } from "./UploadAvatar/UploadAvatar";
import { Item } from "../items/Item";
import arrow from "/src/assets/arrow-back.svg";

export const Profile: FC<{ token: string; removeCookie: any }> = ({
  token,
  removeCookie,
}) => {
  const [userData, setUserData] = React.useState({
    username: "",
    id: 0,
    avatarUrl: "",
    items: [],
  });

  const [isUserUpdated, setUserUpdated] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isAuth, setIsAuth] = React.useState<boolean>(false);

  const navigate = useNavigate();
  const [refreshPage, setRefresh] = React.useState<boolean>(false);
  const [showLeftBar, setShowLeftBar] = React.useState<boolean>(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    if (!!token) {
      (async () => {
        try {
          const response = await axios.get(`${link}/api/users/me?populate=*`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserData(response.data);
        } catch (error) {
          console.error(error);
        }
      })();
    } else {
      setTimeout(() => {
        setIsAuth(false);
        navigate("/");
      }, 2000);
    }

    setIsFetching(false);
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
  }, [token, isUserUpdated, refreshPage]);

  const onShowLeftBar = () => {
    setShowLeftBar(!showLeftBar);
    const burgerContainer = document.querySelector(
      `.${styles.burgerContainer}`
    );

    if (burgerContainer) {
      burgerContainer.classList.toggle("burger__Active");
    }
  };

  return (
    <div>
      {isAuth ? (
        <p className={styles.status}>Вы не прошли авторизацию!</p>
      ) : (
        <>
          <div>
            <Link to={"/"}>
              <img src={arrow} className={styles.arrow} />
            </Link>
          </div>
          {!!userData && !isFetching ? (
            <div className={styles.profile__Container}>
              <div
                style={{
                  transform: `translateX(${showLeftBar ? "0" : "-200px"})`,
                  ...(windowWidth > 768 ? { transform: "translateX(0)" } : {}),
                }}
                className={styles.profile__LeftSide}
              >
                <div>
                  <img
                    src={
                      userData.avatarUrl
                        ? `${link}${userData.avatarUrl}`
                        : profileIcon
                    }
                    alt="profile icon"
                    className={styles.profilePicture}
                  />
                  <UploadAvatar
                    token={token}
                    username={userData.username}
                    userId={userData.id}
                    avatarUrl={userData.avatarUrl}
                    setUserUpdated={setUserUpdated}
                  />
                  <p>{userData.username}</p>
                </div>

                <div>
                  <div
                    onClick={() => {
                      removeCookie("jwt");
                    }}
                    className={styles.logout__Container}
                  >
                    <p>Log Out</p>
                    <img src={logoutIcon} className={styles.logout} />
                  </div>
                </div>
              </div>
              <div
                className={styles.burgerContainer}
                onClick={onShowLeftBar}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "50px",
                  margin: "20px auto 0",
                  marginTop: "100px",
                }}
              >
                {userData.items && userData.items.length > 0 ? (
                  userData.items.map((item: any) => (
                    <Item
                      key={item.id}
                      itemId={item.id}
                      itemStatus={item.isConfirm}
                      refreshPage={refreshPage}
                      username={userData.username}
                      title={item.title}
                      type={item.type}
                      description={item.description}
                      userAvatar={userData.avatarUrl}
                      token={token}
                      userId={userData.id}
                      setRefresh={setRefresh}
                    />
                  ))
                ) : (
                  <div>
                    <p>У вас нету объявлений</p>
                    <Link to={"/items/addItem"}>Разместить</Link>
                  </div>
                )}
              </div>
            </div>
          ) : !userData && isFetching ? (
            <p>загрузка</p>
          ) : (
            <p>User is not found</p>
          )}
        </>
      )}
    </div>
  );
};
