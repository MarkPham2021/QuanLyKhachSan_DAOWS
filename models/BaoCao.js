'use strict'
const dbmodel = require("./DataBase");
let baocaoModel = {
    taoBaoCaoDoanhThu: async function(val){
        let db = await dbmodel.iNit();
        
        //  1: ngaythue va ngay tra deu nam trong ky bao cao:
        let doanhthu1, doanhthu2, doanhthu3,doanhthu4, fields1, fields2, fields3, fields4;
        
        
        let sql1 = `select LoaiPhong.LoaiPhongID, LoaiPhong.LoaiPhongTen, LoaiPhongDoanhThu 
            from LoaiPhong left join(select Sum(TongHop.DoanhThuPhanBo) AS LoaiPhongDoanhThu, TongHop.LoaiPhongID AS LPID 
                from (select PhieuThuePhong.PhongID, LoaiPhong.LoaiPhongID as LoaiPhongID, LoaiPhong.LoaiPhongTen,
                DATEDIFF(PhieuThuePhong.NgayTra,PhieuThuePhong.NgayThue)*PhieuThuePhong.DonGiaThanhToan AS DoanhThuPhanBo 
                    from PhieuThuePhong left join Phong on PhieuThuePhong.PhongID = Phong.PhongID 
                    left join LoaiPhong on LoaiPhong.LoaiPhongID = Phong.LoaiPhongID 
                    where PhieuThuePhong.NgayThue between '${val[0]}' and '${val[1]}' AND  PhieuThuePhong.NgayTra between '${val[0]}' and '${val[1]}') as TongHop 
            group by LPID) as DoanhThu on LoaiPhong.LoaiPhongID = LPID`;
        
        [doanhthu1, fields1] = await db.query(sql1);           
        
        //  2: ngaythue nam truoc ngaybatdau va ngay tra nam trong ky bao cao:
        
        let sql2 = `select LoaiPhong.LoaiPhongID, LoaiPhong.LoaiPhongTen, LoaiPhongDoanhThu 
            from LoaiPhong left join(select Sum(TongHop.DoanhThuPhanBo) AS LoaiPhongDoanhThu, TongHop.LoaiPhongID AS LPID 
                from (select PhieuThuePhong.PhongID, LoaiPhong.LoaiPhongID as LoaiPhongID, LoaiPhong.LoaiPhongTen,
                (DATEDIFF(PhieuThuePhong.NgayTra,'${val[0]}')+1)*PhieuThuePhong.DonGiaThanhToan AS DoanhThuPhanBo 
                    from PhieuThuePhong left join Phong on PhieuThuePhong.PhongID = Phong.PhongID  
                    left join LoaiPhong on LoaiPhong.LoaiPhongID = Phong.LoaiPhongID 
                    where PhieuThuePhong.NgayThue < '${val[0]}' AND  PhieuThuePhong.NgayTra between '${val[0]}' and '${val[1]}') as TongHop 
            group by LPID) as DoanhThu on LoaiPhong.LoaiPhongID = LPID`;
        [doanhthu2, fields2] = await db.query(sql2);
        
        //  3: ngaythue nam trong ky bao cao va ngay tra nam sau ngay ket thuc hoac ngaytra chua co (null):
        let sql3 = `select LoaiPhong.LoaiPhongID, LoaiPhong.LoaiPhongTen, LoaiPhongDoanhThu 
            from LoaiPhong left join(select Sum(TongHop.DoanhThuPhanBo) AS LoaiPhongDoanhThu, TongHop.LoaiPhongID AS LPID 
                from (select PhieuThuePhong.PhongID, LoaiPhong.LoaiPhongID as LoaiPhongID, LoaiPhong.LoaiPhongTen,
                DATEDIFF('${val[1]}',PhieuThuePhong.NgayThue)*PhieuThuePhong.DonGiaThanhToan AS DoanhThuPhanBo 
                    from PhieuThuePhong left join Phong on PhieuThuePhong.PhongID = Phong.PhongID 
                    left join LoaiPhong on LoaiPhong.LoaiPhongID = Phong.LoaiPhongID 
                    where (PhieuThuePhong.NgayThue between '${val[0]}' and '${val[1]}') AND  (PhieuThuePhong.NgayTra > '${val[1]}' or PhieuThuePhong.NgayTra IS NULL )) as TongHop 
            group by LPID) as DoanhThu on LoaiPhong.LoaiPhongID = LPID`;
        [doanhthu3, fields3] = await db.query(sql3);
        //  4: ngaythue nam truoc ngay bat dau va ngay tra nam sau ngay ket thuc hoac ngaytra chua co (null):
        let sql4 = `select LoaiPhong.LoaiPhongID, LoaiPhong.LoaiPhongTen, LoaiPhongDoanhThu 
            from LoaiPhong left join(select Sum(TongHop.DoanhThuPhanBo) AS LoaiPhongDoanhThu, TongHop.LoaiPhongID AS LPID 
                from (select PhieuThuePhong.PhongID, LoaiPhong.LoaiPhongID as LoaiPhongID, LoaiPhong.LoaiPhongTen,
                DATEDIFF('${val[1]}','${val[0]}')*PhieuThuePhong.DonGiaThanhToan AS DoanhThuPhanBo 
                    from PhieuThuePhong left join Phong on PhieuThuePhong.PhongID = Phong.PhongID 
                    left join LoaiPhong on LoaiPhong.LoaiPhongID = Phong.LoaiPhongID 
                    where (PhieuThuePhong.NgayThue < '${val[0]}') AND  (PhieuThuePhong.NgayTra > '${val[1]}' or PhieuThuePhong.NgayTra IS NULL )) as TongHop 
            group by LPID) as DoanhThu on LoaiPhong.LoaiPhongID = LPID`;
        [doanhthu4, fields4] = await db.query(sql4);
        //doanhthu trong ky bao cao = doanhthu1+doanhthu2+doanhthu3+doanhthu4:
        for(let i = 0; i<doanhthu1.length; i++){
            doanhthu1[i].LoaiPhongDoanhThu = parseInt(dbmodel.nullisZero(doanhthu1[i].LoaiPhongDoanhThu))+ parseInt(dbmodel.nullisZero(doanhthu2[i].LoaiPhongDoanhThu)) +
                                           parseInt(dbmodel.nullisZero(doanhthu3[i].LoaiPhongDoanhThu)) + parseInt(dbmodel.nullisZero(doanhthu4[i].LoaiPhongDoanhThu));
        }
        return doanhthu1;
    },
    taoBaoCaoMatDoSuDung: async function (val){
        let db = await dbmodel.iNit();

        //  1: ngaythue va ngay tra deu nam trong ky bao cao:
        let ngaythue1, ngaythue2, ngaythue3, ngaythue4, fields1, fields2, fields3, fields4;


        let sql1 = `select Phong.PhongID, Phong.PhongSo, SoNgayThue 
            from Phong left join(select Sum(TongHop.SoNgayPhanBo) AS SoNgayThue, TongHop.PhongID AS PID 
                from (select PhieuThuePhong.PhongID, 
                DATEDIFF(PhieuThuePhong.NgayTra,PhieuThuePhong.NgayThue) AS SoNgayPhanBo 
                    from PhieuThuePhong left join Phong on PhieuThuePhong.PhongID = Phong.PhongID
                    where PhieuThuePhong.NgayThue between '${val[0]}' and '${val[1]}' AND  PhieuThuePhong.NgayTra between '${val[0]}' and '${val[1]}') as TongHop 
            group by PID) as DoanhThu on Phong.PhongID = PID`;

        [ngaythue1, fields1] = await db.query(sql1);

        //  2: ngaythue nam truoc ngaybatdau va ngay tra nam trong ky bao cao:

        let sql2 = `select Phong.PhongID, Phong.PhongSo, SoNgayThue 
            from Phong left join(select Sum(TongHop.SoNgayPhanBo) AS SoNgayThue, TongHop.PhongID AS PID 
                from (select PhieuThuePhong.PhongID,
                (DATEDIFF(PhieuThuePhong.NgayTra,'${val[0]}')+1) AS SoNgayPhanBo 
                    from PhieuThuePhong left join Phong on PhieuThuePhong.PhongID = Phong.PhongID 
                    where PhieuThuePhong.NgayThue < '${val[0]}' AND  PhieuThuePhong.NgayTra between '${val[0]}' and '${val[1]}') as TongHop 
            group by PID) as DoanhThu on Phong.PhongID = PID`;
        [ngaythue2, fields2] = await db.query(sql2);

        //  3: ngaythue nam trong ky bao cao va ngay tra nam sau ngay ket thuc hoac ngaytra chua co (null):
        let sql3 = `select Phong.PhongID, Phong.PhongSo, SoNgayThue 
            from Phong left join(select Sum(TongHop.SoNgayPhanBo) AS SoNgayThue, TongHop.PhongID AS PID 
                from (select PhieuThuePhong.PhongID,
                DATEDIFF('${val[1]}',PhieuThuePhong.NgayThue) AS SoNgayPhanBo 
                    from PhieuThuePhong left join Phong on PhieuThuePhong.PhongID = Phong.PhongID 
                    where (PhieuThuePhong.NgayThue between '${val[0]}' and '${val[1]}') AND  (PhieuThuePhong.NgayTra > '${val[1]}' or PhieuThuePhong.NgayTra IS NULL )) as TongHop 
            group by PID) as DoanhThu on Phong.PhongID = PID`;
        [ngaythue3, fields3] = await db.query(sql3);
        //  4: ngaythue nam truoc ngay bat dau va ngay tra nam sau ngay ket thuc hoac ngaytra chua co (null):
        let sql4 = `select Phong.PhongID, Phong.PhongSo, SoNgayThue 
            from Phong left join(select Sum(TongHop.SoNgayPhanBo) AS SoNgayThue, TongHop.PhongID AS PID 
                from (select PhieuThuePhong.PhongID,
                DATEDIFF('${val[1]}','${val[0]}') AS SoNgayPhanBo 
                    from PhieuThuePhong left join Phong on PhieuThuePhong.PhongID = Phong.PhongID 
                    where (PhieuThuePhong.NgayThue < '${val[0]}') AND  (PhieuThuePhong.NgayTra > '${val[1]}' or PhieuThuePhong.NgayTra IS NULL )) as TongHop 
            group by PID) as DoanhThu on Phong.PhongID = PID`;
        [ngaythue4, fields4] = await db.query(sql4);
        //songaythue trong ky bao cao = ngaythue1+ngaythue2+ngaythue3+ngaythue4:
        for (let i = 0; i < ngaythue1.length; i++) {
            ngaythue1[i].SoNgayThue = parseInt(dbmodel.nullisZero(ngaythue1[i].SoNgayThue)) + parseInt(dbmodel.nullisZero(ngaythue2[i].SoNgayThue)) +
                parseInt(dbmodel.nullisZero(ngaythue3[i].SoNgayThue)) + parseInt(dbmodel.nullisZero(ngaythue4[i].SoNgayThue));
        }
        return ngaythue1;
       
    },
    tinhDoanhthu: function(tungay, denngay, dongia){
        tungay = new Date(tungay);
        denngay = new Date(denngay);
        if(tungay>=denngay){
            return 0;
        }else{
            let songay = (denngay - tungay) / 1000 / 3600 / 24;
            return songay*dongia;
        }
    }
}

module.exports = baocaoModel;