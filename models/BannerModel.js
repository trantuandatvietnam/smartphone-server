const mongoose = require('mongoose');

const Banner = new mongoose.Schema({
    bannerLarge: { type: Array, default: [] },
    bannerSmall: { type: Array, default: [] },
});

module.exports = mongoose.model('Banner', Banner);
