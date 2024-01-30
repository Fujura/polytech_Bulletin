import { FC } from "react";
import styles from "/src/styles/Pagination.module.css";
import { IPagination } from "../../../interfaces/Items/Pagination/IPagination";
export const Pagination: FC<IPagination> = ({
  itemsPerPage,
  totalItems,
  paginate,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      <ul className={styles.pagination}>
        {pageNumbers.map((num) => (
          <button
            className={styles.page__Item}
            onClick={() => paginate(num)}
            key={num}
          >
            {num}
          </button>
        ))}
      </ul>
    </div>
  );
};
