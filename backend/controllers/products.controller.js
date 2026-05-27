const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

const getProducts = (req, res) => {
  let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  const { search, category, sort } = req.query;

  if (search) {
    const term = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }

  if (category) {
    products = products.filter(p => p.category === category);
  }

  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  }

  res.status(200).json(products);
};

const getProductById = (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found', code: 'PRODUCT_NOT_FOUND' });
  }

  res.status(200).json(product);
};

module.exports = { getProducts, getProductById };
