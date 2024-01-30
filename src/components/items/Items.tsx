import axios from "axios";
import React, { FC } from "react";
import { link } from "../../api/link";
import { IItems } from "../../interfaces/Items/IItems";
import { Item } from "./Item/Item.tsx";
import style from "/src/styles/Items.module.css";
import { Link } from "react-router-dom";
import arrow from "/src/assets/arrow-back.svg";
import { SearchItem } from "./ItemsFunc/SearchItem";
import { Loading } from "../Loading/Loading";
import { Pagination } from "./Pagination/Pagination.tsx";

export const Items: FC<IItems> = ({ token }) => {
  const [confirmItem, setConfirmItem] = React.useState<any[]>([]);
  const [refreshPage, setRefresh] = React.useState<boolean>(false);
  const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
  const [isDataFetching, setDataFetching] = React.useState<boolean>(true);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage] = React.useState<number>(9);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${link}/api/items?populate=*`);
        const confirmedItems = data.data.filter(
          (item: any) => item.attributes.isConfirm === true
        );
        setConfirmItem(confirmedItems);
        setFilteredItems(confirmedItems);

        setDataFetching(false);
      } catch (error) {
        console.error({ error });
        setDataFetching(false);
      }
    })();
  }, [token, refreshPage]);

  const lastItemIndex: number = currentPage * itemsPerPage;
  const firstItemIndex: number = lastItemIndex - itemsPerPage;
  const currentItems: void[] = filteredItems.slice(
    firstItemIndex,
    lastItemIndex
  );
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Link to={"/"}>
        <img src={arrow} className={style.arrow} />
      </Link>

      <SearchItem itemsData={confirmItem} setFiltredItems={setFilteredItems} />
      {isDataFetching ? (
        <Loading />
      ) : filteredItems.length ? (
        <>
          <div className={style.items__Container}>
            {currentItems.map((item: any) => (
              <Item
                key={item.id}
                itemId={item.id}
                refreshPage={refreshPage}
                username={
                  item.attributes.user?.data?.attributes?.username || ""
                }
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
          {filteredItems.length > itemsPerPage ? (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredItems.length}
              paginate={paginate}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <p className={style.status}>Объявлений не найдено!</p>
      )}
    </div>
  );
};
