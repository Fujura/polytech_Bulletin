import axios from "axios";
import React from "react";
import { link } from "../../api/link";
import { useCookies } from "react-cookie";
import styles from "/src/styles/Message.module.css";

export const Message = () => {
  const [cookie] = useCookies(["jwt"]);
  const [itemsData, setItemsData] = React.useState<[]>([]);
  const [userData, setUserData] = React.useState<{ role: { name: string } }>({
    role: {
      name: "",
    },
  });
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${link}/api/items?populate=*`,
        {
            headers: {
              Authorization: `Bearer ${cookie.jwt}`,
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
  }, [cookie]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${link}/api/users/me?populate=role`, {
          headers: {
            Authorization: `Bearer ${cookie.jwt}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [cookie.jwt]);

  return (
    <>
      {userData && itemsData.length && userData.role && userData.role.name === "Admin" ? (
        <div className={styles.circle}></div>
      ) : (
        <></>
      )}
    </>
  );
  
  
};
