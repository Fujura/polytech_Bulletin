import axios from "axios";
import React, { FC } from "react";
import { link } from "../../api/link";
import { useCookies } from "react-cookie";
import styles from "/src/styles/Message.module.css";
import { IMessage } from "../../interfaces/IMessage";

export const Message:FC<IMessage> = ({userData}) => {
  const [cookie] = useCookies(["jwt"]);
  const [itemsData, setItemsData] = React.useState<[]>([]);

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
