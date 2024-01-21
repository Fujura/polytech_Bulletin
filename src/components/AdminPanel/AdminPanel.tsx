import React, { FC, useEffect } from "react";
import { Item } from "../items/Item";
import { link } from "../../api/link";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      name: '',
    }
  });

  const [refreshPage, setRefresh] = React.useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${link}/api/items?populate=*`,
        {
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

      if (response.data.role && response.data.role.name !== 'Admin' && response.data.role.name !== '') {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      navigate('/')
    }
  };

  fetchUserData();
}, [token]);


  return (
    <div>
        {itemsData.length ?
        itemsData.map((item: any) => (
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
          )):
          <p>Тут пусто...

            <br />
            Пользователи не размещали объявления
          </p>
    }
      
    </div>
  );
};
