const Pool = require("../config/db");

const findNik = (nik) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM nasabah WHERE nik='${nik}'`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const findHp = (no_hp) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM nasabah WHERE no_hp='${no_hp}'`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const findId = (id) => {
  return new Promise((resolve, reject) =>
      Pool.query(`SELECT id FROM tabungan WHERE id='${id}'`, (error, result) => {
          if (!error) {
              resolve(result)
          } else {
              reject(error)
          }
      })
  )
}

const findRekening = (no_rekening) => {
  return new Promise((resolve, reject) =>
      Pool.query(`SELECT rekening FROM nasabah WHERE rekening='${no_rekening}'`, (error, result) => {
          if (!error) {
              resolve(result)
          } else {
              reject(error)
          }
      })
  )
}

const findNoRekening = (no_rekening) => {
  return new Promise((resolve, reject) =>
      Pool.query(`SELECT no_rekening FROM tabungan WHERE no_rekening='${no_rekening}'`, (error, result) => {
          if (!error) {
              resolve(result)
          } else {
              reject(error)
          }
      })
  )
}

const createNasabah = (data) => {
  const { rekening, nama, nik, no_hp } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `INSERT INTO nasabah(rekening,nama,nik,no_hp) VALUES('${rekening}','${nama}','${nik}','${no_hp}')`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const createTabungan = (data) => {
  const { id, no_rekening, saldo } = data;
  return Pool.query(`INSERT INTO tabungan(id,no_rekening,saldo) VALUES('${id}','${no_rekening}','${saldo}')`);
}

const createMutasi = (mutasiData) => {
  const { id, no_rekening, waktu, kode_transaksi, nominal } = mutasiData;
  return Pool.query(`INSERT INTO mutasi(id,no_rekening,waktu,kode_transaksi,nominal) VALUES('${id}','${no_rekening}','${waktu}','${kode_transaksi}','${nominal}')`);
}

const updateTabungan = (data) => {
  const { id, no_rekening, saldo } = data;
  return Pool.query(`UPDATE tabungan SET no_rekening='${no_rekening}', saldo='${saldo}' WHERE id='${id}'`);
}

const selectNasabah = (rekening) => {
  return Pool.query(`SELECT * FROM nasabah WHERE rekening='${rekening}'`);
}

const selectTabungan = (id) => {
  return Pool.query(`SELECT * FROM tabungan WHERE id='${id}'`);
}

const selectSaldo = (no_rekening) => {
  return Pool.query(`SELECT * FROM tabungan WHERE no_rekening='${no_rekening}'`);
}

const selectMutasi = (no_rekening) => {
  return Pool.query(`SELECT * FROM mutasi WHERE no_rekening='${no_rekening}'`);
}

module.exports = {
  findNik,
  findHp,
  findId,
  findRekening,
  findNoRekening,
  createNasabah,
  createTabungan,
  createMutasi,
  updateTabungan,
  selectNasabah,
  selectTabungan,
  selectSaldo,
  selectMutasi
};
