export interface ISearchItem {
  itemsData: any[];
  setFiltredItems: any;
  setDataFetching: React.Dispatch<React.SetStateAction<boolean>>;
  searchTermOptions: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  };
}
