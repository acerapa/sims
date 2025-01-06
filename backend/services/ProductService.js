const groupCategories = (cts) => {
  const categories = [...cts];
  console.log("values: ", categories.map((c) => c.id).join(", "));
  categories.forEach((category, ndx) => {
    if (category.dataValues.general_cat) {
      parentCategoryIndex = categories.findIndex(
        (cat) => cat.id == category.dataValues.general_cat
      );

      if (parentCategoryIndex > -1) {
        if (!categories[parentCategoryIndex].dataValues.sub_categories) {
          categories[parentCategoryIndex].dataValues.sub_categories = [];
        }

        categories[parentCategoryIndex].dataValues.sub_categories.push(
          category
        );
      }
    }
  });

  return [...categories];
};

module.exports = {
  groupCategories,
};
