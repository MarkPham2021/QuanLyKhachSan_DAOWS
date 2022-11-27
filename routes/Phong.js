var express = require('express');
var router = express.Router();
const Phong = require('./../models/Phong');
const phong = new Phong();

router.get('/', async function (req, res, next) {
    //chức năng trả về danh sách các record
    //phương thức request: get
    //lấy ra các record trong table
    //trả về danh sách các products dạng json
    let phongs = await phong.list();
    res.json(phongs);
});
router.post('/create',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện chèn record mới vào table 
    //trả về ket qua them moi
    let val = req.body;
    let result = await phong.create(val);
    let thaotac = { "ten": "thêm mới phòng" };
    let ketqua = result;
    let responseObject = { thaotac, ketqua };
    res.json(responseObject);    
});
router.get('/detail/:id', async function (req, res, next) {
    //chức năng trả về chi tiết 1 record
    //phương thức request: get
    //tiếp nhận id của reord trong url
    //lấy ra record theo id từ table
    //trả về chi tiết record trong page phongDetail
    let id = req.params.id;
    let room = await phong.read(id);
    res.json(room);
});
router.post('/update/:id',async function (req, res, next) {
    //chức năng nhận thông tin để cập nhật thông tin record trong table 
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện cập nhật record vào table 
    //trả về thông báo kết quả cập nhật trong page phongResult.
    let id = req.params.id;
    let val = [req.body.PhongSo, req.body.LoaiPhongID, req.body.KhuVuc, req.body.Tang, req.body.MoTa, req.body.TinhTrang, id];
    let result = await phong.update(val);
    let thaotac = { "ten": "Thay đổi thông tin phòng" };
    let ketqua = result;
    let responseObject = { thaotac, ketqua };
    res.json(responseObject);
});
router.post('/delete/:id',async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa record
    //trả về kết quả json.
    let id = req.params.id;
    let ketqua = await phong.delete(id);
    let thaotac = { "ten": "Xoá thông tin phòng" };
    let responseObject = { thaotac, ketqua };
    res.json(responseObject);    
});
module.exports = router;