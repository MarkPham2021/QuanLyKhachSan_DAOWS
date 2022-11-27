var express = require('express');
var router = express.Router();
const PhieuThuePhong = require('../models/PhieuThuePhong');
const PhieuTraPhong = require('../models/PhieuTraPhong');
const CTPhieuThuePhong = require('../models/CTPhieuThuePhong');
const KHCN = require('../models/KhachHangCaNhan');
const Phong = require('../models/Phong');
const Util = require('../Until/presentProcess');
const ChinhSach = require('../models/ChinhSach');
const khcn = new KHCN();
const chinhsach = new ChinhSach();
const phong = new Phong();
const phieuthuephong = new PhieuThuePhong();
const phieutraphong = new PhieuTraPhong();
const ctphieuthuephong = new CTPhieuThuePhong();
router.get('/',async function (req, res, next) {
    //chức năng trả về danh sách các phiếu thuê phòng
    //phương thức request: get
    //lấy ra các record từ database
    //trả về danh sách các phiếu thuê phòng trong page phieuthuephongIndex

    let result =await phieutraphong.list();
    res.json(result);
        
});

router.get('/create/:phieuthueid',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: get
    //Lấy thông tin phieuthuephong theo para phieuthueid để tra ve App
    let phieuthueid = req.params.phieuthueid;
    let phieuthuephongs = await phieuthuephong.readtoCreatePhieuTraPhong(phieuthueid);
    res.json(phieuthuephongs);
    
});
router.post('/create',async function (req, res, next) {
    //chức năng nhận thông tin lập phiếu thuê phòng từ 'phieuthuephongAdd' để lập phiếu thuê 'phieuthuephongSave';
    //phương thức request: post;
    //tiếp nhận dữ liệu gửi trong body request;
    //thực hiện Lấy thông tin khách hàng;
    //trả về trang xác nhận lập phiếu:'phieuthuephongSave'  với thông tin khách hàng đầy đủ.   
    
    let val = req.body;
    let _phong = val.Phong;
    let _phongid = _phong.split('|')[0];
    let _khachhang = val.khachhang;
    let _khachhangid = _khachhang.split('|')[0];
    let _phieutraphong = [_khachhangid, val.PhieuThueID, val.NgayTra, val.DonGiaCoSo, val.TyLePhuThu, val.HeSoGia, val.DonGiaThanhToan, val.SoNgayThue, val.ThanhTien,0];
    let _thongtinthuephongcapnhat = [val.NgayTra, val.ThanhTien, 0, val.PhieuThueID];
    //sql update phieuthuephong: "UPDATE PhieuThuePhong SET NgayTra  =?, ThanhTien =?, isActive = ? WHERE PhieuThueID = ?";
    let result = await phieutraphong.create(_phieutraphong);
    if (result.status == 200) {
        //Nếu tạo phiếu trả phòng thành công, chuyển trạng thái phòng thuê thành phòng trống, phiếu thuê phòng thành hết hiệu lực
        let setphongAvailable = await phong.release(_phongid);
        let capnhatphieuthuephong = await phieuthuephong.updateTraPhong(_thongtinthuephongcapnhat);
    }
    res.json(result);
});
router.get('/detail/:id',async function (req, res, next) {
    //chức năng trả về chi tiết 1 phiếu thuê phòng
    //phương thức request: get
    //tiếp nhận id của record trong url
    //lấy thông tin phiếu thuê phòng từ table PhieuThuePhong left join Phong left join LoaiPhong; chi tiết phiếu thuê phòng từ CTPhieuThuePhong left join KhachHangCaNhan;
    //Xử lý dữ liệu và trả về trang phieuthuephongDetail.
    let id = req.params.id;
    let _phieutraphongs =await phieutraphong.read(id);       
    let phieuthueid = _phieutraphongs[0].PhieuThueID;
    let _phieuthuephongs = await phieuthuephong.readtoCreatePhieuTraPhong(phieuthueid);
    let _ctptps = await ctphieuthuephong.listptp(phieuthueid);    
    res.json({ _phieuthuephongs, _ctptps, _phieutraphongs });
    
});
router.post('/delete/:id',async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa  các record CTPhieuThuePhong => xóa record PhieuThue Phong; release phong;
    //trả về thông báo json đã xóa
    let id = req.params.id;
    let _phieutraphongs = await phieutraphong.read(id);
    let phongid = _phieutraphongs[0].PhongID;
    let phieuthueid = _phieutraphongs[0].PhieuThueID;
    let result = await phieutraphong.delete(id);
    if(result.status==200){
        //Nếu xóa phiếu trả phòng thành công, chuyển trạng thái phòng thuê thành phòng đang cho thuê, phiếu thuê phòng thành đang có hiệu lực
        let setphongOccupy = await phong.occupy(phongid);
        let _thongtinthuephongcapnhat = ['9999-12-31', 0, 1, phieuthueid];
        //sql update phieuthuephong: "UPDATE PhieuThuePhong SET NgayTra  =?, ThanhTien =?, isActive = ? WHERE PhieuThueID = ?";
        let capnhatphieuthuephong = await phieuthuephong.updateXoaTraPhong(_thongtinthuephongcapnhat);
    }
    res.json(result);
});

module.exports = router;