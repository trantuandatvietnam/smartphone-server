const { Schema } = require('mongoose');

const CardSchema = new Schema({
    card: { type: Array, default: [] },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Card', CardSchema);
