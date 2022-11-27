$(document).ready(function () {
            
    $("#btnDel").click(function () {        
        $("#khach").remove()
        const myCollection = document.getElementsByTagName("input"); 
        let num = parseInt(myCollection.length/2) -3;
        $("#tongsoKhach").val(num);
    });
    
    $("#btnAdd").click(function () {
        //lấy số khách có thể lưu trú tối đa 1 phòng
        let nmax = $("#tongsoKhachMax").val();
        //lấy thứ tự của khách đã đăng ký bằng cách đếm số button trên trang html
        const myCollection = document.getElementsByTagName("input"); 
        let num = parseInt(myCollection.length/2) -2 ;        
        //Kiểm tra xem số khách đăng ký không được vượt số khách tối đa có thể lưu trú
        if(num<=nmax){
            /* Câu lệnh thêm dòng có thông tin loại gtcn và số gtcn: chưa làm được tính năng này
            $("#secCuoi").before('<div class="row" id="khach"><div class="input-group-text col-lg-1 mb-3"><input type="number" class="form-control" name="STT" id="STT"></div><div class="input-group-text col-lg-3 mb-3"><input type="number" class="form-control" name="CaNhanID" id="CaNhanID" placeholder="ID"></div><div class="input-group-text col-lg-2 mb-3"><input type="text" class="form-control" name="HuongDan" id="HuongDan" value="Hoặc" readonly ></div><div class="input-group-text col-lg-3 mb-3"><select type="text" class="form-control" name="LoaiGTCNID" id="LoaiGTCNID" readonly ><option value="">Chọn ...</option><option value="1">CMND</option><option value="2">CCCD</option><option value="3">Hộ chiếu</option></select></div><div class="input-group-text col-lg-3 mb-3"><input type="text" class="form-control" name="GTCNSo" id="GTCNSo" placeholder="GTCN số" readonly></div> </div>');                    
            */
            $("#secCuoi").before('<div class="row" id="khach"><div class="input-group-text col-lg-3 mb-3"><input type="number" class="form-control" name="STT" id="STT"></div><div class="input-group-text col-lg-4 mb-3"><input type="number" class="form-control" name="CaNhanID" id="CaNhanID" placeholder="ID"></div></div>');                    
            $("#STT").val(num);
            $("#tongsoKhach").val(num);            
            $("#STT").attr({"id":['STT'+num]});            
        }
        else alert("Số khách đăng ký không được vượt số khách tối đa là: " + nmax + " người/phòng.");
    });            
});
function getConfirmation_Delete() {
    var retVal = confirm("Bạn chắc chắn muốn xóa?");
    if (retVal == true) {
        document.getElementById("btn_Xoa").setAttribute("type", "Submit");
    }
    else if (retVal == false) {
        alert("Bạn đã hủy yêu cầu xóa!");
    }
}
function rowaddRemove() {        
    $(this).parent("div").remove();
    const myCollection = document.getElementsByTagName("input"); 
    let num = parseInt(myCollection.length/2) -3;
    $("#tongsoKhach").val(num);
}
function quay_lai_trang_truoc(){
    history.back();
}
      
