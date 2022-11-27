'use strict'
const dbmodel = require("./DataBase");

class PhieuTraPhong {
    constructor(id, phieuthueid, ngaytra, dongiacoso, tylephuthu, hesogia, tylechietkhau, dongiathanhtoan,songaythue, thanhtien) {
        this.PhieuTraID = id;
        this.PhieuThueID = phieuthueid;        
        this.NgayTra = ngaytra;
        this.DonGiaCoSo = dongiacoso;
        this.TyLePhuThu = tylephuthu;
        this.HeSoGia = hesogia;
        this.TyLeChietKhau = tylechietkhau;
        this.DonGiaThanhToan = dongiathanhtoan;
        this.SoNgayThue = songaythue;
        this.ThanhTien = thanhtien;
    }
    async list() {
        //trả về danh sách phieu thue phong từ database
        let db = await dbmodel.iNit();
        let sql = `SELECT PhieuTraPhong.KhachHangID AS KhachHangID, KhachHangCaNhan.CaNhanTen AS KhachHangTen, PhieuTraPhong.PhieuTraID, PhieuTraPhong.PhieuThueID AS PhieuThueID, PhieuThuePhong.PhongID AS PhongID, Phong.PhongSo AS PhongSo, 
        PhieuTraPhong.NgayTra AS NgayTra, PhieuThuePhong.NgayThue AS NgayThue, PhieuTraPhong.SoNgayThue as SoNgayThue, PhieuTraPhong.DonGiaThanhToan AS DonGiaThanhToan,
        PhieuTraPhong.ThanhTien AS ThanhTien, PhieuThuePhong.NgayTraDuKien AS NgayTraDuKien, PhieuThuePhong.tongsoKhach AS tongsoKhach, PhieuThuePhong.tongsoKhachMax AS tongsoKhachMax, 
        PhieuThuePhong.hasForeigner AS hasForeigner, PhieuThuePhong.isActive AS isActive 
        FROM PhieuTraPhong LEFT JOIN PhieuThuePhong On PhieuTraPhong.PhieuThueID = PhieuThuePhong.PhieuThueID
        LEFT JOIN Phong ON PhieuThuePhong.PhongID = Phong.PhongID 
        LEFT JOIN ChinhSach ON PhieuThuePhong.ChinhSachID = ChinhSach.ChinhSachID 
        LEFT JOIN KhachHangCaNhan ON PhieuTraPhong.KhachHangID = KhachHangCaNhan.CaNhanID 
        ORDER BY PhieuTraID DESC`;
        let [phieutraphongs, fields] = await db.query(sql);
        return phieutraphongs;
    }
    async search(setsearch) {
        //Hàm tìm kiếm phục vụ chức năng tìm kiếm theo bộ thuộc tính của màn hình PhieuthuephongIndex
        let db = await dbmodel.iNit();
        let sql = `SELECT PhieuThuePhong.PhieuThueID AS PhieuThueID, PhieuThuePhong.PhongID AS PhongID, Phong.PhongSo AS PhongSo, PhieuThuePhong.NgayThue AS NgayThue, 
        PhieuThuePhong.NgayTraDuKien AS NgayTraDuKien, PhieuThuePhong.tongsoKhach AS tongsoKhach, PhieuThuePhong.tongsoKhachMax AS tongsoKhachMax, 
        PhieuThuePhong.hasForeigner AS hasForeigner, PhieuThuePhong.isActive AS isActive 
        FROM PhieuThuePhong LEFT JOIN Phong ON PhieuThuePhong.PhongID = Phong.PhongID 
        WHERE PhieuThueID LIKE ? AND PhongSo LIKE ? AND isActive LIKE ? 
        AND NgayThue BETWEEN ? AND ? AND NgayTraDuKien BETWEEN ? AND ? ORDER BY PhieuThueID DESC`;
        let [phieuthuephongs, fields] = await db.execute(sql, setsearch);
        return phieuthuephongs;
    }
    async create(val) {
        //chèn record mới vào table PhieuThuePhong
        let db = await dbmodel.iNit();
        let sql = `INSERT INTO PhieuTraPhong(KhachHangID, PhieuThueID,NgayTra,DonGiaCoSo,TyLePhuThu,HeSoGia,DonGiaThanhToan,SoNgayThue,ThanhTien,TyLeChietKhau) 
        VALUES (?,?,?,?,?,?,?,?,?,?) `;        
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
        let sql = "UPDATE PhieuThuePhong SET PhongID  =?, NgayThue = ?, NgayTraDuKien = ?, tongsoKhach = ?, tongsoKhachMax = ?, hasForeigner = ? WHERE PhieuThueID = ?";
        try {
            let result = await db.execute(sql, val);
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });
        }
    }
    async read(id) {
        //trả về chi tiết 1 record từ table
        let db = await dbmodel.iNit();        
        let sql = `SELECT PhieuTraPhong.KhachHangID AS KhachHangID, KhachHangCaNhan.CaNhanTen AS KhachHangTen, KhachHangCaNhan.DiaChi AS DiaChi, PhieuTraPhong.PhieuTraID, PhieuTraPhong.PhieuThueID AS PhieuThueID, PhieuThuePhong.PhongID AS PhongID, Phong.PhongSo AS PhongSo, 
        PhieuTraPhong.NgayTra AS NgayTra, PhieuThuePhong.NgayThue AS NgayThue, PhieuTraPhong.SoNgayThue as SoNgayThue, PhieuTraPhong.DonGiaThanhToan AS DonGiaThanhToan,
        PhieuTraPhong.ThanhTien AS ThanhTien, PhieuThuePhong.NgayTraDuKien AS NgayTraDuKien, PhieuThuePhong.tongsoKhach AS tongsoKhach, PhieuThuePhong.tongsoKhachMax AS tongsoKhachMax, 
        PhieuThuePhong.hasForeigner AS hasForeigner, PhieuThuePhong.isActive AS isActive 
        FROM PhieuTraPhong LEFT JOIN PhieuThuePhong On PhieuTraPhong.PhieuThueID = PhieuThuePhong.PhieuThueID
        LEFT JOIN Phong ON PhieuThuePhong.PhongID = Phong.PhongID 
        LEFT JOIN ChinhSach ON PhieuThuePhong.ChinhSachID = ChinhSach.ChinhSachID 
        LEFT JOIN KhachHangCaNhan ON PhieuTraPhong.KhachHangID = KhachHangCaNhan.CaNhanID 
        WHERE PhieuTraPhong.PhieuTraID = ?`;        
        let [phieutraphongs, fields] = await db.execute(sql, [id]);
        return phieutraphongs;
    }
    async delete(id) {
        //xóa 1 record
        let sql = "DELETE FROM PhieuTraPhong WHERE PhieuTraID = ?";
        let db = await dbmodel.iNit();
        try {
            let result = await db.execute(sql, [id]);
            return { "status": 200, "summary": result };
        } catch (error) {
            return ({ "summary": error, "status": 404 });
        }
    }    
}
module.exports = PhieuTraPhong;
/* test các hàm:

*/
