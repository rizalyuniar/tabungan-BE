CREATE DATABASE tabungan_api;

CREATE TABLE nasabah(
    rekening VARCHAR(255) PRIMARY key,
    nama VARCHAR(255) NOT NULL,
    nik INT NOT NULL,
    no_hp VARCHAR(255) NOT NULL
);

CREATE TABLE tabungan(
    id VARCHAR(255) PRIMARY key,
    no_rekening varchar references nasabah on update cascade on delete cascade,
    saldo VARCHAR(255) default('0')
);

CREATE TABLE mutasi(
    id VARCHAR(255) PRIMARY key,
    no_rekening varchar references nasabah on update cascade on delete cascade,
    waktu VARCHAR(255),
    kode_transaksi VARCHAR(255),
    nominal VARCHAR(255)
);