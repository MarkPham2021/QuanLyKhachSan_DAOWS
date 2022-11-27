'use strict'
const dbmodel = require("./DataBase");

class KhachHangCaNhan {
    constructor(id, ten, loaigtcnid, gtcnso, gioitinh, ngaysinh, quoctich, diachi, dienthoai, email, loaikhachid) {

        this.CaNhanID = id;
        this.CaNhanTen = ten;
        this.LoaiGTCNID = loaigtcnid;
        this.GiayToCNSo = gtcnso;
        this.GioiTinh = gioitinh;
        this.NgaySinh = ngaysinh;
        this.QuocTichId = quoctich;
        this.DiaChi = diachi;
        this.DienThoai = dienthoai;
        this.Email = email;
        this.LoaiKhachID = loaikhachid;
    }
    
    async list() {
        //trả về danh sách record từ database
        //biến sql chứa câu lệnh sql chọn theo sắp xếp CaNhanID tăng dần, biến sqlsortIDDes chứa câu sql theo sắp xếp CaNhanID giảm dần
        //Mục đích xếp theo CaNhanID giảm dần là đưa khách hàng mới nhất lên đầu tiên trong danh sách khách hàng.

        let db = await dbmodel.iNit();
        let sql= `SELECT KhachHangCaNhan.CaNhanID AS CaNhanID, KhachHangCaNhan.CaNhanTen AS CaNhanTen, KhachHangCaNhan.LoaiGTCNID AS LoaiGTCNID, 
        LoaiGiayToCaNhan.TenGTCN AS TenGTCN, KhachHangCaNhan.GiayToCNSo AS GTCNSo, KhachHangCaNhan.QuocTichId AS QuocTichID,DanhSachQuocTich.QuocGia AS QuocTich, 
        KhachHangCaNhan.GioiTinh AS GioiTinh, KhachHangCaNhan.NgaySinh AS NgaySinh,KhachHangCaNhan.DiaChi AS DiaChi, KhachHangCaNhan.DienThoai AS DienThoai,  
        KhachHangCaNhan.LoaiKhachID AS LoaiKhachID, LoaiKhach.LoaiKhachTen AS LoaiKhachTen 
        FROM KhachHangCaNhan LEFT JOIN LoaiGiayToCaNhan ON KhachHangCaNhan.LoaiGTCNID = LoaiGiayToCaNhan.LoaiGTCNID 
        LEFT JOIN DanhSachQuocTich ON KhachHangCaNhan.QuocTichID = DanhSachQuocTich.QuocTichID  
        LEFT JOIN LoaiKhach ON KhachHangCaNhan.LoaiKhachID = LoaiKhach.LoaiKhachID
        ORDER BY CaNhanID DESC`;
        let [khcns, fields] = await db.query(sql);
        return khcns;
    }
    async create(val) {
        //chèn record mới vào table 
        let db = await dbmodel.iNit();
        let sql = `INSERT INTO KhachHangCaNhan(CaNhanTen, LoaiGTCNID, GiayToCNSo, GioiTinh, NgaySinh, QuocTichId, DiaChi,DienThoai,Email, 
            LoaiKhachID, dupcheck) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
            try{
                let result = await db.execute(sql, val);
                return {status: 200, data:result};
            } catch(error){
                return {status : 404, error: error};
            }        
    }
    async search(val){
        //phương thức search phục vụ chức năng tìm kiếm trong module Khách hàng.              
        let db = await dbmodel.iNit();
        let sql = `SELECT KhachHangCaNhan.CaNhanID AS CaNhanID, KhachHangCaNhan.CaNhanTen AS CaNhanTen, KhachHangCaNhan.LoaiGTCNID AS LoaiGTCNID, 
        LoaiGiayToCaNhan.TenGTCN AS TenGTCN, KhachHangCaNhan.GiayToCNSo AS GTCNSo,KhachHangCaNhan.LoaiKhachID AS LoaiKhachID, KhachHangCaNhan.QuocTichId AS QuocTich, 
        KhachHangCaNhan.GioiTinh AS GioiTinh, KhachHangCaNhan.NgaySinh AS NgaySinh, KhachHangCaNhan.DiaChi AS DiaChi, KhachHangCaNhan.DienThoai AS DienThoai, 
        KhachHangCaNhan.Email AS Email, KhachHangCaNhan.dupcheck AS dupcheck 
        FROM KhachHangCaNhan LEFT JOIN LoaiGiayToCaNhan ON KhachHangCaNhan.LoaiGTCNID = LoaiGiayToCaNhan.LoaiGTCNID 
        WHERE CaNhanID Like ? and CaNhanTen LIKE ? and DienThoai like ? and dupcheck like ? `;
        let [khcns, fields] = await db.execute(sql, val);
        return khcns;
    }
    async read(id) {
        //trả về chi tiết 1 record từ table
        let db = await dbmodel.iNit();
        let sqljoin = `SELECT KhachHangCaNhan.CaNhanID AS CaNhanID, KhachHangCaNhan.CaNhanTen AS CaNhanTen, KhachHangCaNhan.LoaiGTCNID AS LoaiGTCNID, 
        LoaiGiayToCaNhan.TenGTCN AS TenGTCN, KhachHangCaNhan.GiayToCNSo AS GTCNSo, KhachHangCaNhan.QuocTichId AS QuocTich,DanhSachQuocTich.QuocGia AS QuocGia, 
        KhachHangCaNhan.GioiTinh AS GioiTinh, KhachHangCaNhan.NgaySinh AS NgaySinh, KhachHangCaNhan.DienThoai AS DienThoai, KhachHangCaNhan.DiaChi AS DiaChi,
        KhachHangCaNhan.Email AS Email, KhachHangCaNhan.LoaiKhachID, LoaiKhach.LoaiKhachTen AS LoaiKhachTen 
        FROM KhachHangCaNhan LEFT JOIN LoaiGiayToCaNhan ON KhachHangCaNhan.LoaiGTCNID = LoaiGiayToCaNhan.LoaiGTCNID 
        LEFT JOIN DanhSachQuocTich ON KhachHangCaNhan.QuocTichId = DanhSachQuocTich.QuocTichID 
        LEFT JOIN LoaiKhach ON KhachHangCaNhan.LoaiKhachID = LoaiKhach.LoaiKhachID 
        WHERE CaNhanID = ${id}`;
        let [khcns, fields] = await db.query(sqljoin);
        return khcns;
    }
    async update(val) {
        //cập nhật record vào table
        let db = await dbmodel.iNit();
        let sql = `UPDATE KhachHangCaNhan SET CaNhanTen  = '${val[0]}', LoaiGTCNID = ${val[1]}, GiayToCNSo = '${val[2]}', GioiTinh = ${val[3]}, 
        NgaySinh = '${val[4]}', QuocTichId = ${val[5]}, DiaChi = '${val[6]}', DienThoai = '${val[7]}', Email = '${val[8]}', LoaiKhachID = ${val[9]},dupcheck='${val[10]}' 
        WHERE CaNhanID = ${val[11]}`;
        
        try {
            let result = await db.query(sql);            
            return { status: 200, data: result };
        } catch (error) {            
            return { status: 404, error: error };
        } 
    }
    async delete(id) {
        //xóa 1 record
        let db = await dbmodel.iNit();
        let sql = "DELETE FROM KhachHangCaNhan WHERE CaNhanID = ?";
        try {
            let result = await db.execute(sql,[id]);
            return { status: 200, data: result };
        } catch (error) {
            return { status: 404, error: error };
        } 
    }
    async findid(id) {
        //phương thức find(id, callback) phục vụ chức năng tìm kiếm khách hàng theo id trong module lập phiếu thuê phòng.               
        let db = await dbmodel.iNit();
        let sql = `SELECT KhachHangCaNhan.CaNhanID AS CaNhanID, KhachHangCaNhan.CaNhanTen AS CaNhanTen, KhachHangCaNhan.LoaiGTCNID AS LoaiGTCNID, 
        LoaiGiayToCaNhan.TenGTCN AS TenGTCN, KhachHangCaNhan.GiayToCNSo AS GTCNSo, KhachHangCaNhan.LoaiKhachID AS LoaiKhachID, 
        LoaiKhach.LoaiKhachTen AS LoaiKhachTen,KhachHangCaNhan.QuocTich AS QuocTich, KhachHangCaNhan.GioiTinh AS GioiTinh, 
        KhachHangCaNhan.NgaySinh AS NgaySinh, KhachHangCaNhan.DiaChi AS DiaChi, KhachHangCaNhan.DienThoai AS DienThoai, 
        KhachHangCaNhan.Email AS Email, KhachHangCaNhan.dupcheck AS dupcheck 
        FROM KhachHangCaNhan LEFT JOIN LoaiGiayToCaNhan ON KhachHangCaNhan.LoaiGTCNID = LoaiGiayToCaNhan.LoaiGTCNID 
        LEFT JOIN LoaiKhach On KhachHangCaNhan.LoaiKhachID = LoaiKhach.LoaiKhachID WHERE CaNhanID = ?`;
        
        let [khcns, fields] = await db.execute(sql, [id]);
        return khcns;
    }
    /*    
    
    finddupcheck(dupcheck, callback){
        //phương thức find(dupcheck, callback) phục vụ chức năng tìm kiếm khách hàng theo loại GTCN và số GTCN trong module lập phiếu thuê phòng.               
        let sql = "SELECT KhachHangCaNhan.CaNhanID AS CaNhanID, KhachHangCaNhan.CaNhanTen AS CaNhanTen, KhachHangCaNhan.LoaiGTCNID AS LoaiGTCNID, LoaiGiayToCaNhan.TenGTCN AS TenGTCN, KhachHangCaNhan.GiayToCNSo AS GTCNSo, KhachHangCaNhan.LoaiKhachID AS LoaiKhachID, LoaiKhach.LoaiKhachTen AS LoaiKhachTen,KhachHangCaNhan.QuocTich AS QuocTich, KhachHangCaNhan.GioiTinh AS GioiTinh, KhachHangCaNhan.NgaySinh AS NgaySinh, KhachHangCaNhan.DiaChi AS DiaChi, KhachHangCaNhan.DienThoai AS DienThoai, KhachHangCaNhan.Email AS Email, KhachHangCaNhan.dupcheck AS dupcheck FROM KhachHangCaNhan LEFT JOIN LoaiGiayToCaNhan ON KhachHangCaNhan.LoaiGTCNID = LoaiGiayToCaNhan.LoaiGTCNID LEFT JOIN LoaiKhach On KhachHangCaNhan.LoaiKhachID = LoaiKhach.LoaiKhachID WHERE dupcheck = ? ";
        db.query(sql, dupcheck, (err, d) => {
            if (err) throw err;
            else callback(null, d);
            
        });
    }
*/    
}
module.exports = KhachHangCaNhan;

