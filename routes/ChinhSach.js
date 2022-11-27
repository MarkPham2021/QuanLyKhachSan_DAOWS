var express = require('express');
var router = express.Router();
const ChinhSach = require('../models/ChinhSach');
const PhieuThuePhong = require('../models/PhieuThuePhong');
const Util = require('../Until/presentProcess');
const chinhsach = new ChinhSach();
const phieuthuephong = new PhieuThuePhong();
router.get('/',async function (req, res, next) {
    //chức năng trả về danh sách các record
    //phương thức request: get
    //lấy ra các record trong table
    //trả về danh sách các products dạng json
    let response = await chinhsach.list();
    res.json(response);
});

router.post('/create',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện chèn record mới vào table 
    //trả về thông báo qua trang chinhsachResult 
    chinhsach.end();
    let _chinhsach = [1, req.body.NgayHieuLuc, '2099-12-31', req.body.hesogiaKhachTrongNuoc, req.body.hesogiaKhachNuocNgoai, req.body.tylePhuThu, req.body.sokhachluutruToiDa];
    let response = await chinhsach.create(_chinhsach);
    res.json(response);
});

router.get('/detail/:id',async function (req, res, next) {
    //chức năng trả về chi tiết 1 record
    //phương thức request: get
    //tiếp nhận id của reord trong url
    //lấy ra record theo id từ table
    //trả về chi tiết record trong page phongDetail
    let id = req.params.id;
    let chinhsachs = await chinhsach.read(id);
    res.json(chinhsachs);
});

router.post('/update/:id',async function (req, res, next) {
    //chức năng nhận thông tin để cập nhật thông tin chính sách trong table 
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //Kiểm tra chính sách đã được áp dụng trong phiếu thuê phòng nào chưa, chỉ có thể sửa đổi chính sách chưa được sử dụng
    //thực hiện cập nhật record vào table 
    
    let id = req.params.id;        
    let val = [req.body.SoKhachLuuTruToiDa, req.body.TyLePhuThu, req.body.HeSoGiaKhachTrongNuoc, req.body.HeSoGiaKhachNuocNgoai, 
        req.body.HieuLuc, req.body.NgayHieuLuc, req.body.NgayHetHieuLuc, id];    
    let ketquacapnhat ={};
    let reply = await canChangeChinhSach(id);
    if (reply){
        ketquacapnhat = await chinhsach.update(val);
        console.log(ketquacapnhat);
    }else{
        ketquacapnhat = {status: 500, summary: 'Không thể thay đổi vì đã có phiếu thuê phòng áp dụng.'}
    }
    res.json(ketquacapnhat);
});

router.post('/delete/:id',async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa record
    //trả về kết quả xóa trong page phongResult
    let id = req.params.id;
    let ketquacapnhat = {};
    let reply = await canChangeChinhSach(id);
    if (reply) {
        ketquacapnhat = await chinhsach.delete(id);
        
    } else {
        ketquacapnhat = { status: 500, summary: 'Không thể xóa vì đã có phiếu thuê phòng áp dụng.' }
    }
    res.json(ketquacapnhat);
});
async function canChangeChinhSach(chinhsachid){
    let tinhsophieuthuephongapdung = await phieuthuephong.applyChinhSach(chinhsachid);
    let sophieuthuephongapdung = tinhsophieuthuephongapdung[0].Count_PhieuThueID;
    if(sophieuthuephongapdung>0) return false;
    else return true;
}
module.exports = router;
