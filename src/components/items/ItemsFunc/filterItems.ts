export const filterItems = (
    searchText: string,
    selectValue: string,
    listOfItems: { id: number; attributes: { title: string; userId: number , type: string} }[]
  ) => {
    // if (!searchText.trim().length &&) {      
    //   return listOfItems;
    // }
    return listOfItems.filter((item) =>
      item.attributes.title.toLowerCase().includes(searchText.toLowerCase() ) && item.attributes.type === selectValue 
    )
  };


