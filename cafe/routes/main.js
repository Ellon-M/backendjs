const express = require('express')
const router = express.Router()
const controllers = require('../controllers')


//set up a get handler for the homepage
//takes in a request, response and a next arguement
router.get('/', async (req, res, next) => {
    const data  = req.context


    const ItmCtr = controllers.item.instance()
     data.Coffee = await ItmCtr.get({category: "Coffee"})
     data.Other = await ItmCtr.get({category: "Other Drinks"})
     data.Pastries = await ItmCtr.get({category: "Pastries"})
     const LoveCtr = controllers.love.instance()
     data.love = await LoveCtr.get({schema: "love"})
     

    res.render('home', data)

})



router.get('/items', async (req, res, next) => {
    const filters = req.query
    const ItmCtr = controllers.item.instance()
    const items = await ItmCtr.get(filters)

    res.json({
        items
    })
})

router.post('/order', async (req, res, next) => {
    const orderData = req.body
    res.json(orderData)
    // const orderCtr = controllers.order.instance()
    // const order = await orderCtr.post(orderData)
    // res.json(order)
})


router.get('/love', async (req, res, next) => {
    const filters = req.query
    const LoveCtr = controllers.love.instance()
    const love = await LoveCtr.get(filters)

    res.json({
        love
    })
})


module.exports = router

