const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Restaurant = require('../models/restaurant');


router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', getProduct, async (req, res) => {
    res.json(res.product);
});

router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });

    try {
        const newProduct = await product.save();
        res.json(newProduct);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.post('/:restaurantId', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });

    try {
        const newProduct = await product.save();
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (restaurant == null) {
            return res.status(404).json({message: 'Cannot find restaurant'})
        }
        restaurant.products.push(newProduct.id);
        const newRestaurant = await restaurant.save();
        res.json(newRestaurant);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.patch('/:id', getProduct, async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name;
    }

    if (req.body.price != null) {
        res.product.price = req.body.price;
    }

    try {
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove();
        res.json({message: `Successfully deleted product "${res.product.name}"`})

    } catch (err) {
        res.status(500).json({message: err.message});

    }
});

async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({message: 'Cannot find product'});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
    res.product = product;
    next();
}

module.exports = router;
