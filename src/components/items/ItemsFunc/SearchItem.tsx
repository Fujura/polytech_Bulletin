import React, { FC } from "react";
import searchIcon from "/src/assets/search.svg";
import style from "/src/styles/Items.module.css";
import { filterItems } from "./filterItems";
import { ISearchItem } from "../../../interfaces/Items/ISearchItem";
import { Link } from "react-router-dom";

export const SearchItem: FC<ISearchItem> = ({itemsData, setFiltredItems}) => {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  React.useEffect(() => {
    const Debounce = setTimeout(() => {
      const filteredItems = filterItems(searchTerm, itemsData);
      setFiltredItems(filteredItems);
    }, 400);

    return () => clearTimeout(Debounce);
  }, [searchTerm, itemsData]);
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
      <Link to={"/items/addItem"}>Разместить свое объявление</Link>
    </div>
  );
};
