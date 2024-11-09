export const usePagination = () => {
  const showItems = [5, 10, 20, 50, 100];

  const generateShowItemOptions = (items = []) => {
    let option = [];
    if (Array.isArray(items) && items.length) {
      option = items.map((item) => {
        return {
          text: item,
          value: item,
        };
      });
    } else {
      option = showItems.map((item) => {
        return {
          text: item,
          value: item,
        };
      });
    }

    return option;
  };

  return {
    showItems,
    generateShowItemOptions,
  };
};
