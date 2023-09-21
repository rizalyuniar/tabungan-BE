const express = require('express')
const router = express.Router()
const nasabahRouter = require('../routes/nasabah')

router.use('/nasabah', nasabahRouter);

module.exports = router