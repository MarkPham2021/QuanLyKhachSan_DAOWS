var express = require('express');
var router = express.Router();
const KHCN = require('../models/KhachHangCaNhan');
const QuocTich = require('../models/quoctich');
const Util = require('../Until/presentProcess');
const khcn = new KHCN();
const quoctich = new QuocTich();
router.get('/', async function (req, res, next) {
    //chức năng trả về danh sách các record
    //phương thức request: get
    //lấy ra các record trong table
    //trả về danh sách các products dạng json
    let khcns = await khcn.list();
    res.json(khcns);
});
router.post('/create',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện chèn record mới vào table 
    //trả về thông báo kết quả dạng json
    req.body.dupcheck = req.body.LoaiGTCNID.toString() + req.body.GiayToCNSo;
    let thongtinQuocTich = req.body.QuocTichId.split('|');
    let quoctichid = thongtinQuocTich[0];
    let val = [req.body.CaNhanTen, req.body.LoaiGTCNID, req.body.GiayToCNSo, req.body.GioiTinh, req.body.NgaySinh, quoctichid, req.body.DiaChi,req.body.DienThoai,req.body.Email,req.body.LoaiKhachID, req.body.dupcheck ];
    let result = await khcn.create(val);
    res.json(result);
});

router.get('/search', function (req, res, next) {
    //chức năng tìm kiếm
    //phương thức request: get
    //Lấy thông tin quốc tịch để thiết kế select quốc tịch trên form thêm mới
    //Mở form nhập thông tin
    quoctich.list((d) => {
        res.render("khcnSearch", { quoctich: d });
    });
});
router.post('/search',async function (req, res, next) {
    //chức năng trả về danh sách các record thỏa điều kiện tìm kiếm
    //phương thức request: post
    //lấy ra các record trong các table liên quan    
    let dupcheck = '%' + req.body.LoaiGTCNID.toString() + req.body.GiayToCNSo + '%';
    let canhanid = "%" + req.body.CaNhanID + "%";
    let canhanten = '%' + req.body.CaNhanTen + '%';
    let dienthoai = '%' + req.body.DienThoai + '%';
    let val = [canhanid, canhanten, dienthoai, dupcheck];    
    let khcns = await khcn.search(val);
    res.json(khcns);
});
router.get('/detail/:id', async function (req, res, next) {
    //chức năng trả về chi tiết 1 record
    //phương thức request: get
    //tiếp nhận id của reord trong url
    //lấy ra record theo id từ table
    //trả về chi tiết record dạng json
    let id = req.params.id;
    let khcns = await khcn.read(id);
    res.json(khcns);
});
router.get('/findbyid/:id', async function (req, res, next) {
    //chức năng trả về các thông tin chi tiết theo yêu cầu lập phiếu thuê phòng
    
    let id = req.params.id;
    let khcns = await khcn.findid(id);
    res.json(khcns);
});
router.post('/update/:id', async function (req, res, next) {
    //chức năng cập nhật record trong table 
    //phương thức request: put
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện cập nhật record vào table 
    //trả về thông báo json đã cập nhật
    let id = req.params.id;
    let thongtinQuocTich = req.body.QuocTichId.split('|');
    let quoctichid = thongtinQuocTich[0];
    req.body.dupcheck = req.body.LoaiGTCNID.toString() + req.body.GiayToCNSo;
    
    let val = [req.body.CaNhanTen, req.body.LoaiGTCNID, req.body.GiayToCNSo, req.body.GioiTinh, req.body.NgaySinh, quoctichid, req.body.DiaChi, req.body.DienThoai, req.body.Email, req.body.LoaiKhachID, req.body.dupcheck, id];
    
    let result = await khcn.update(val);
    res.json(result);
});
router.post('/delete/:id',async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa record
    //trả về thông báo json kết quả xóa
    let id = req.params.id;
    let result = await khcn.delete(id);
    res.json(result);
});

module.exports = router;