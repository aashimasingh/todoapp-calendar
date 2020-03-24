const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('debug', true);

const eventSchema = new Schema({
    event_date: String,
    event_description: String
});

module.exports = mongoose.model('Eventdes', eventSchema, 'eventdes');