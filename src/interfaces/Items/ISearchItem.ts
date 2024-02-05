export interface ISearchItem {
  itemsData: any[];
  // setFiltredItems: any;
  setDataFetching: React.Dispatch<React.SetStateAction<boolean>>;
  typeID: any;
  currentPage: number;
  searchTermOptions: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  };

  func: any;
  select: any;
}
