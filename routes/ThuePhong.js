var express = require('express');
var router = express.Router();
const PhieuThuePhong = require('../models/PhieuThuePhong');
const CTPhieuThuePhong = require('../models/CTPhieuThuePhong');
const KHCN = require('../models/KhachHangCaNhan');
const Phong = require('../models/Phong');
const Util = require('../Until/presentProcess');
const ChinhSach = require('../models/ChinhSach');
const khcn = new KHCN();
const chinhsach = new ChinhSach();
const phong = new Phong();
const phieuthuephong = new PhieuThuePhong();
const ctphieuthuephong = new CTPhieuThuePhong();
router.get('/', async function (req, res, next) {
    //chức năng trả về danh sách các phiếu thuê phòng
    //phương thức request: get
    //lấy ra các record từ database
    //trả về danh sách các phiếu thuê phòng trong page phieuthuephongIndex
    let d = await phieuthuephong.list();
    res.json(d);    
});

router.get('/create',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: get
    //Lấy thông tin loại phòng để thiết kế select loại phòng trên form thêm mới
    //Mở form nhập thông tin
    let chinhsachs = await chinhsach.listStatus(1);
    let phongs = await phong.list(1);
    let khcns = await khcn.list();    
    res.json({chinhsachs, phongs, khcns});
});
router.post('/save',async function (req, res, next) {
    //chức năng nhận thông tin phieuthuephongSave để thêm mới dữ liệu vào database gồm: Thêm mới PhieuThuePhong và CTPhieuThuePhong
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request    
    //trả kết quả xử lý ra dạng json.
    //Xu ly du lieu tu req.body:
    let sokhach = parseInt(req.body.tongsoKhach);
    let thongtinPhong = req.body.Phong.split('|');
    let phongid = parseInt(thongtinPhong[0]);
    let khachids =[];
    let stt = [];
    if(sokhach<2){
        khachids[0]= req.body.CaNhanID;
        stt[0]= req.body.STT;
    }
    else{
        khachids = req.body.CaNhanID;
        stt = req.body.STT;
    }
    let hfr = 0;
    if (req.body.hasForeigner === 'Yes') { hfr = 1; }
    
    //Tao du lieu dang array cho phieu thue phong
    let val = [phongid, req.body.NgayThue, req.body.NgayTraDuKien, sokhach, req.body.tongsoKhachMax, hfr, req.body.ChinhSachID, req.body.isActive, req.body.DonGiaThanhToan];
    
    //Tao moi phieu thue phong bang cach goi method create cua PhieuThuePhong
    let ketquaTaoPhieuThuePhong = await phieuthuephong.create(val);    
    let taothanhcongnctptp = 0;
    let ketquataoCTPTP={};
    if(ketquaTaoPhieuThuePhong.status==200){
        //lay thong tin PhieuThuePhongID
        let phieuthuephongid = ketquaTaoPhieuThuePhong.summary[0].insertId;
        //chuyen trang thai phong da cho thue
        let setOccupy = await phong.occupy(phongid);
        //them moi cac ctphieuthuephong
        for (let i = 0; i < sokhach; i++) {
            let ctptp = [phieuthuephongid, stt[i], khachids[i]];
            ketquataoCTPTP = await ctphieuthuephong.create(ctptp);;
            if(ketquataoCTPTP.status==200){
                taothanhcongnctptp ++;
            }else{
                break;
            }
        }
    }
    let taoThanhCong=404;
    if(ketquaTaoPhieuThuePhong.status==200 && ketquataoCTPTP.status==200){
        taoThanhCong =200;        
    }
    let responseObject = {status: taoThanhCong, TaoPhieuThuePhong: ketquaTaoPhieuThuePhong, TaoChiTietPTP: ketquataoCTPTP, soChitietPTPdataoThanhCong:taothanhcongnctptp};    
    
    res.json(responseObject);
    
});
router.get('/detail/:id',async function (req, res, next) {
    //chức năng trả về chi tiết 1 phiếu thuê phòng
    //phương thức request: get
    //tiếp nhận id của record trong url
    //lấy thông tin phiếu thuê phòng từ table PhieuThuePhong left join Phong left join LoaiPhong; chi tiết phiếu thuê phòng từ CTPhieuThuePhong left join KhachHangCaNhan;
    //Xử lý dữ liệu và trả về trang phieuthuephongDetail.
    let id = req.params.id;
    let phieuthuephongs = await phieuthuephong.read(id);
    let ctphieuthuephongs = await ctphieuthuephong.listptp(id);    
    res.json({phieuthuephongs, ctphieuthuephongs});
});

router.post('/delete/:id',async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa  các record CTPhieuThuePhong => xóa record PhieuThue Phong; release phong;
    //trả về thông báo json đã xóa
    let id = req.params.id;
    let thongtinphong = req.body.Phong.split("|");
    let phongid = thongtinphong[0];
    let ketquaXoaCTPTP = await ctphieuthuephong.delete(id);
    let realeaseRoom = await phong.release(phongid); 
    let ketquaXoaPTP = await phieuthuephong.delete(id); 
    let xoaThanhCong = 404;
    if (ketquaXoaPTP.status == 200 && ketquaXoaCTPTP.status == 200) { xoaThanhCong = 200 }
    let responseObject = { status: xoaThanhCong, XoaPhieuThuePhong: ketquaXoaPTP, XoaChiTietPTP: ketquaXoaCTPTP};
    res.json(responseObject);
});

router.get('/dsphong',async (req, res)=>{
    //api trả về thông tin cho trang danh sách phòng khi get trang
    let data = await phong.listrooms(2);
    res.json(data);
})
router.post('/dsphong', async (req, res,) =>{
    //api trả về thông tin cho trang danh sách phòng khi post điều kiện lọc
    let st = req.body.tinhtrangid;
    let data = await phong.listrooms(st);
    res.json(data);
});
router.get('/search',async (req, res)=>{
    let data = await phong.list();
    res.json(data);
})
router.post('/search',async (req, res)=>{
    //api tra ve ket qua tim kiem phieu thue phong va danh sach phong de render lai page tim kiem
    
    let phieuthueid='%%';
    let phongid='%%';
    let isactive ='%%';
    let today = new Date();
    let ngaythuetu = "1900-01-01";
    let ngaythueden = new Date("3000-12-31");
    let ngaytratu = "1900-01-01";
    let ngaytraden = "3000-12-31";
    let val = req.body;
    console.log(val);
    if(req.body.PhieuThueID == null || req.body.PhieuThueID.trim() =="" ){
        phieuthueid='%'+ '%'; 
    }
    else {phieuthueid=req.body.PhieuThueID;}
    if(req.body.Phong == null || req.body.Phong.trim() =="" ){
        phongid='%%'; 
    }
    else {let ttp = req.body.Phong.split('|'); phongid=ttp[0];}
    isactive=req.body.isActive;
    if(req.body.NgayThueTu == null || req.body.NgayThueTu.trim() =="" ){
        ngaythuetu = "1900-01-01";
    }
    else {ngaythuetu=req.body.NgayThueTu;}
    if(req.body.NgayThueDen == null || req.body.NgayThueDen.trim() =="" ){
        ngaythueden = Util.dinhdangNgayDate(ngaythueden); 
    }
    else {ngaythueden=req.body.NgayThueDen;}
    if(req.body.NgayTraTu == null || req.body.NgayTraTu.trim() =="" ){
        ngaytratu = "1900-01-01";
    } 
    else {ngaytratu=req.body.NgayTraTu;}
    if(req.body.NgayTraDen == null || req.body.NgayTraDen.trim() =="" ){
        ngaytraden = "3000-12-31";
    }
    else {ngaytraden=req.body.NgayTraDen;}    
    let setsearch = [phieuthueid, phongid, isactive,ngaythuetu, ngaythueden, ngaytratu, ngaytraden];
    console.log(setsearch);
    let data = await phieuthuephong.search(setsearch);
    let _phongs = await phong.list(2);
    res.json({phongs: _phongs, phieuthuephongs: data});
})
module.exports = router;