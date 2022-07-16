const mongoose = require('mongoose');

const NotifyModel = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true, unique: true, trim: true },
});

module.exports = mongoose.model('Notify', NotifyModel);
