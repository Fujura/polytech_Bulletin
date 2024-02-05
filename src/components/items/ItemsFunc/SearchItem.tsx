import React, { ChangeEvent, FC } from "react";
import searchIcon from "/src/assets/search.svg";
import style from "/src/styles/Items.module.css";
// import { filterItems } from "./filterItems";
import { ISearchItem } from "../../../interfaces/Items/ISearchItem";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { link } from "../../../api/link";

export const SearchItem: FC<ISearchItem> = ({
  // itemsData,
  // // setFiltredItems,
  // typeID,
  func: {typeFilterData, setTypeFilterData},
  select :{selectValue, setSelectValue},

  currentPage,
  // setDataFetching,
  searchTermOptions: { searchTerm, setSearchTerm },
}) => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   setDataFetching(true);

  //   const debounce = setTimeout(() => {
  //     let filteredItems;

  //     if (!!searchTerm.length) {
  //       // Filter by search text
  //       filteredItems = filterItems(searchTerm, selectValue, itemsData);
  //     } else {
  //       // No search text, show all items
  //       filteredItems = itemsData;
  //     }

  //     // setFiltredItems(filteredItems);
  //     setDataFetching(false);
  //   }, 500);

  //   return () => clearTimeout(debounce);
  // }, [searchTerm, selectValue, itemsData]);

  React.useEffect(() => {
    console.log(selectValue);
    console.log(typeFilterData);
    
    (async () => {
      try {
        const response = await axios.get(
          `${link}/api/item-types/${selectValue}?populate=*`
        );
        setTypeFilterData(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
    
    if(!!selectValue) navigate(`/items/page/${currentPage}/filtred-type/${selectValue}`);

    if(selectValue === undefined){
      return
    } else if(selectValue === '') {
      navigate(`/items/page/${currentPage}`);
    }
  }, [selectValue, currentPage]);

  return (
    <div>
      <div className={style.search__Container}>
        <img src={searchIcon} alt="search icon" className={style.searchIcon} />
        <input
          type="text"
          value={searchTerm}
          autoComplete="off"
          onChange={(e) => setSearchTerm(e.target.value)}
          className={style.search}
        />
      </div>

      <div>
        <select
          name=""
          id=""
          className={style.select}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSelectValue(e.target.value)
          }
        >
          <option value="" className={style.option}>
              Тип объявления
          </option>
          <option value="1" className={style.option}>
            Резюме
          </option>
          <option value="2" className={style.option}>
            Вакансия
          </option>
          <option value="3" className={style.option}>
            Продажа
          </option>
          <option value="4" className={style.option}>
            Покупка
          </option>
        </select>
      </div>
      <Link to={"/items/addItem"}>Разместить свое объявление</Link>
    </div>
  );
};
