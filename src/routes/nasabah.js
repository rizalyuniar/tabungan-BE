const express = require('express');
const router = express.Router();
const nasabahController = require('../controller/nasabah');
const {protect} = require('../middleware/auth');

router.post("/daftar", nasabahController.daftar);
router.post("/tabungan", nasabahController.tabungan);
router.put("/tabung", protect, nasabahController.tambahTabungan);
router.put("/tarik", protect, nasabahController.tarikTabungan);
router.get("/saldo/:no_rekening", nasabahController.saldo);
router.get("/mutasi/:no_rekening", nasabahController.mutasi);

module.exports = router