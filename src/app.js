const express = require('express')
const path = require('path')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forcast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Define handlebars engine and views engine
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup staic directories
app.use(express.static(publicDirectoryPath))

// Routes
app.get('', (req, res) => {
    return res.render('index', {
        title: 'Weather',
        name: 'Ahad'
    })
})

app.get('/about', (req, res) => {
    return res.render('about', {
        title: 'About Me',
        name: 'Ahad'
    })
})

app.get('/help', (req, res) => {
    return res.render('help', {
        title: 'Help Page',
        name: 'Ahad'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "You must provide and address"
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error){
            return res.send({error})
        }
        forcast(latitude, longitude, (error, forcastData) => {
            if(error){
                return res.send({error})
            }
            return res.send({
                forecast: forcastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    return res.render('404', {
        title: '404',
        name: 'Ahad',
        errorMessage: 'Help Article Not Found'
    })
})

app.get('*', (req, res) => {
    return res.render('404', {
        title: '404',
        name: 'Ahad',
        errorMessage: 'Page Not Found'
    })
})

app.listen(port, () => {
    console.log(`Server is up in port ${port}`);
})