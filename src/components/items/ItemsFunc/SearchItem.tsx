import React, { ChangeEvent, FC, useEffect } from "react";
import searchIcon from "/src/assets/search.svg";
import style from "/src/styles/Items.module.css";
import { filterItems } from "./filterItems";
import { ISearchItem } from "../../../interfaces/Items/ISearchItem";
import { Link } from "react-router-dom";

export const SearchItem: FC<ISearchItem> = ({
  itemsData,
  setFiltredItems,
  setDataFetching,
  searchTermOptions: { searchTerm, setSearchTerm },
}) => {
  const [selectValue, setSelectValue] = React.useState<string>("");

  useEffect(() => {
    setDataFetching(true);
  
    const debounce = setTimeout(() => {
      let filteredItems;
  
      if (!!searchTerm.length && !!selectValue.length) {
        filteredItems = filterItems(searchTerm, selectValue, itemsData);
      } else if (!!searchTerm.length) {
        filteredItems = itemsData.filter((item) =>
          item.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        filteredItems = itemsData;
      }
  
      setFiltredItems(filteredItems);
      setDataFetching(false);
    }, 500);
  
    return () => clearTimeout(debounce);
  }, [searchTerm, selectValue, itemsData]);
  
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
          <option value="" className={style.option}>Тип объявления</option>
          <option value="Работа" className={style.option}>
            Вакансия
          </option>
          <option value="Резюме" className={style.option}>
            Резюме
          </option>
          <option value="Покупка" className={style.option}>
            Покупка
          </option>
          <option value="Продажа" className={style.option}>
            Продажа
          </option>
        </select>
      </div>
      <Link to={"/items/addItem"}>Разместить свое объявление</Link>
    </div>
  );
};
