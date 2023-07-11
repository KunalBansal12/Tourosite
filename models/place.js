const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    title: String,
    image: String,
    known_for: String,
    description: String,
    season: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

PlaceSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Place', PlaceSchema);