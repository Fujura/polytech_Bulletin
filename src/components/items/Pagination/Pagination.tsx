import { FC } from "react";
import styles from "/src/styles/Pagination.module.css";
import { IPagination } from "../../../interfaces/Items/Pagination/IPagination";
import { Link } from "react-router-dom";
export const Pagination: FC<IPagination> = ({
  pageCount,
  currentPage
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= pageCount; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div>
      <ul className={styles.pagination}>
        {pageNumbers.map((num) => (
          <Link to={`/items/page/${num}`} key={num}
          >
          <button
            className={styles.page__Item}
            style={currentPage === num ? {backgroundColor: 'gray'} : {}}
          >
            {num}            
          </button>
          </Link>
        ))}
      </ul>
    </div>
  );
};
