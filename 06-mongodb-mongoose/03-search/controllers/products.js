const Product = require('../models/Product');
const productMapper = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;

  ctx.body = { products: [...(await Product.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })).map(product => productMapper(product))] };
};
