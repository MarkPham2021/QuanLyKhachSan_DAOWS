var express = require('express');
var router = express.Router();

//var db = require('./../models/database'); //nhúng module kết nối db
const QuocTich = require('./../models/quoctich');
const quoctich = new QuocTich();

router.get('/', async function (req, res, next) {
    //chức năng trả về danh sách các record
    //phương thức request: get
    //lấy ra các record trong table
    //trả về danh sách các products dạng json
    let result = await quoctich.list();    
    res.json(result);
});

router.post('/create', async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện chèn record mới vào table 
    //trả về thông báo kết quả dạng json 
    let val = req.body;
    let result = await quoctich.create(val);
    if (result.status == 404) {
        let thaotac = { "ten": "thêm mới quoc tich" };
        let ketqua = result;
        let responseObject = { thaotac, ketqua };

        res.json(responseObject);
    }
    else {
        let thaotac = { "ten": "thêm mới quoc tich" };
        let ketqua = result;
        let responseObject = { thaotac, ketqua };
        res.json(responseObject);
    }

});
router.get('/detail/:id', async function (req, res, next) {
    //chức năng trả về chi tiết 1 record
    //phương thức request: get

    let id = req.params.id;
    let results = await quoctich.read(id)
    res.json(results);

});

router.post('/update/:id', async function (req, res, next) {
    //chức năng cập nhật record trong table 
    //phương thức request: put
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện cập nhật record vào table 
    //trả về thông báo json đã cập nhật
    let val = [req.body.QuocTichCode, req.body.QuocGia, req.params.id];
    let ketqua = await quoctich.update(val);
    let thaotac = { "ten": "cập nhật thông tin quoc tich" };
    let responseObject = { thaotac, ketqua };
    res.json(responseObject);
});
router.post('/delete/:id', async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa record
    //trả về thông báo json đã xóa
    let id = req.params.id;
    let ketqua = await quoctich.delete(id);
    let thaotac = { "ten": "Xoá thông tin quoc tich" };
    let responseObject = { thaotac, ketqua };
    res.json(responseObject);
});
module.exports = router;