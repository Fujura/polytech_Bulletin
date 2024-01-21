export const filterItems = (
    searchText: string,
    listOfItems: { id: number; attributes: { title: string; userId: number } }[]
  ) => {
    if (!searchText) {
      return listOfItems;
    }
    return listOfItems.filter((item) =>
      item.attributes.title.toLowerCase().includes(searchText.toLowerCase())
    );
  };


