var express = require('express');
var router = express.Router();

//var db = require('./../models/database'); //nhúng module kết nối db
const LoaiPhong = require('./../models/LoaiPhong');
const Util = require('./../Until/presentProcess');
const loaiphong = new LoaiPhong();
/* Cách viết 1: load trang web index phải refresh lại mới có dữ liệu.
router.get('/', function (req, res, next) {
   //chức năng trả về danh sách các record
   //phương thức request: get
   //lấy ra các record trong table
   //trả về danh sách các products dạng json
   let data = loaiphong.list();
   for(let i = 0; i<data.length; i++){
      data[i].LoaiPhongGia = Util.numberFormat.format(data[i].LoaiPhongGia);
   }
   res.render("loaiphongIndex", { danhsach: data });
});
*/
router.get('/', async function (req, res, next) {
   //chức năng trả về danh sách các record
   //phương thức request: get
   //lấy ra các record trong table
   //trả về danh sách các products dạng json
   let result = await loaiphong.list();
   for (let i = 0; i < result.length; i++) {
      result[i].LoaiPhongGia = Util.numberFormat.format(result[i].LoaiPhongGia);
   }
   res.json(result); 
});
router.get('/create', function (req, res, next) {
   //chức năng thêm mới record vào table
   //phương thức request: get
   //Mở form nhập thông tin 
   res.render("loaiphongAdd");
});
router.post('/create', async function (req, res, next) {
   //chức năng thêm mới record vào table
   //phương thức request: post
   //tiếp nhận dữ liệu gửi trong body request
   //thực hiện chèn record mới vào table 
   //trả về thông báo kết quả dạng json 
   let val = req.body;
   
   let result = await loaiphong.create(val);
      if (result.status==404) {
         let thaotac = { "ten": "thêm mới loại phòng" };
         let ketqua = result;
         let responseObject ={thaotac, ketqua};
         
         res.json(responseObject);
      }
      else {
         let thaotac = { "ten": "thêm mới loại phòng" };
         let ketqua = result;
         let responseObject = {thaotac, ketqua };         
         res.json(responseObject);
      }

});
router.get('/detail/:id', async function (req, res, next) {
   //chức năng trả về chi tiết 1 record
   //phương thức request: get
   
   let id = req.params.id;   
   let results = await loaiphong.read(id)
   res.json(results);

});

router.post('/update/:id', async function (req, res, next) {
   //chức năng cập nhật record trong table 
   //phương thức request: put
   //tiếp nhận dữ liệu gửi trong body request
   //thực hiện cập nhật record vào table 
   //trả về thông báo json đã cập nhật
   let val = [req.body.LoaiPhongTen, req.body.LoaiPhongGia, req.params.id];
   let ketqua = await loaiphong.update(val);
   let thaotac = { "ten": "cập nhật thông tin loại phòng" };
   let responseObject={thaotac, ketqua};
   res.json(responseObject);
});
router.post('/delete/:id', async function (req, res) {
   //chức năng xóa 1 record trong table
   //phương thức request: post
   //tiếp nhận id trong url
   //thực hiện xóa record
   //trả về thông báo json đã xóa
   let id = req.params.id;   
   let ketqua = await loaiphong.delete(id);
   let thaotac = { "ten": "Xoá thông tin loại phòng" };
   let responseObject = { thaotac, ketqua };
   res.json(responseObject);
});
module.exports = router;