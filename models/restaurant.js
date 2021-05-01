const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    products: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
    ]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
