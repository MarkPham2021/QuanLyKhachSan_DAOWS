'use strict'
const dbmodel = require("./DataBase");

class QuocTich {
    constructor(id, code, quocgia) {

        this.QuocTichId = id;
        this.QuoctichCode = code;
        this.QuocGia = quocgia;
    }
    async list(callback) {
        //trả về danh sách record từ database
        let db = await dbmodel.iNit();
        let sql = "SELECT * FROM DanhSachQuocTich";        
        let [quoctichs, fields] = await db.query(sql);
        return quoctichs;
    }
    async create(val) {
        //chèn record mới vào table 
        let db = await dbmodel.iNit();
        let sql = "INSERT INTO DanhSachQuocTich SET ?";
        let result = await db.execute(sql, val);
        return result;
    }
    async update(val) {
        //cập nhật record vào table
        let db = await dbmodel.iNit();
        let sql = "UPDATE DanhSachQuocTich SET QuocGia  =?  WHERE QuocTichCode = ?";
        let result = db.execute(sql, val);
        return result;
    }
    async read(Quoctichcode) {
        //trả về chi tiết 1 record từ table
        let db = await dbmodel.iNit();
        let sql = "SELECT * FROM DanhSachQuocTich WHERE QuocTichCode = ?";
        let [quoctichs, fields] = await db.execute(sql, [Quoctichcode]);
        return quoctichs;
    }
    async delete(id) {
        //xóa 1 record
        let db = await dbmodel.iNit();
        let sql = "DELETE FROM DanhSachQuocTich WHERE QuocTichID = ?";
        let result =await db.execute(sql, [id]);
        return result;
    }
}
module.exports = QuocTich;

