export const filterItems = (
  searchText: string,
  selectValue: string,
  listOfItems: { id: number; attributes: { title: string; userId: number; type: string } }[]
) => {
  return listOfItems.filter((item) => {
    const matchesSearchText = item.attributes.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectValue === '' || item.attributes.type === selectValue;

    return matchesSearchText && matchesType;
  });
};
