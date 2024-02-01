import axios from "axios";
import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { link } from "../../api/link";
import defaultAvatar from "/public/profileDefault.png";
import styles from "/src/styles/UserProfile.module.css";
import { motion } from "framer-motion";
import { Item } from "../items/Item/Item";
import { Loading } from "../Loading/Loading";

export const UserProfile: FC<{ token: string }> = ({ token }) => {
  const [userData, setUserData] = React.useState({
    username: "",
    id: 0,
    avatarUrl: "",
    items: [
      {
        id: 0,
        type: "",
        title: "",
        description: "",
        isConfirm: false,
      },
    ],
  });

  const [userId, setUserId] = React.useState<number>();
  const [isUserUpdated] = React.useState(false);
  const [confirmItem, setConfirmItem] = React.useState<any[]>([]);
  const [isDataFetching, setDataFetching] = React.useState<boolean>(true);
  const [hasUser, setHasUser] = React.useState<boolean>(false);
  const navigate = useNavigate();
  let { id: ID } = useParams();

  React.useEffect(() => {
    if (ID == userId) {
      navigate("/profile");
      setDataFetching(false);
    }
    else setTimeout(() => {
      setDataFetching(false);
    }, 1000);

    if (!!token) {
      (async () => {
        try {
          const response = await axios.get(`${link}/api/users/me?populate=*`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserId(response.data.id);
        } catch (error) {
          console.error(error);
        }
      })();
    }

    if (!!ID) {
      (async () => {
        try {
          const response = await axios.get(
            `${link}/api/users/${ID}?populate=*`
          );
          setUserData(response.data);
          setConfirmItem(
            response.data.items.filter((item: any) => item.isConfirm === true)
          );
          setHasUser(true);
        } catch (error) {
          console.error({ error });
        }
      })();
    }
    
  }, [isUserUpdated, userId]);

  // React.useEffect(() => {
    // if (ID == userId) {
    //   navigate("/profile");
    //   setDataFetching(false);
    // } else setDataFetching(false);
  // }, [isUserUpdated, isDataFetching]);

  return (
    <>
      {" "}
      {isDataFetching ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : (
        <div>
          {!hasUser ? (
            <p className={styles.userNotFound}>
              Такого пользователя не существует
            </p>
          ) : (
            <>
              <motion.div
                className="container"
                initial={{ scale: 0, opacity: 0, y: 500 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 40,
                }}
              >
                <img
                  src={
                    !userData.avatarUrl
                      ? defaultAvatar
                      : `${link}${userData.avatarUrl}`
                  }
                  alt="profile image"
                  className={styles.user__HeaderAvatar}
                />
                <h2 className={styles.user__HeaderUsername}>
                  {userData.username}
                </h2>
              </motion.div>

              <div>
                <h3 style={{ color: "#fff", marginTop: "100px" }}>
                  Объявления пользователя:
                </h3>
                {Array.isArray(userData.items) && userData.items.length > 0 ? (
                  <div className={styles.items__Container}>
                    {confirmItem.map((item) => (
                      <Item
                        key={item.id}
                        itemId={item.id}
                        type={item.type}
                        username={userData.username}
                        title={item.title}
                        description={item.description}
                        userAvatar={userData.avatarUrl}
                        token={token}
                        userId={userData.id}
                      />
                    ))}
                  </div>
                ) : (
                  <p className={styles.bulletinNotFound}>
                    У пользователя нет объявлений
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
