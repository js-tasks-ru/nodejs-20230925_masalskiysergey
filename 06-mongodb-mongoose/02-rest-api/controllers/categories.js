const Category = require('./../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  ctx.body = {
    categories: [...(await Category.find({}))].map(item => {
      return {
        id: item._id.toString(),
        title: item.title,
        subcategories: item.subcategories.map(sub => {
          return {
            id: sub._id.toString(),
            title: sub.title,
          };
        }),
      };
    }),
  };
  ctx.status = 200;

  next();
};
