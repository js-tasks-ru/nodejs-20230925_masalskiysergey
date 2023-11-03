const Product = require('./../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  try {
    ctx.body = {
      products: (await Product.find({ subcategory: subcategory })).map(product => {
        return {
          id: product._id.toString(),
          title: product.title,
          images: product.images,
          category: product.category.toString(),
          subcategory: product.subcategory.toString(),
          price: product.price,
          description: product.description,
        };
      }),
    };
  } catch (err) {
    ctx.throw(err);
  }
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {
    products: (await Product.find()).map(item => {
      return {
        id: item._id.toString(),
        title: item.title,
        images: item.images,
        category: item.category.toString(),
        subcategory: item.subcategory.toString(),
        price: item.price,
        description: item.description,
      };
    }),
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
      product: {
        id: findProduct._id.toString(),
        title: findProduct.title,
        description: findProduct.description,
        price: findProduct.price,
        category: findProduct.category.toString(),
        subcategory: findProduct.subcategory.toString(),
        images: findProduct.images,
      },
    };

    ctx.status = 200;
  } catch (err) {
    ctx.body = err;
    ctx.status = 400;
  }

  next();
};
