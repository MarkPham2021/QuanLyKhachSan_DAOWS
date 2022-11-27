'use strict'
const dbmodel = require("./DataBase");

class CTPhieuThuePhong{
    constructor(id, phieuthueid, stt, canhanid) {
        this.CTPhieuThueID = id;
        this.PhieuThueID = phieuthueid;
        this.STT = stt;
        this.CaNhanID = canhanid;        
    }
    async list() {
        //trả về danh sách record từ database
        let db = await dbmodel.iNit();
        let sql = `SELECT CTPhieuThuePhong.CTPhieuThueID AS CTPhieuThueID,CTPhieuThuePhong.STT AS STT, 
        CTPhieuThuePhong.CaNhanID AS CaNhanID, KhachHangCaNhan.CaNhanTen AS CaNhanTen, LoaiGiayToCaNhan.TenGTCN AS TenGTCN, 
        KhachHangCaNhan.GiayToCNSo AS GTCNSo,KhachHangCaNhan.DiaChi AS DiaChi, KhachHangCaNhan.DienThoai AS DienThoai 
        FROM CTPhieuThuePhong Left join KhachHangCaNhan ON CTPhieuThuePhong.CaNhanID = KhachHangCaNhan.CaNhanID 
        LEFT JOIN LoaiGiayToCaNhan ON KhachHangCaNhan.LoaiGTCNID = LoaiGiayToCaNhan.LoaiGTCNID`;
        let [ctphieuthuephongs, fields] = await db.query(sql);
        return ctphieuthuephongs;
    }
    async listptp(phieuthueid) {
        //trả về danh sách chi tiết phiếu thuê phòng theo 1 phiếu thuê phong ID
        let db = await dbmodel.iNit();
        let sql = `SELECT CTPhieuThuePhong.CTPhieuThueID AS CTPhieuThueID,CTPhieuThuePhong.STT AS STT, 
        CTPhieuThuePhong.CaNhanID AS CaNhanID, KhachHangCaNhan.CaNhanTen AS CaNhanTen, LoaiGiayToCaNhan.TenGTCN AS TenGTCN, DanhSachQuocTich.QuocGia AS QuocGia,  
        KhachHangCaNhan.GiayToCNSo AS GTCNSo, KhachHangCaNhan.DiaChi AS DiaChi, KhachHangCaNhan.DienThoai AS DienThoai, LoaiKhach.LoaiKhachTen AS LoaiKhachTen  
        FROM CTPhieuThuePhong Left join KhachHangCaNhan ON CTPhieuThuePhong.CaNhanID = KhachHangCaNhan.CaNhanID 
        LEFT JOIN LoaiGiayToCaNhan ON KhachHangCaNhan.LoaiGTCNID = LoaiGiayToCaNhan.LoaiGTCNID 
        LEFT JOIN LoaiKhach ON LoaiKhach.LoaiKhachID = KhachHangCaNhan.LoaiKhachID 
        LEFT JOIN DanhSachQuocTich ON DanhSachQuocTich.QuocTichID = KhachHangCaNhan.QuocTichId
        WHERE CTPhieuThuePhong.PhieuThueID =?`;
        let [ctphieuthuephongs, fields] = await db.execute(sql,[phieuthueid]);
        return ctphieuthuephongs;
        
    }
    async create(val) {
        //chèn record mới vào table 
        let db = await dbmodel.iNit();
        let sql = `INSERT INTO CTPhieuThuePhong(PhieuThueID,STT,CaNhanID) VALUES (?,?,?)`;
        try {
            let result = await db.execute(sql, val);
            return { status: 200, data: result };
        } catch (error) {
            return { status: 404, error: error };
        }
    }    
    async read(id) {
        //trả về chi tiết 1 record từ table CTPhieuThuePhong
        let sql = `SELECT CTPhieuThuePhong.CTPhieuThueID AS CTPhieuThueID,CTPhieuThuePhong.STT AS STT, CTPhieuThuePhong.CaNhanID AS CaNhanID, 
        KhachHangCaNhan.CaNhanTen AS CaNhanTen, LoaiGiayToCaNhan.TenGTCN AS TenGTCN, KhachHangCaNhan.GiayToCNSo AS GTCNSo,KhachHangCaNhan.DiaChi AS DiaChi, 
        KhachHangCaNhan.DienThoai AS DienThoai FROM CTPhieuThuePhong Left join KhachHangCaNhan ON CTPhieuThuePhong.CaNhanID = KhachHangCaNhan.CaNhanID 
        LEFT JOIN LoaiGiayToCaNhan ON KhachHangCaNhan.LoaiGTCNID = LoaiGiayToCaNhan.LoaiGTCNID WHERE CTPhieuThuePhong.CTPhieuThueID =?`;
        let db = await dbmodel.iNit();
        let [ctphieuthuephongs, fields] = await db.execute(sql,[id]);
        return ctphieuthuephongs;
    }
    async delete(PhieuThueID) {
        //xóa các record thuộc 1 phiếu thuê phòng
        let sql = "DELETE FROM CTPhieuThuePhong WHERE PhieuThueID = ?";
        let db = await dbmodel.iNit();
        try {
            let result = await db.execute(sql, [PhieuThueID]);
            return { status: 200, data: result };
        } catch (error) {
            return { status: 404, error: error };
        }
        
    }
}
module.exports = CTPhieuThuePhong;
/* test các hàm:

*/
