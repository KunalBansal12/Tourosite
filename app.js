const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const methodOverride = require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user');

const userRoutes=require('./routes/user');
const places=require('./routes/places');
const reviews=require('./routes/reviews');
const user = require('./models/user');

mongoose.set("strictQuery",false);
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/attraction');
    console.log("MONGO CONNECTION OPEN!!")
}

const app = express();

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig={
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/',userRoutes)
app.use('/places',places)
app.use('/places/:id/reviews',reviews)

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Oh no!! Something went wrong'
    res.status(statusCode).render('error',{err})
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})