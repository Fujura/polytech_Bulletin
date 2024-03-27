import axios from "axios";
import React, { FC, useEffect, useState, useMemo } from "react";
import { link } from "../../api/link";
import { IItems } from "../../interfaces/Items/IItems";
import { Item } from "./Item/Item.tsx";
import style from "/src/styles/Items.module.css";
import { Link, useParams } from "react-router-dom";
import arrow from "/src/assets/arrow-back.svg";
import { SearchItem } from "./ItemsFunc/SearchItem";
import { Loading } from "../Loading/Loading";
import { Pagination } from "./Pagination/Pagination.tsx";
// import { AnimatePresence } from "framer-motion";

export const Items: FC<IItems> = React.memo(
  ({ token, userData, setUpdatePage }) => {
    const [isDataFetching, setDataFetching] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [itemsData, setItemsData] = useState<any[]>([]);
    const [paginationInfo, setPagInfo] = useState<any>({
      pageCount: 1,
      page: 1,
    });
    const [selectValue, setSelectValue] = useState<string>("");
    const { id: ID, typeId: typeID } = useParams();
    const [typeFilterData, setTypeFilterData] = React.useState<unknown>();

    const fetchItemsData = async () => {
      setDataFetching(true);
      try {
        let response;
        let filtredConfirmItems;

        if (!!typeID && !!selectValue) {
          response = await axios.get(`${link}/api/items?populate=*`);
          filtredConfirmItems = response.data.data.filter(
            (item: any) =>
              item.attributes.isConfirm === true &&
              item.attributes.item_type.data.id == selectValue
          );
          setPagInfo({ pageCount: 1, page: 1 });
        } else {
          response = await axios.get(
            `${link}/api/items?populate=*&pagination[page]=${ID}&pagination[pageSize]=9`
          );
          filtredConfirmItems = response.data.data.filter(
            (item: any) => item.attributes.isConfirm === true
          );
          setPagInfo(response.data.meta.pagination);
        }

        setItemsData(filtredConfirmItems);
      } catch (error) {
        console.log(error);
      } finally {
        setDataFetching(false);
      }
    };

    useEffect(() => {
      fetchItemsData();
    }, [ID, typeID, selectValue]);

    const renderItems = useMemo(() => {
      return (
        <>
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
        </>
      );
    }, [itemsData, token, setUpdatePage, userData]);

    return (
      <>
        <div>
          <Link to={"/"}>
            <img src={arrow} className={style.arrow} />
          </Link>

          <SearchItem
            itemsData={itemsData}
            select={{ selectValue, setSelectValue }}
            typeID={typeID}
            func={{ typeFilterData, setTypeFilterData }}
            setDataFetching={setDataFetching}
            currentPage={paginationInfo?.page}
            searchTermOptions={{ searchTerm, setSearchTerm }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {isDataFetching && (
              <>
                <div
                  style={{
                    position: "relative",
                    zIndex: "3",
                    margin: "0 auto",
                    marginBottom: "-90px",
                  }}
                >
                  <Loading />
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: "90vw",
                    margin: "0 4.5%",
                    height: "100%",
                    backgroundColor: "transparent",
                    opacity: "95%",
                    backdropFilter: "blur(5px)",
                    zIndex: "2",
                    borderRadius: "24px",
                  }}
                ></div>
              </>
            )}
            {itemsData.length > 0 ? (
              <>
                <div className={style.items__Container} style={{ zIndex: "1" }}>
                  {renderItems}
                </div>
                <Pagination
                  currentPage={Number(ID)}
                  pageCount={paginationInfo.pageCount}
                />
              </>
            ) : (
              !isDataFetching && (
                <p className={style.status}>Объявлений не найдено!</p>
              )
            )}
          </div>
        </div>
      </>
    );
  }
);
