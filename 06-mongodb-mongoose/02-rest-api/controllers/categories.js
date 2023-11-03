const Category = require('./../models/Category');
const categoryMapper = require('./../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  ctx.body = {
    categories: [...(await Category.find({}))].map(item => categoryMapper(item)),
  };
  ctx.status = 200;

  next();
};
