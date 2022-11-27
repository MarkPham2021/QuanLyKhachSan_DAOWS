'use strict'
const dbmodel = require("./DataBase");

class PhieuThuePhong{
    constructor(id, phongid, ngaythue, ngaytradukien, tongsokhach, tongsokhachmax, hasforeigner, chinhsachid, isactive) {

        this.PhieuThueID = id;
        this.PhongID = phongid;
        this.NgayThue = ngaythue;
        this.NgayTraDuKien = ngaytradukien;        
        this.tongsoKhach = tongsokhach;
        this.tongsoKhachMax = tongsokhachmax;
        this.hasForeigner = hasforeigner;
        this.ChinhSachID = chinhsachid;
        this.isActive = isactive;        
    }
    async list() {
        //trả về danh sách phieu thue phong từ database
        let db = await dbmodel.iNit();
        let sql = `SELECT PhieuThuePhong.PhieuThueID AS PhieuThueID, PhieuThuePhong.PhongID AS PhongID, Phong.PhongSo AS PhongSo, PhieuThuePhong.NgayThue AS NgayThue, 
        PhieuThuePhong.NgayTraDuKien AS NgayTraDuKien, PhieuThuePhong.tongsoKhach AS tongsoKhach, PhieuThuePhong.tongsoKhachMax AS tongsoKhachMax, 
        PhieuThuePhong.hasForeigner AS hasForeigner, PhieuThuePhong.isActive AS isActive, PhieuThuePhong.DonGiaThanhToan AS DonGiaThanhToan 
        FROM PhieuThuePhong LEFT JOIN Phong ON PhieuThuePhong.PhongID = Phong.PhongID ORDER BY PhieuThueID DESC`;
        let [phieuthuephongs, fields] = await db.query(sql);
        return phieuthuephongs;
    }
    async search(setsearch){
        //Hàm tìm kiếm phục vụ chức năng tìm kiếm theo bộ thuộc tính của màn hình PhieuthuephongIndex
        let db = await dbmodel.iNit();
        let sql = `SELECT PhieuThuePhong.PhieuThueID AS PhieuThueID, PhieuThuePhong.PhongID AS PhongID, Phong.PhongSo AS PhongSo, PhieuThuePhong.NgayThue AS NgayThue, 
        PhieuThuePhong.NgayTraDuKien AS NgayTraDuKien, PhieuThuePhong.tongsoKhach AS tongsoKhach, PhieuThuePhong.tongsoKhachMax AS tongsoKhachMax, 
        PhieuThuePhong.hasForeigner AS hasForeigner, PhieuThuePhong.isActive AS isActive, PhieuThuePhong.DonGiaThanhToan AS DonGiaThanhToan 
        FROM PhieuThuePhong LEFT JOIN Phong ON PhieuThuePhong.PhongID = Phong.PhongID 
        WHERE PhieuThueID LIKE ? AND PhieuThuePhong.PhongID LIKE ? AND isActive LIKE ? 
        AND NgayThue BETWEEN ? AND ? AND NgayTraDuKien BETWEEN ? AND ? ORDER BY PhieuThueID DESC`;
        let [phieuthuephongs, fields] = await db.execute(sql, setsearch);
        return phieuthuephongs;
    }
    async create(val) {
        //chèn record mới vào table PhieuThuePhong
        let db = await dbmodel.iNit();
        let sql = `INSERT INTO PhieuThuePhong(PhongID,NgayThue,NgayTraDuKien,tongsoKhach,tongsoKhachMax,hasForeigner,ChinhSachID,isActive, DonGiaThanhToan) 
        VALUES (?,?,?,?,?,?,?,?,?) `;
        
        try {
            let result = await db.execute(sql, val);                        
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });            
        }        
    }
    async update(val) {
        //cập nhật record vào table
        let db = await dbmodel.iNit();
        let sql = "UPDATE PhieuThuePhong SET PhongID  =?, NgayThue = ?, NgayTraDuKien = ?, tongsoKhach = ?, tongsoKhachMax = ?, hasForeigner = ?, DonGiaThanhToan =? WHERE PhieuThueID = ?";
        try {
            let result = await db.execute(sql, val);
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });
        } 
    }
    async read(id) {
        //trả về chi tiết 1 record từ table dùng cho chức năng xem chi tết từ trang phieuthuephongIndex
        let db = await dbmodel.iNit();
        let sql = `SELECT PhieuThuePhong.PhieuThueID AS PhieuThueID, PhieuThuePhong.PhongID AS PhongID,PhieuThuePhong.ChinhSachID AS ChinhSachID, 
        Phong.PhongSo AS PhongSo, LoaiPhong.LoaiPhongTen AS LoaiPhongTen, LoaiPhong.LoaiPhongGia AS LoaiPhongGia,PhieuThuePhong.NgayThue AS NgayThue, 
        PhieuThuePhong.NgayTraDuKien AS NgayTraDuKien, PhieuThuePhong.tongsoKhach AS tongsoKhach, PhieuThuePhong.tongsoKhachMax AS tongsoKhachMax, 
        PhieuThuePhong.isActive AS isActive, PhieuThuePhong.hasForeigner AS hasForeigner, PhieuThuePhong.DonGiaThanhToan AS DonGiaThanhToan 
        FROM PhieuThuePhong LEFT JOIN Phong ON PhieuThuePhong.PhongID = Phong.PhongID 
        LEFT JOIN LoaiPhong ON Phong.LoaiPhongID = LoaiPhong.LoaiPhongID WHERE PhieuThueID = ?`;
        
        let [phieuthuephongs, fields]= await db.execute(sql,[id]);
        return phieuthuephongs;
    }
    async readtoCreatePhieuTraPhong(id) {
        //trả về chi tiết 1 record từ table dùng cho chức năng tạo phiếu trả phòng
        let db = await dbmodel.iNit();
        let sql = `SELECT PhieuThuePhong.PhieuThueID AS PhieuThueID, PhieuThuePhong.PhongID AS PhongID,PhieuThuePhong.ChinhSachID AS ChinhSachID, 
        Phong.PhongSo AS PhongSo, LoaiPhong.LoaiPhongTen AS LoaiPhongTen, LoaiPhong.LoaiPhongGia AS LoaiPhongGia,PhieuThuePhong.NgayThue AS NgayThue, 
        PhieuThuePhong.NgayTraDuKien AS NgayTraDuKien, PhieuThuePhong.tongsoKhach AS tongsoKhach, PhieuThuePhong.tongsoKhachMax AS tongsoKhachMax, 
        PhieuThuePhong.isActive AS isActive, PhieuThuePhong.hasForeigner AS hasForeigner,PhieuThuePhong.DonGiaThanhToan AS DonGiaThanhToan, ChinhSach.HeSoGiaKhachTrongNuoc AS HeSoGiaKhachTrongNuoc,
        ChinhSach.HeSoGiaKhachNuocNgoai AS HeSoGiaKhachNuocNgoai, ChinhSach.TyLePhuThu AS TyLePhuThu 
        FROM PhieuThuePhong LEFT JOIN Phong ON PhieuThuePhong.PhongID = Phong.PhongID 
        LEFT JOIN LoaiPhong ON Phong.LoaiPhongID = LoaiPhong.LoaiPhongID 
        LEFT JOIN ChinhSach ON PhieuThuePhong.ChinhSachID = ChinhSach.ChinhSachID
        WHERE PhieuThueID = ?`;

        let [phieuthuephongs, fields] = await db.execute(sql, [id]);
        return phieuthuephongs;
    }
    async updateTraPhong(val){
        let db = await dbmodel.iNit();
        let sql = "UPDATE PhieuThuePhong SET NgayTra  =?, ThanhTien =?, isActive = ? WHERE PhieuThueID = ?";
        try {
            let result = await db.execute(sql, val);
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });
        } 
    }
    async updateXoaTraPhong(val) {
        let db = await dbmodel.iNit();
        let sql = "UPDATE PhieuThuePhong SET NgayTra  =?, ThanhTien =?, isActive = ? WHERE PhieuThueID = ?";
        try {
            let result = await db.execute(sql, val);
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });
        }
    }
    async delete(id) {
        //xóa 1 record
        let sql = "DELETE FROM PhieuThuePhong WHERE PhieuThueID = ?";
        let db = await dbmodel.iNit();
        try {
            let result = await db.execute(sql, [id]);
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });
        } 
    }
    async applyChinhSach(chinhsachid){
        //đếm số phiếu thuê phòng áp dụng 1 chính sách
        let sql = "SELECT COUNT(PhieuThueID) AS Count_PhieuThueID FROM PhieuThuePhong WHERE ChinhSachID = ?";
        let db = await dbmodel.iNit();
        let[soluongs, fields] = await db.execute(sql, [chinhsachid]);
        return soluongs;
    }
    async setInactive(id) {
        //cập nhật tình trạng isActive = 0 khi lập phiếu trả phòng
        let db = await dbmodel.iNit();
        let sql = "UPDATE PhieuThuePhong SET isActive = 0 WHERE PhieuThueID = ?";
        try {
            let result = await db.execute(sql, [id]);
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });
        }
    }
    async setActive(id) {
        //cập nhật tình trạng isActive = 0 khi xóa phiếu trả phòng
        let db = await dbmodel.iNit();
        let sql = "UPDATE PhieuThuePhong SET isActive = 1 WHERE PhieuThueID = ?";
        try {
            let result = await db.execute(sql, [id]);
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });
        }
    }
}
module.exports = PhieuThuePhong;
/* test các hàm:

*/
