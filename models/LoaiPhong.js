'use strict'
const dbmodel = require("./DataBase");

class LoaiPhong {
    constructor(id, LoaiPhongTen, LoaiPhongGia ) {
        
        this.loaiphongID = id;
        this.LoaiPhongTen = LoaiPhongTen;
        this.LoaiPhongGia = LoaiPhongGia;
        
    }  
    async list() {
        let db = await dbmodel.iNit();
        try{
            let [loaiphongs, fields] = await db.query('SELECT * FROM LoaiPhong');
            db.end();
            return (loaiphongs);
        }
        catch(error){
            db.end();
            return(error) ;
        }
        
    }    

    async create(val) {    
        //chèn record mới vào table 
        let db = await dbmodel.iNit();
        //db.config.namedPlaceholders = true;
        console.log(val);
        let sql = "INSERT INTO LoaiPhong(LoaiPhongTen, LoaiPhongGia) values(?,?) ";        
       try{
           let result = await db.execute(sql,[val.LoaiPhongTen, val.LoaiPhongGia]);            
           return ({ "status": 200, "summary": result.ResultSetHeader })
       }catch(error){              
           return ({ "summary": error, "status": 404  })
       }        
    } 
    async update (val) {     
     //cập nhật record vào table
        let db = await dbmodel.iNit();
        let sql = "UPDATE LoaiPhong SET LoaiPhongTen=?,LoaiPhongGia=? WHERE LoaiPhongID = ?";     
        try{
            let result = await db.execute(sql, val);
            return { "status": 200, "rowsAffected": result.affectedRows };
            }
        catch(error){
            return { "status": 404, "errcode": error.code, "errMessage": error.sqlMessage };
        }     
    } 
     async read(id) {
     //trả về chi tiết 1 record từ table
         let db = await dbmodel.iNit();
         try {
             let [loaiphongs, fields] = await db.execute("SELECT * FROM `LoaiPhong` WHERE `LoaiPhongID` = ?", [id]);
             db.end();
             if(loaiphongs.length>0){
                 let responseObject = { status: 200, loaiphongs };
                 return (responseObject);
             }
             else{
                 let responseObject = { status: 404, error: {errorCode: 404, errMessage:"Không có loại phòng này"} };
                 return (responseObject); 
             }
             
         }
         catch (error) {
             db.end();
             let responseObject = { status: 404, error };
             return (responseObject);             
         }        
    } 
    async delete (id) {
     //xóa 1 record
        let db = await dbmodel.iNit();
        let sql = "DELETE FROM LoaiPhong WHERE LoaiPhongID = ?";
        try {
            let result = await db.execute(sql, [id]);            
            return { "status": 200, "rowsAffected": result.affectedRows };
        }
        catch (error) {            
            return { "status": 404, "errcode": error.code, "errMessage": error.sqlMessage };
        } 
    }
}
module.exports = LoaiPhong;

