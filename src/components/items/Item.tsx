import React, { FC } from "react";
import { IItem } from "../../interfaces/Items/IItem";
import styles from "/src/styles/Item.module.css";
import { link } from "../../api/link";
import defaultAvatar from "/public/profileDefault.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClickModal } from "./ClickModal";
import { motion } from "framer-motion";

export const Item: FC<IItem> = ({
  description,
  userAvatar,
  type,
  title,
  userRole,
  setRefresh,
  token,
  userId,
  username,
  itemId,
  refreshPage,
  itemStatus,
}) => {
  const [userData, setUserData] = React.useState({
    username: "",
    id: 0,
    avatarUrl: "",
    role: {
      name: "",
    },
  });
  const [modal, setModal] = React.useState<boolean>(false);

  const toggle = () => {
    setModal(!modal);
  };

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
    }
  }, [token]);

  const deleteItemHandler = async () => {
    try {
      await axios.delete(`${link}/api/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!!refreshPage) {
        setRefresh(!refreshPage);
      } else {
        setRefresh(!refreshPage);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const publicItemHandler = async () => {
    await axios.put(
      `${link}/api/items/${itemId}`,
      {
        data: {
          isConfirm: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!!refreshPage) {
      setRefresh(!refreshPage);
    } else {
      setRefresh(!refreshPage);
    }
  };

  return (
    <motion.div
      className={styles.item}
      initial={{ scale: 0.5, opacity: 0, y: 300 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 40,
      }}
    >
      <div className={styles.item__Header}>
        <Link to={`/profile/${userId}`} className={styles.item__HeaderBy}>
          <img
            className={styles.item__HeaderAvatar}
            src={
              userAvatar === "" ||
              userAvatar === null ||
              userAvatar === undefined
                ? defaultAvatar
                : `${link}${userAvatar}`
            }
            alt="user avatar"
          />

          <p className={styles.item__HeaderUsername}>{username}</p>
        </Link>
      </div>
      <hr />
      <div className={styles.item__Container}>
      <div className={styles.item__Body}>
          <h5 className={styles.item__HeaderTitle}>{title}</h5>
          <p className={styles.item__HeaderType}>Тип: {type}</p>
          {itemStatus === undefined ? (
            <></>
          ) : itemStatus ? (
            <p className={styles.item__HeaderStatus}>Статус: опубликовано</p>
          ) : (
            <p className={styles.item__HeaderStatus}>Статус: на модерации </p>
          )}
      </div>
      <div className={styles.line}></div>

      <div className={styles.item__Footer}>
      <p className={styles.item__BodyDescription}>{description}</p>

        {userId == userData.id || userRole === userData.role.name ? (
          <button onClick={deleteItemHandler}>Удалить</button>
        ) : (
          <></>
        )}
        {userRole == "Admin" ? (
          <button onClick={publicItemHandler}>Опубликовать</button>
        ) : (
          <></>
        )}
        {userRole === undefined ? (
          userId != userData.id && userData.id != 0 ? (
            <button onClick={toggle}>Откликнуться</button>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </div>
      </div>
      <ClickModal token={token} toggle={toggle} modal={modal} itemId={itemId} />
    </motion.div>
  );
};
