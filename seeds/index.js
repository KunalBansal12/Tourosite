const mongoose = require('mongoose');
const attractions = require('./attractions');
const Place = require('../models/place');

mongoose.set("strictQuery",false);
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/attraction');
    console.log("MONGO CONNECTION OPEN!!")
}


const seedDB = async () => {
    await Place.deleteMany({});
    for (let i = 0; i < 40; i++) {
        const plac = new Place({
            author: "64ac5ddd3e6fd514fd3f49d2",
            title: `${attractions[i].name}`,
            known_for: `${attractions[i].known_for}`,
            description: `${attractions[i].description}`,
            season: `${attractions[i].best_time}`,
            image: `${attractions[i].image}`
        })
        await plac.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})