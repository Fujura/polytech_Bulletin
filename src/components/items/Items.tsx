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
import { AnimatePresence } from "framer-motion";

export const Items: FC<IItems> = ({
  token,
  userData,
  setUpdatePage,
  updatePage,
}) => {
  const [confirmItem, setConfirmItem] = React.useState<any[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
  const [isDataFetching, setDataFetching] = React.useState<boolean>(true);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

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
  }, [token, updatePage]);

  const lastItemIndex: number = currentPage * itemsPerPage;
  const firstItemIndex: number = lastItemIndex - itemsPerPage;
  const currentItems: void[] = filteredItems.slice(
    firstItemIndex,
    lastItemIndex
  );

  const paginate = (pageNumber: number) => {
    // if(searchTerm.length > 0){
      
    // }
    setCurrentPage(pageNumber);
    setDataFetching(true);
    setTimeout(() => {
      setDataFetching(false);

    }, 500);
  };

  return (
    <div>
      <Link to={"/"}>
        <img src={arrow} className={style.arrow} />
      </Link>

      <SearchItem itemsData={confirmItem} setFiltredItems={setFilteredItems} setDataFetching ={setDataFetching} searchTermOptions={{ searchTerm, setSearchTerm }} />
      {isDataFetching ? (
        <Loading />
      ) : filteredItems.length ? (
        <>
          <div className={style.items__Container}>
            <AnimatePresence>
              {currentItems.map((item: any) => (
                <Item
                  key={item.id}
                  options={{
                    itemId: item.id,
                    username:
                      item.attributes.user?.data?.attributes?.username || "",
                    title: item.attributes.title,
                    type: item.attributes.type,
                    description: item.attributes.description,
                    userAvatar:
                      item.attributes.user?.data?.attributes?.avatarUrl || "",
                    token: token,
                    userId: item.attributes.user?.data?.id || "",
                    setUpdatePage: setUpdatePage,
                  }}
                  userData={userData}
                />
              ))}
            </AnimatePresence>
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
