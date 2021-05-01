const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('products');
        res.send(restaurants);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', getRestaurant, (req, res) => {
    res.json(res.restaurant);
});

router.post('/', async (req, res) => {
    const restaurant = new Restaurant({
        name: req.body.name,
        address: req.body.address,
    });

    try{
        const newRestaurant = await restaurant.save();
        res.status(201).json(newRestaurant);
    }catch (err){
        res.status(400).json({message: err.message});
    }


});

router.patch('/:id', getRestaurant, async (req, res) => {
    if(req.body.name != null){
        res.restaurant.name = req.body.name;
    }

    if(req.body.address != null){
        res.restaurant.address = req.body.address;
    }

    if(req.body.products != null){
        res.restaurant.products = req.body.products;
    }

    try{
        const updatedRestaurant = await res.restaurant.save();
        res.json(updatedRestaurant);
    }catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', getRestaurant, async (req, res) => {
    try{
        await res.restaurant.remove();
        res.json({message: `Successfully deleted restaurant "${res.restaurant.name}"`})
    }catch (err) {
        res.status(500).json({message: err.message});
    }
});

async function getRestaurant(req, res, next) {
    let restaurant;
    try{
        restaurant = await Restaurant.findById(req.params.id).populate('products');
        if(restaurant == null){
            return res.status(404).json({message: 'Cannot find restaurant'});
        }
    }catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.restaurant = restaurant;
    next();
}

module.exports = router;
