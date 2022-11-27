'use strict'
const dbmodel = require("./DataBase");

class Phong {
    constructor(id, loaiphongid, khuvuc, tang, mota, tinhtrang) {

        this.PhongID = id;
        this.LoaiPhongID = loaiphongid;
        this.KhuVuc = khuvuc;
        this.Tang = tang;
        this.MoTa = mota;
        this.TinhTrang = tinhtrang;
    }
    
    async list(range = 2) {
        //trả về danh sách phòng theo phạm vi muốn xem: 2-tất cả, 1-phòng trống,0-phòng bận đã có khách thuê
        let db = await dbmodel.iNit();
        let sql = `SELECT Phong.PhongID AS PhongID, Phong.PhongSo AS PhongSo, Phong.MoTa AS MoTa, Phong.TinhTrang AS TinhTrang, 
        LoaiPhong.LoaiPhongTen AS LoaiPhongTen, LoaiPhong.LoaiPhongGia AS LoaiPhongGia 
        FROM Phong LEFT JOIN LoaiPhong ON Phong.LoaiPhongID = LoaiPhong.LoaiPhongID WHERE TinhTrang != ?`; 
        let criteria =9;
        if(range==2){
            criteria=2;
        }else if(range==0){
            criteria=1;
        } else if (range == 1) {
            criteria = 0;
        }
        try {
            let [phongs, fields] = await db.execute(sql,[criteria]);
            db.end();
            return (phongs);
        }
        catch (error) {
            db.end();
            return (error);
        }

    }
    async listrooms(range=2){
        //Hàm listrooms phục vụ việc lấy dữ liệu cho trang danh sách phòng
        let db = await dbmodel.iNit();
        let sql1 = `SELECT Phong.PhongID AS PhongID, Phong.PhongSo AS PhongSo, Phong.TinhTrang AS TinhTrang,
                    LoaiPhong.LoaiPhongTen AS LoaiPhongTen, LoaiPhong.LoaiPhongGia AS LoaiPhongGia
                    FROM Phong LEFT JOIN LoaiPhong ON Phong.LoaiPhongID = LoaiPhong.LoaiPhongID
                    WHERE TinhTrang = 1
                    ORDER BY LoaiPhong.LoaiPhongTen`;
        let sql0 = `SELECT Phong.PhongID AS PhongID, Phong.PhongSo AS PhongSo, Phong.TinhTrang AS TinhTrang, 
                LoaiPhong.LoaiPhongTen AS LoaiPhongTen, LoaiPhong.LoaiPhongGia AS LoaiPhongGia,
                PhieuThuePhong.NgayThue as NgayThue, phieuthuephong.NgayTraDuKien as NgayTraDuKien 
                FROM Phong LEFT JOIN LoaiPhong ON Phong.LoaiPhongID = LoaiPhong.LoaiPhongID 
                LEFT JOIN PhieuThuePhong on Phong.PhongID = PhieuThuePhong.PhongID
                WHERE TinhTrang = 0 and phieuthuephong.isActive =1
                ORDER BY LoaiPhong.LoaiPhongTen`;
        let _phongtrongs =[];
        let _phongcokhachs=[];
        if(range ==0){
            let [rows, fields]=await db.query(sql0);
            _phongcokhachs=rows;
        }else if(range==1){
            let [rows, fields] = await db.query(sql1);
            _phongtrongs=rows;           
        }else if(range==2){
            let [row0s, field0s] = await db.query(sql0);
            let [row1s, field1s] = await db.query(sql1);
            _phongcokhachs = row0s;
            _phongtrongs=row1s
        }
        return {phongtrongs: _phongtrongs, phongcokhachs: _phongcokhachs};
    }
    async create(val) {
        //chèn record mới vào table 
        let db = await dbmodel.iNit();
        //db.config.namedPlaceholders = true;        
        let sql = "INSERT INTO Phong(PhongSo, LoaiPhongID, KhuVuc,Tang, MoTa,TinhTrang) values(?,?,?,?,?,?) ";
        try {
            let result = await db.execute(sql, [val.PhongSo, val.LoaiPhongID, val.KhuVuc,val.Tang,val.MoTa,1]);
            return ({ "status": 200, "summary": result.ResultSetHeader })
        } catch (error) {
            return ({ "summary": error, "status": 404 })
        }
    }
    async update(val) {
        //cập nhật record vào table
        let db = await dbmodel.iNit();
        let sql = "UPDATE Phong SET PhongSo=?, LoaiPhongID=?, KhuVuc=?,Tang=?, MoTa=?,TinhTrang=? WHERE PhongID = ?";
        
        try {
            let result = await db.execute(sql, val);
            return { "status": 200, "rowsAffected": result.affectedRows };
        }
        catch (error) {
            return { "status": 404, "errcode": error.code, "errMessage": error.sqlMessage };
        }
    }    
    async read(id) {
        //trả về chi tiết 1 record từ table
        let db = await dbmodel.iNit();
        let sql = `select PhongID, PhongSo, Phong.LoaiPhongID, KhuVuc, Tang, MoTa, TinhTrang, LoaiPhong.LoaiPhongTen, LoaiPhong.LoaiPhongGia 
                        FROM phong left join loaiphong on phong.LoaiPhongID = loaiphong.LoaiPhongID where PhongID = ${id}`;
        try {
            let [phongs, fields] = await db.query(sql);
            db.end();
            if (phongs.length > 0) {
                let responseObject = { status: 200, phongs };
                return (responseObject);
            }
            else {
                let responseObject = { status: 404, error: { errorCode: 404, errMessage: "Không có phòng này" } };
                return (responseObject);
            }

        }
        catch (error) {
            db.end();
            let responseObject = { status: 404, error };
            return (responseObject);
        }
    }
    async delete(id) {
        //xóa 1 record
        let db = await dbmodel.iNit();
        let sql = "DELETE FROM Phong WHERE PhongID = ?";
        try {
            let result = await db.execute(sql, [id]);
            return { "status": 200, "rowsAffected": result.affectedRows };
        }
        catch (error) {
            return { "status": 404, "errcode": error.code, "errMessage": error.sqlMessage };
        }
    }
    async occupy(id){
        //Thay đổi tình trạng của phòng sang not available khi thực hiện lập phiếu thuê phòng
        let db = await dbmodel.iNit();
        let sql = "UPDATE Phong SET TinhTrang = 0 WHERE PhongID = ?";
        let result = await db.execute(sql,[id]);
        return result;
    }
    async release(id){
        //Thay đổi tình trạng của phòng sang available khi lập phiếu trả phòng
        let db = await dbmodel.iNit();
        let sql = "UPDATE Phong SET TinhTrang = 1 WHERE PhongID = ?";
        let result = await db.execute(sql, [id]);
        return result;
    }
}
module.exports = Phong;

