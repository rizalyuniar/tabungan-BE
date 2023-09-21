const {
  findNik,
  createNasabah,
  createTabungan,
  selectTabungan,
  findId,
  updateTabungan,
  selectSaldo,
  findRekening,
  findHp,
  selectNasabah,
  findNoRekening,
  createMutasi,
  selectMutasi
} = require("../model/nasabah");

const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken')

const nasabahController = {
  daftar: async (req, res) => {
    try {
      const { nama, nik, no_hp } = req.body;
      const { rowCount: rowCountNik } = await findNik(nik);
      const { rowCount: rowCountHp } = await findHp(no_hp);

      function generateAccountNumber() {
        return Math.floor(Math.random() * 1000000);
      }
      const rekening = generateAccountNumber();

      if (rowCountNik > 0) {
        return res.status(400).json({
          remark: "NIK sudah digunakan.",
        });
      }
      if (rowCountHp > 0) {
        return res.status(400).json({
          remark: "no_hp sudah digunakan.",
        });
      }

      let data = {
        rekening,
        nama,
        nik,
        no_hp
      };

      await createNasabah(data);
      const nasabah = await selectNasabah(rekening)
      return res.status(200).json({
        Message: "Daftar rekening berhasil",
        Data: {
          rekening: nasabah.rows[0].rekening
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        Message: "Terjadi kesalahan saat mendaftar rekening.",
      });
    }
  },
  tabungan: async (req, res, next) => {
    try {
      const { no_rekening, saldo } = req.body;
      const id = uuidv4();
      const { rowCount } = await findRekening(no_rekening);

      if (!rowCount) {
        return res.status(400).json({
          remark: "Nomor rekening tidak dikenali.",
        });
      }

      const data = { id, saldo };
      const payload = { id, saldo };
      const token = authHelper.generateToken(payload);
      console.log(token);

      data.no_rekening = no_rekening;
      createTabungan(data)
        .then((result) => {
          commonHelper.response(res, { token: token }, 200, "Berhasil membuka tabungan");
        })
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 400, "Gagal membuka tabungan");
    }
  },
  tambahTabungan: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const { no_rekening, saldo } = req.body;
      const { rowCount } = await findNoRekening(no_rekening);
      if (!rowCount) {
        return res.status(400).json({
          remark: "Nomor rekening tidak dikenali.",
        });
      }

      const oldData = await selectTabungan(id);
      const oldSaldo = parseFloat(oldData.rows[0].saldo);

      let newData = {};
      if (no_rekening) {
        newData.no_rekening = no_rekening;
      }

      const newSaldo = parseFloat(saldo || 0);
      const saldoBaru = oldSaldo + newSaldo;

      const data = {
        id,
        no_rekening: newData.no_rekening || oldData.rows[0].no_rekening,
        saldo: saldoBaru,
      };
      await updateTabungan(data)

      // mutasi
      const id_mutasi = uuidv4();
      const waktu = new Date();
      const kodeTransaksi = "C";
      const nominal = newSaldo;
      const mutasiData = {
        id: id_mutasi,
        waktu,
        kode_transaksi: kodeTransaksi,
        no_rekening: no_rekening,
        nominal,
      };
      await createMutasi(mutasiData)

        .then(async (result) => {
          const updatedData = await selectTabungan(id);
          const updatedSaldo = parseFloat(updatedData.rows[0].saldo);
          commonHelper.response(res, { saldo_baru: updatedSaldo }, 200, "Saldo anda berhasil ditambahkan");
        })
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Gagal Menambah Saldo");
    }
  },
  tarikTabungan: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const { no_rekening, saldo } = req.body;
      const { rowCount } = await findNoRekening(no_rekening);
      if (!rowCount) {
        return res.status(400).json({
          remark: "Nomor rekening tidak dikenali.",
        });
      }
      // tabungan
      const oldData = await selectTabungan(id);
      const oldSaldo = parseFloat(oldData.rows[0].saldo);
      let newData = {};
      if (no_rekening) {
        newData.no_rekening = no_rekening;
      }
      const newSaldo = parseFloat(saldo || 0);
      const saldoBaru = oldSaldo - newSaldo;
      const data = {
        id,
        no_rekening: newData.no_rekening || oldData.rows[0].no_rekening,
        saldo: saldoBaru,
      };
      await updateTabungan(data)

      // mutasi
      const id_mutasi = uuidv4();
      const waktu = new Date();
      const kodeTransaksi = "D";
      const nominal = newSaldo;
      const mutasiData = {
        id: id_mutasi,
        waktu,
        kode_transaksi: kodeTransaksi,
        no_rekening: no_rekening,
        nominal,
      };
      await createMutasi(mutasiData)

        .then(async (result) => {
          const updatedData = await selectTabungan(id)
          const updatedSaldo = parseFloat(updatedData.rows[0].saldo);
          commonHelper.response(res, { saldo_baru: updatedSaldo }, 200, "Berhasil tarik saldo");
        })
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Gagal menarik saldo");
    }
  },
  saldo: async (req, res, next) => {
    try {
      const no_rekening = req.params.no_rekening;
      const { rowCount } = await findNoRekening(no_rekening);

      if (!rowCount) {
        return res.json({
          Message: "Rekening tidak ditemukan",
        });
      }
      selectSaldo(no_rekening)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Berhasil menampilkan saldo sesaui rekening");
        })
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Gagal menampilkan saldo");
    }
  },
  mutasi: async (req, res, next) => {
    try {
      const no_rekening = req.params.no_rekening;
      const { rowCount } = await findNoRekening(no_rekening);

      if (!rowCount) {
        return res.json({
          Message: "Rekening tidak ditemukan",
        });
      }

      selectMutasi(no_rekening)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Berhasil menampilkan mutasi sesuai rekening");
        })
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Gagal menampilkan mutasi rekening");
    }
  }
};

module.exports = nasabahController;
