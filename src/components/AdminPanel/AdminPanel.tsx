import React, { FC, useEffect } from "react";

import { link } from "../../api/link";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "/src/styles/AdminPanel.module.css";
import { Loading } from "../Loading/Loading";
import { Item } from "../items/Item/Item";
import { IAdminPanel } from "../../interfaces/IAdminPanel";
import { AnimatePresence } from "framer-motion";
import arrow from '/src/assets/arrow-back.svg';
import { NavBar } from "../NavBar/NavBar";

export const AdminPanel: FC<IAdminPanel> = ({
  token,
  userData,
  setUpdatePage,
  updatePage,
}) => {
  const [itemsData, setItemsData] = React.useState([
    {
      id: 0,
      attributes: {
        title: "",
        userId: 0,
        isConfirm: false,
      },
    },
  ]);

  const navigate = useNavigate();
  const [isDataFetching, setDataFetching] = React.useState<boolean>(true);

  if (
    userData?.role &&
    userData.role.name !== "Admin" &&
    userData.role.name !== ""
  ) {
    navigate("/");
  }

  setTimeout(() => {
    setDataFetching(false);
  }, 1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${link}/api/items?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItemsData(
          data.data.filter((item: any) => item.attributes.isConfirm === false)
        );
      } catch (error) {
        console.error({ error });
      }
    };

    fetchData();
  }, [token, updatePage]);

  console.log(itemsData);
  
  return (
    <div>
      <NavBar />
      <Link to={"/"}>
        <img src={arrow} className={styles.arrow} />
      </Link>

      <h2 className={styles.title}>Админ панель</h2>
      {isDataFetching ? (
        <Loading />
      ) : itemsData.length ? (
        <div className={styles.items__Container}>
          <AnimatePresence>
            {itemsData.map((item: any) => (
              <Item
                key={item.id}
                options={{
                  itemId: item.id,
                  username: item.attributes.user?.data?.attributes?.username,
                  title: item.attributes.title,
                  type: item.attributes.item_type.data.attributes.type,
                  description: item.attributes.description,
                  userAvatar: item.attributes.user?.data?.attributes?.avatarUrl,
                  token: token,
                  userRole: userData?.role.name,
                  userId: item.attributes.user?.data?.id,
                  setUpdatePage: setUpdatePage,
                }}
                userData={userData}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className={styles.DataProgress}>
          Тут пусто...
          <br />
          Пользователи не размещали объявления
        </p>
      )}
    </div>
  );
};
