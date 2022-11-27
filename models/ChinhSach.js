'use strict'
const dbmodel = require("./DataBase");
const Util = require('../Until/presentProcess');
class ChinhSach {
    constructor(id,hieuluc, ngayhieuluc, ngayhethieuluc,hesogiakhachtrongnuoc, hesogiakhachnuocngoai,tylephuthu, sokhachluutrutoida) {
        this.ChinhSachID = id;
        this.HieuLuc = hieuluc;
        this.NgayHieuLuc = ngayhieuluc;
        this.NgayHetHieuLuc = ngayhethieuluc;
        this.HeSoGiaKhachTrongNuoc = hesogiakhachtrongnuoc;
        this.HeSoGiaKhachNuocNgoai = hesogiakhachnuocngoai;
        this.TyLePhuThu = tylephuthu;
        this.SoKhachLuuTruToiDa = sokhachluutrutoida;
    }
    async list(){
        //trả về danh sách record từ database (gồm các table liên quan), cách viết này khắc phục sự bất đồng bộ khi render trang HTML
        let db = await dbmodel.iNit();
        let sql = "SELECT * FROM ChinhSach order by ChinhSachID Desc";
        let [chinhsachs, fields] = await db.query(sql);
        return chinhsachs;        
    }    
    async listStatus(st='%%'){
        //trả về danh sách các ChinhSach theo tình trạng hiệu lực: 1-yes/0-No/'%%'-all, hàm này được dùng để gọi chính sách đang hiệu lực khi lập phiếu thuê phòng
        let db = await dbmodel.iNit();
        let sql = "SELECT * FROM ChinhSach WHERE ChinhSach.HieuLuc LIKE ? order by ChinhSachID Desc"; 
        let [chinhsachs, fields] = await db.execute(sql,[st]);
        return chinhsachs;
    }
    async create(val) {
        //chèn record mới vào table 
        let db = await dbmodel.iNit();
        let sql = `INSERT INTO ChinhSach(HieuLuc,NgayHieuLuc,NgayHetHieuLuc,HeSoGiaKhachTrongNuoc,HeSoGiaKhachNuocNgoai,TyLePhuThu,SoKhachLuuTruToiDa) 
        VALUES (?,?,?,?,?,?,?) `;
        try {
            let result = await db.execute(sql, val);
            return { status: 200, summary: result };
        } catch (error) {
            return { status: 404, summary: error };
        }
    }
    async update(val) {
        //cập nhật record vào table
        let db = await dbmodel.iNit();
        let sql = `UPDATE ChinhSach SET SoKhachLuuTruToiDa =?, TyLePhuThu  =?, HeSoGiaKhachTrongNuoc = ?, HeSoGiaKhachNuocNgoai = ?, 
        HieuLuc = ?, NgayHieuLuc = ?, NgayHetHieuLuc = ? WHERE ChinhSachID = ?`;
        try {
            let result = await db.execute(sql, val);
            return { status: 200, data: result };
        } catch (error) {
            return { status: 404, error: error };
        }
        
    }
    async read(id) {
        //trả về chi tiết 1 record từ table
        let db = await dbmodel.iNit();
        let sql = "select * FROM ChinhSach where ChinhSachID = ?";
        let [chinhsachs, fields] = await db.execute(sql,[id]);
        return chinhsachs;
    }
    async delete(id) {
        //xóa 1 record
        let db = await dbmodel.iNit();
        let sql = "DELETE FROM ChinhSach WHERE ChinhSachID = ?";
        try {
            let result = await db.execute(sql, [id]);
            return { status: 200, data: result };
        } catch (error) {
            return { status: 404, error: error };
        }
    }
    async end(){
        //Chấm dứt hiệu lực chính sách cũ khi tạo chính sách mới
        let db = await dbmodel.iNit();
        let sql = "UPDATE ChinhSach SET HieuLuc = 0, NgayHetHieuLuc = ? WHERE HieuLuc = 1";
        let today = new Date();
        today = Util.dinhdangNgayDate(today);
        try {
            let result = await db.execute(sql, [today]);
            return { status: 200, data: result };
        } catch (error) {
            return { status: 404, error: error };
        }        
    }
    
}
module.exports = ChinhSach;
/*

*/
