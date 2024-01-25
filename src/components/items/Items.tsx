import axios from "axios";
import React, { FC } from "react";
import { link } from "../../api/link";
import { IItems } from "../../interfaces/Items/IItems";
import { Item } from "./Item";
import style from "/src/styles/Items.module.css";
import { Link } from "react-router-dom";
import arrow from "/src/assets/arrow-back.svg";
import { SearchItem } from "./SearchItem";
import { Loading } from "../Loading/Loading";

export const Items: FC<IItems> = ({ token }) => {
  const [confirmItem, setConfirmItem] = React.useState<any[]>([]);
  const [refreshPage, setRefresh] = React.useState<boolean>(false);
  const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
  const [isDataFetching, setDataFetching] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${link}/api/items?populate=*`);
        const confirmedItems = data.data.filter((item: any) => item.attributes.isConfirm === true);
        setConfirmItem(confirmedItems);
        setFilteredItems(confirmedItems); // Set filtered items initially to all confirmed items
        setDataFetching(false);
      } catch (error) {
        console.error({ error });
      }
    };

    fetchData();
  }, [token, refreshPage]);

  return (
    <div>
      <Link to={"/"}>
        <img src={arrow} className={style.arrow} />
      </Link>

      <SearchItem itemsData={confirmItem} setFiltredItems={setFilteredItems} />
      {isDataFetching ? (
        <Loading />
      ) : filteredItems.length ? (
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
        <p className={style.status}>Объявлений не найдено!</p>
      )}
    </div>
  );
};
