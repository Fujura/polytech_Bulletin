import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { link } from "../../api/link";
import { IItems } from "../../interfaces/Items/IItems";
import { Item } from "./Item/Item.tsx";
import style from "/src/styles/Items.module.css";
import { Link, useParams } from "react-router-dom";
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
  const [isDataFetching, setDataFetching] = React.useState<boolean>(true);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [itemsData, setItemsData] = useState<any[any]>([]);
  const [paginationInfo, setPagInfo] = useState<any[any]>({
    pageCount: 1,
    page: 1,
  });
  const [typeFilterData, setTypeFilterData] = React.useState<unknown>();
  const [selectValue, setSelectValue] = React.useState<string>("");

  let { id: ID, typeId: typeID } = useParams();

  const fetchItemsData = async () => {
    setDataFetching(true);
    // if(!typeID){
    //   ID = '1'
    // }
    // if(!!ID){
    //   console.log(ID);
    let response;
    let filtredConfirmItems;

    if (!!typeID) {      
      try {
        response = await axios.get(`${link}/api/items?populate=*`);
        filtredConfirmItems = response.data.data.filter(
          (item: any) =>
            item.attributes.isConfirm === true &&
            item.attributes.item_type.data.id == selectValue
        );
        setPagInfo({
          pageCount: 1,
          page: 1,
        });        
        setItemsData(filtredConfirmItems);
        setTimeout(() => {
          setDataFetching(false);
        }, 300);
        console.log(1);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        response = await axios.get(
          `${link}/api/items?populate=*&pagination[page]=${ID}&pagination[pageSize]=9`
        );
        console.log(2);

        if (!typeID) {
          filtredConfirmItems = response.data.data.filter(
            (item: any) => item.attributes.isConfirm === true
          );
        } 
        setPagInfo(response.data.meta.pagination);
        
// else {
//           filtredConfirmItems = response.data.data.filter(
//             (item: any) =>
//               item.attributes.isConfirm === true &&
//               item.attributes.item_type.data.id == selectValue
//           );
        setItemsData(filtredConfirmItems);
        setTimeout(() => {
          setDataFetching(false);
        }, 300);
      
      } catch (error) {
        console.log(error);
      }
    }
  };

  //   else{
  //     return
  //   }

  // };
  console.log(paginationInfo);
  console.log(itemsData);

  useEffect(() => {
    fetchItemsData();
  }, [token, ID, typeID, updatePage, selectValue, typeFilterData]);

  return (
    <div>
      <Link to={"/"}>
        <img src={arrow} className={style.arrow} />
      </Link>

      <SearchItem
        itemsData={itemsData}
        // setFiltredItems={setFilteredItems}
        select={{ selectValue, setSelectValue }}
        func={{ typeFilterData, setTypeFilterData }}
        typeID={typeID}
        setDataFetching={setDataFetching}
        currentPage={paginationInfo?.page}
        searchTermOptions={{ searchTerm, setSearchTerm }}
      />
      {isDataFetching ? (
        <div>
          <Loading />
        </div>
      ) : itemsData.length ? (
        <>
          <div className={style.items__Container}>
            <AnimatePresence>
              {itemsData.map((item: any) => (
                <Item
                  key={item.id}
                  options={{
                    itemId: item.id,
                    username:
                      item.attributes.user?.data?.attributes?.username || "",
                    title: item.attributes.title,
                    type: item.attributes.item_type.data.attributes.type,
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

          <Pagination
            currentPage={Number(ID)}
            pageCount={paginationInfo.pageCount}
          />
        </>
      ) : (
        <p className={style.status}>Объявлений не найдено!</p>
      )}
    </div>
  );
};
