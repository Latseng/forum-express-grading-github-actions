const express = require('express')
const router = express.Router()

// 載入 controller
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin') // 載入 admin.js

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)// 匹配條件多的路由寫在前面
router.use('/', (req, res) => res.redirect('/restaurants'))// fallback 路由，當沒有匹配到路由時，會導向 /restaurants

module.exports = router
