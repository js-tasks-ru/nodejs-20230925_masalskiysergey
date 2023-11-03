const Product = require('./../models/Product');
const mongoose = require('mongoose');
const productMapper = require('./../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  try {
    ctx.body = {
      products: (await Product.find({ subcategory: subcategory })).map(product => productMapper(product)),
    };
  } catch (err) {
    ctx.throw(err);
  }
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {
    products: (await Product.find()).map(item => productMapper(item)),
  };
};

module.exports.productById = async function productById(ctx, next) {
  try {
    const id = mongoose.Types.ObjectId(ctx.params.id);
    const findProduct = await Product.findById(id.toString());

    if (!findProduct) {
      ctx.status = 404;
      ctx.body = 'Product not found';
      return;
    }

    ctx.body = {
      product: productMapper(findProduct),
    };

    ctx.status = 200;
  } catch (err) {
    ctx.body = err;
    ctx.status = 400;
  }

  next();
};
