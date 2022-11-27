var express = require('express');
var router = express.Router();
const baocaoModel = require('../models/BaoCao');

router.get('/', async function (req, res, next) {
    //chức năng trả về danh sách các phiếu thuê phòng
    //phương thức request: get
    //lấy ra các record từ database
    //trả về danh sách các phiếu thuê phòng trong page phieuthuephongIndex

    let result = await phieutraphong.list();
    res.json(result);

});

router.post('/create', async function (req, res, next) {
    //chức năng nhận thông tin lập phiếu thuê phòng từ 'phieuthuephongAdd' để lập phiếu thuê 'phieuthuephongSave';
    //phương thức request: post;
    //tiếp nhận dữ liệu gửi trong body request;
    //thực hiện Lấy thông tin khách hàng;
    //trả về trang xác nhận lập phiếu:'phieuthuephongSave'  với thông tin khách hàng đầy đủ.   
    
    let loaibaocao = req.body.LoaiBaoCao;
    let tungay = req.body.Ngaybatdau;
    let denngay = req.body.Ngayketthuc;
    let val = [tungay, denngay];
    let result=[];
    if (loaibaocao==1){
        result = await baocaoModel.taoBaoCaoDoanhThu(val);
    }else{
        result = await baocaoModel.taoBaoCaoMatDoSuDung(val);
    }
        
    res.json(result);
});
module.exports = router;