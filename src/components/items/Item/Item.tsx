import React, { FC } from "react";
import styles from "/src/styles/Item.module.css";
import defaultAvatar from "/public/profileDefault.png";
import axios from "axios";
import { Link } from "react-router-dom";
import {  motion } from "framer-motion";
import dotsIcon from "/src/assets/menu-dots-vertical.svg";
import { IItem } from "../../../interfaces/Items/IItem";
import { link } from "../../../api/link";
import { ClickModal } from "../ItemsFunc/ClickModal";
import { LoadingItem } from "../../Loading/LoadingItem";

export const Item: FC<IItem> = React.memo(
  ({
    options: {
      description,
      userAvatar,
      type,
      title,
      userRole,
      token,
      userId,
      username,
      itemId,
      itemStatus,
      setUpdatePage,
    },
    userData,
  }) => {
    const [modal, setModal] = React.useState<boolean>(false);
    const [showBtn, setShowBtn] = React.useState<boolean>(false);
    const [isLoading, setLoading] = React.useState<boolean>(false);

    const toggle = React.useCallback(() => {
      setModal((prevModal) => !prevModal);
    }, []);

    const user = userData || {
      id: 0,
      username: "",
      avatarUrl: "",
      role: { name: "" },
    };

    const showBtnHandler = React.useCallback(() => {
      setShowBtn((prevShowBtn) => !prevShowBtn);
    }, []);

    const deleteItemHandler = React.useCallback(async () => {
      setLoading(true);

      try {
        await axios.delete(`${link}/api/items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUpdatePage(true);
        setLoading(false);
      } catch (error) {
        console.log({ error });
      }
    }, [itemId, token, setUpdatePage]);

    
    const publicItemHandler = React.useCallback(async () => {
      setLoading(true);
      try {
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
        setUpdatePage(true);
        setLoading(false)
      } catch (error) {
        console.error(error);
      }
    }, [itemId, token]);

    const userAvatarUrl = React.useMemo(() => {
      return userAvatar === "" ||
        userAvatar === null ||
        userAvatar === undefined
        ? defaultAvatar
        : `${link}${userAvatar}`;
    }, [userAvatar]);

    return (
      <>
        <motion.div
          className={styles.item}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1}}
          exit={{ scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 40,
          }}
          
        >
          {isLoading ? (
            <LoadingItem />
          ) : (
            <>
              <div className={styles.item__Header}>
                <Link
                  to={`/profile/${userId}`}
                  className={styles.item__HeaderBy}
                >
                  <img
                    className={styles.item__HeaderAvatar}
                    src={
                      userAvatar === "" ||
                      userAvatar === null ||
                      userAvatar === undefined
                        ? defaultAvatar
                        : `${userAvatarUrl}`
                    }
                    loading="lazy"
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
                    <p className={styles.item__HeaderStatus}>
                      Статус: опубликовано
                    </p>
                  ) : (
                    <p className={styles.item__HeaderStatus}>
                      Статус: на модерации{" "}
                    </p>
                  )}
                </div>
                <div className={styles.line}></div>

                <div className={styles.item__Footer}>
                  <p className={styles.item__BodyDescription}>{description}</p>
                  {!token ? (
                    <></>
                  ) : (
                    <div onClick={showBtnHandler} style={{ cursor: "pointer" }}>
                      <img src={dotsIcon} className={styles.dotsIcon} />
                    </div>
                  )}

                  <div
                    className={styles.btn__Container}
                    style={{ display: showBtn ? "flex" : "none" }}
                  >
                    {userId == user.id || userRole === user.role.name ? (
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
                      userId != userData?.id && userData?.id != 0 ? (
                        <button onClick={toggle}>Откликнуться</button>
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          <ClickModal
            token={token}
            toggle={toggle}
            modal={modal}
            itemId={itemId}
            userData={userData}
          />
        </motion.div>
      </>
    );
  }
);
