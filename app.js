//dependencies
require('dotenv').config()
const express = require( 'express' ) 
const mongoose = require('mongoose')
const config = require('config');
const chalk = require('chalk')

//Import Middleware
const setMiddlewares = require('./middleware/middleware')

//Import Routes
const setRoutes = require('./routes/routes')

const MongoDB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster01.rr76l.mongodb.net/exp-blog?retryWrites=true&w=majority` 

const app = express()

//setup ViewEngine
app.set('view engine', 'ejs')
app.set('views', 'views')

//using middlewares from middleware directory
setMiddlewares(app)

//using routes from routes directory
setRoutes(app)

app.use((req,res,next) => {
    let error = new Error('404 page not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if(error.status === 404){
        return res.render('pages/error/404', {flashMessage : {}})
    }
    console.log(error);
    return res.render('pages/error/500', {flashMessage : {}})
})

const PORT = process.env.PORT || 8080
mongoose.connect( MongoDB_URI,{useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false})
.then( () => {
    console.log(chalk.yellow('Database Connected...'));
    app.listen(PORT, () => {
        console.log(chalk.yellowBright(`Server is running on Port ${PORT}...`));
    })
})
.catch( e => {
    return console.log(e);
})

