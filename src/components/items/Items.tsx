import axios from "axios";
import React, { FC } from "react";
import { link } from "../../api/link";
import { IItems } from "../../interfaces/Items/IItems";
import { Item } from "./Item";
import style from "/src/styles/Items.module.css";
import { filterItems } from "./ItemsFunc/filterItems";
import { Link } from "react-router-dom";
import arrow from "/src/assets/arrow-back.svg";

export const Items: FC<IItems> = ({ token }) => {
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
  const [confirmItem, setConfirmItem] = React.useState<any[]>([]);
  const [refreshPage, setRefresh] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [filteredItems, setFilteredItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${link}/api/items?populate=*`);
        setItemsData(data.data);

        // Move the following line inside the try block
        setConfirmItem(
          data.data.filter((item: any) => item.attributes.isConfirm === true)
        );
      } catch (error) {
        console.error({ error });
      }
    };

    fetchData();
  }, [token, refreshPage]);

  React.useEffect(() => {
    const Debounce = setTimeout(() => {
      const filteredItems = filterItems(searchTerm, confirmItem);
      setFilteredItems(filteredItems);
    }, 400);

    return () => clearTimeout(Debounce);
  }, [searchTerm, itemsData]);

  return (
    <div>
      <Link to={"/"}>
        <img src={arrow} className={style.arrow} />
      </Link>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          autoFocus
          autoComplete="off"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to={"/items/addItem"}>Разместить свое объявление</Link>
      </div>

      {filteredItems && filteredItems.length ? (
        <div className={style.items__Container}>
          {filteredItems.map((item: any) => (
            <Item
              key={item.id}
              itemId={item.id}
              refreshPage={refreshPage}
              username={item.attributes.user?.data?.attributes?.username || ""}
              title={item.attributes.title}
              type={item.attributes.type}
              description={item.attributes.description}
              userAvatar={
                item.attributes.user?.data?.attributes?.avatarUrl || ""
              }
              token={token}
              userId={item.attributes.user?.data?.id || ""}
              setRefresh={setRefresh}
            />
          ))}
        </div>
      ) : (
        <p>Объявлений не найдено!</p>
      )}
    </div>
  );
};
