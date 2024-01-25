import React, { FC, useEffect } from "react";
import { Item } from "../items/Item";
import { link } from "../../api/link";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "/src/styles/AdminPanel.module.css";
import { Loading } from "../Loading/Loading";

export const AdminPanel: FC<{ token: string }> = ({ token }) => {
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

  const [userData, setUserData] = React.useState({
    role: {
      name: "",
    },
  });

  const [refreshPage, setRefresh] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const [isDataFetching, setDataFetching] = React.useState<boolean>(true);

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
  }, [token, refreshPage]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${link}/api/users/me?populate=role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);

        if (
          response.data.role &&
          response.data.role.name !== "Admin" &&
          response.data.role.name !== ""
        ) {
          navigate("/");
        }

        setDataFetching(false);
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <div>
      <h2 className={styles.title}>Админ панель</h2>
      {isDataFetching ? (
        <Loading /> 
      ) : itemsData.length ? (
        <div className={styles.items__Container}>
          {itemsData.map((item: any) => (
            <Item
              key={item.id}
              itemId={item.id}
              refreshPage={refreshPage}
              username={item.attributes.user?.data?.attributes?.username}
              title={item.attributes.title}
              type={item.attributes.type}
              description={item.attributes.description}
              userAvatar={item.attributes.user?.data?.attributes?.avatarUrl}
              token={token}
              userRole={userData.role.name}
              userId={item.attributes.user?.data?.id}
              setRefresh={setRefresh}
            />
          ))}
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
