function sendmessage1(){
    let rtext = "https://wa.me/91" + 8009936009;
    window.open(rtext, 'xyz');
}
function sendmessage2(){
    let rtext = "https://wa.me/91" + 8009926009
    window.open(rtext, 'xyz');
}
function usermsgfun(msg){
    document.getElementById("divusermsg").style.visibility = "visible";
    document.getElementById("usermsg12").innerHTML = msg;
    setTimeout(function(){
        document.getElementById("divusermsg").style.visibility = "hidden";
    }, 2000);
}
function subscribe(){
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'subscriben',
            moduleid: '3',
        },
        //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function subscribe(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if (res === "Saved") {
                    alert("Your trial period of 3 days is started.")
                    window.location.replace('/1/menu')
                }
                else if(res==="used"){
                    alert("Please buy subscription of 1 year, You already used your trial period")
                }
            }
        }
   })
}
function orginfo(){
    document.getElementById("orgnibtn").style.display= 'none';
    document.getElementById("org").style.display= 'block';
    document.getElementById("taskpage").style.display='none';
}
function cancelbutton(){
    document.getElementById("orgnibtn").style.display= 'none';
    document.getElementById("org").style.display= 'block';
}
function saveorginfo(){
if($("#nameorg").val()===''){
    return alert("Enter the oraganiztion name")
}
if($("#orgaddress").val()===''){
    return alert("Enter the address name")
}
if($("#orgcity").val()===''){
    return alert("Enter the city name")
}
if($("#orgstate").val()===''){
    return alert("Enter the state name")
}
if($("#orgemail").val()===''){
    return alert("Enter the email name")
}
if($("#phoneno").val()===''){
    return alert("Enter the mobile number ")
}
// document.getElementById("loader2").style.visibility="visible";
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'saveorginfo',
            nameorg:  $("#orgname").val(),
            phoneno: $("#phoneno").val(),
            orgaddress:  $("#orgaddress").val(),
            orgaddress2:  $("#orgaddress2").val(),
            orgcity:  $("#orgcity").val(),
            orgstate:  $("#orgstate").val(),
            orgemail:  $("#orgemail").val(),
        },
        //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
            usermsgfun("Information saved successfully");
            cancelorgdb();
            window.location.replace('/1/menu')
            }
        }
        
    })
}
function taskpage(){
    var today = new Date();
   today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
   document.getElementById("mainmenu").style.display='none';
   document.getElementById("page").value=today 
}
function noticeboard(){
    retrivenoticeboardname();
    document.getElementById("noticeboardpage").style.display='block';
    document.getElementById("mainmenu").style.display='none';
}
// function orginfo(){
//     document.getElementById("org").style.display="block";
//     document.getElementById("taskpage").style.display="none";
// }
function cancelorgdb(){
    // document.getElementById("mainmenu").style.display="block";
    document.getElementById("mainmenu").style.display='block';
    document.getElementById("org").style.display='none';
    window.location.replace('/1/menu')
}
function updateorginfo(){
    document.getElementById("updateorgnization").style.display='block';
    document.getElementById("mainmenu").style.display='none';
    retrivebgstylecolornb();
    retriveorginfo();
}
function cancelbutton1(){
    document.getElementById("updateorgnization").style.display='none';
    document.getElementById("mainmenu").style.display='block';
}
function retriveorginfo(){
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'retriveorginfo',
        },
        cache: false,
        success: function user(res) {
            document.getElementById("orgname1").value=res[0];
            document.getElementById("phoneno1").value=res[1];
            document.getElementById("uaddress").value=res[2];
            document.getElementById("uaddress2").value=res[3];
            document.getElementById("ucity").value=res[4];
            document.getElementById("ustate").value=res[5];
            document.getElementById("uemail").value=res[6];
        }
    })
}
function updateorg(){
    if($("#orgname1").val()===''){
        return alert("Enter the oraganiztion name")
    }
    if($("#uaddress").val()===''){
        return alert("Enter the address name")
    }
    if($("#ustate").val()===''){
        return alert("Enter the state name")
    }
    if($("#ucity").val()===''){
        return alert("Enter the city name")
    }
    if($("#uemail").val()===''){
        return alert("Enter the email name")
    }
    if($("#phoneno1").val()===''){
        return alert("Enter the mobile name")
    }
    // document.getElementById("loader2").style.visibility="visible";
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'updateorg',
            nameorg:  $("#orgname1").val(),
            phoneno: $("#phoneno1").val(),
            uaddress: $("#uaddress").val(),
            uaddress2: $("#uaddress2").val(),
            ucity: $("#ucity").val(),
            ustate: $("#ustate").val(),
            uemail: $("#uemail").val()
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
            usermsgfun("updated successfully");
        
            }
        }

    })
}
function orgcolornoticeboard(){
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'orgcolornoticeboard',
            csscolor:  $("#csscolor").val(),
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
            
            usermsgfun("updated successfully");
            window.location.replace("/1/menu");
            }
        }

    })

}
function retrivebgstylecolornb(){
    $.ajax({
        url:"/1/noticeboard",
        type: 'POST',
        data: {
            action: 'retrivebgstylecolornb',
        },
        cache: false,
        success: function savecaller(res) {
        //    alert(res)
            var slsn1 = document.getElementById("csscolor")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Color Name')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.name;
                        myOption.value = x.filename;
                        slsn1.add(myOption);
                    }catch(err)
                    {   
                    }
                }
            }      
        }
    })
} 
// function retrivorgcolornb(){
//     $.ajax({
//         url: "/1/noticeboard",
//         type: 'POST',
//         data: {
//             action: 'retrivorgcolornb' ,
//         },
//         cache: false,
//         success: function user(res) {
//             if(res == 'error' || res =='No Image'){
//             }else{
//                 applyorgcolor(res);
//                 // alert(res)
//             }
//         }
//     })  
// }

function settinginfo(){
    document.getElementById("setting").style.display='block';
    document.getElementById("mainmenu").style.display='none';
    retriveallstatus()
    // retriveorginfo();
    retrivestatus()
    // retriveallstatus();
    
}
function closesetting(){
    document.getElementById("setting").style.display='none';
    document.getElementById("mainmenu").style.display='block';
}

// new notice created

function noticeblogo(){
    var uploadimg = document.getElementById("uploadlogon");
    var uploaddata=uploadimg.value;
    if(!uploadimg.files[0]){
        return usermsgfun("Please select file first");
    }
    var size = uploadimg.files[0].size / 1024 /1024;  
   
    var fileext = uploaddata.split(".").pop();
    if(fileext !== 'jpg' && fileext !== 'png' && fileext !== 'jpeg' ){
        return usermsgfun("please select 'jpg' image extention")
    }
    if(size > 1){
        return usermsgfun("please select file less than 1 mb");
    }
        var filestore = uploadimg.files[0];
        var formdata = new FormData();
        formdata.append('image',filestore);
        formdata.append('action','savefile');
        fetch('/1/fileoperations',{method: "POST", body: formdata}).then(response=>response.text()).then(data=>{
            $.ajax({
                url: "/1/noticeboard",
                type: 'POST',
                data: {
                    action: 'noticeblogo',
                    uploaddata:uploaddata
                },
                cache: false,
                success: function savecaller(res) {
                    if(res === 'sessionexpired'){
                        alert("Session Expired, Please login Again")
                        window.location.replace("/1/login")
                    }else{
                        if(res =='error'){
                            usermsgfun("Error while uploading image try again later")
                        }else{
                            getlogonoticeb();
                            usermsgfun("Logo uploded Successfully")
                        } 
                    }
                    }
            })
        })
}
function getlogonoticeb(){
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'getlogonoticeb' 
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res == 'error' || res =='No Image'){
                }else{
                    document.getElementById("loguploadn").innerHTML="<img src='/getnoticelogo/"+res+"' style='margin-left:2%;'>"
                }
            }
        }
    })
}

function closenoticeboardpage(){
    document.getElementById("noticeboardpage").style.display='none';
    document.getElementById("mainmenu").style.display='block';
    document.getElementById("favdialogfile").style.display='none';
    document.getElementById("noticeinformation").style.display='none';
    document.getElementById("allnoticeinfo").style.display='none';
}
function newnoticeboard(){
    document.getElementById("newnoticeboardc").style.display='block';
    document.getElementById("noticebosrdialog").style.display='block';
    document.getElementById("shownoticeboard").style.display='none';
    document.getElementById("newnotice").style.display='none';
    document.getElementById("fileuploadn").style.display='none';
    document.getElementById("enquiryinformation").style.display='none';
    document.getElementById("noticeinformation").style.display='none';
    document.getElementById("allnoticeinfo").style.display='none';
    document.getElementById("updatenoticedialog").style.display='none';
    document.getElementById("updatenotice").style.display='none';
}
function closenewnoticeboard(){
    document.getElementById("newnoticeboardc").style.display='none';
    document.getElementById("noticebosrdialog").style.display='none';
}
function creatnewnoticeboard(){
    if($("#noticeboardtitle").val()===''){
        return alert("Enter the Notice Board Title name")
    }
    if ($("#noticeboarddescription").val().trim() === "") {
        return alert("Enter the Notice Board description ")
       }
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'creatnewnoticeboard',
            noticeboardtitle:$("#noticeboardtitle").val(),
            noticeboarddescription: $("#noticeboarddescription").val()
        },
        cache: false,
        success: function user(res) {
        if(res === 'sessionexpired'){
            alert("Session Expired, Please login Again")
            window.location.replace("/1/login")
        }else{
            if(res==='data insert'){
                retrivenoticeboardname();
                noticeboardtitle.value='';
                noticeboarddescription.value='';
                closenewnoticeboard();
                usermsgfun("Information saved successfully");
            }else{
                usermsgfun(res)
            }
        }
        }  
    })    
}
function retrivenoticeboardname(){
    $.ajax({
        url:"/1/noticeboard",
        type: 'POST',
        data: {
            action: 'retrivenoticeboardname',
        },
        cache: false,
        success: function savecaller(res) {
            var slsn1 = document.getElementById("shownoticeboards")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Notice Board Name')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.noticeboardtitle;
                        myOption.value = x.noticeboardid;
                        slsn1.add(myOption);
                    }catch(err)
                    {   
                    }
                }
            }      
        }
    })
}
function newnoticecreate(){
    shownoticeboards = $("#shownoticeboards").val();
    if(shownoticeboards=='Notice Board Name'){
        usermsgfun("Please Select Notice Board Name ")
        return
    }
    document.getElementById("newnoticeboardc").style.display='none';
  document.getElementById("newnotice").style.display='block';
  document.getElementById("fileuploadn").style.display='none';
  document.getElementById("shownoticeboard").style.display='none';
  document.getElementById("enquiryinformation").style.display='none';
  document.getElementById("noticedialog").style.display='block';
  document.getElementById("noticeinformation").style.display='none';
  document.getElementById("allnoticeinfo").style.display='none';
  document.getElementById("updatenoticedialog").style.display='none';
  document.getElementById("updatenotice").style.display='none';
}
function closenewnotice(){
    document.getElementById("newnotice").style.display='none'; 
}
function creatnewnotice(){
   var shownoticeboards = $("#shownoticeboards").val();
    if($("#noticetitle").val()===''){
        return alert("Enter the Notice Name")
    }
    if ($("#noticedescription").val().trim() === "") {
        return alert("Enter the Notice Text ")
       }
       if ($("#noticestartdate").val().trim() === "") {
        return alert("Enter the Notice Start Date ")
       }
       if ($("#noticenddate").val().trim() === "") {
        return alert("Enter the Notice End Date ")
       }
    //document.getElementById("loader2").style.visibility='visible'
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'creatnewnotice',
            noticetitle:$("#noticetitle").val(),
            noticedescription: $("#noticedescription").val(),
            noticestartdate: $("#noticestartdate").val(),
            noticenddate : $("#noticenddate").val(),
            noticeboardid:shownoticeboards
        },
        cache: false,
        success: function user(res) {
        //document.getElementById("loader2").style.visibility='hidden'
        if(res === 'sessionexpired'){
            alert("Session Expired, Please login Again")
            window.location.replace("/1/login")
        }else{
            if(res==='data insert'){
                noticetitle.value='';
                noticedescription.value='';
                noticestartdate.value='';
                noticenddate.value='';
                closenewnotice();
                usermsgfun("Information saved successfully");
            }else{
                usermsgfun(res)
            }
         }
        }  
    })    
}
function closeupdatenoticedialog(){
    document.getElementById("updatenotice").style.display='none';
    document.getElementById("updatenoticedialog").style.display='none';
}
function editenoticeinfo(noticeid){
    retrivnoticeinfo(noticeid);
   document.getElementById("updatenotice").style.display='block';
   document.getElementById("updatenoticedialog").style.display='block';
   document.getElementById("shownoticeboard").style.display="none";
   document.getElementById("noticedialog").style.display='none';
    document.getElementById("enquirydialog").style.display='none';
    document.getElementById("noticebosrdialog").style.display='none';
    document.getElementById("fileuploadn").style.display='none';
    document.getElementById("noticeinformation").style.display='none';
    document.getElementById("allnoticeinfo").style.display='none';
}
function retrivnoticeinfo(noticeid){
    var shownoticeboards = $("#shownoticeboards").val();
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'retrivnoticeinfo',
            noticeid:noticeid,
            shownoticeboards:shownoticeboards
        },
        cache: false,
        success: function user(res) {
            document.getElementById("noticetitle1").value=res[0];
            document.getElementById("noticedescription1").value=res[1];
            var startDate = new Date(res[2]);
            var startDateFormatted = startDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
            document.getElementById("noticestartdate1").value = startDateFormatted;
            
            // Formatting end date
            var endDate = new Date(res[3]);
            var endDateFormatted = endDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
            document.getElementById("noticenddate1").value = endDateFormatted;
            document.getElementById("noticeidn").value=res[4];
            
        }
    })
}
function updatenoticeinformation(){
    var shownoticeboards = $("#shownoticeboards").val();
    if($("#noticetitle1").val()===''){
        return alert("Enter the notice Title")
    }
    if($("#noticedescription1").val()===''){
        return alert("Enter the Notice Description")
    }
    if($("#noticestartdate1").val()===''){
        return alert("Enter the start data")
    }
    if($("#noticenddate1").val()===''){
        return alert("Enter the end date")
    }
    var noticeid=$("#noticeidn").val();
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'updatenoticeinformation',
            noticetitle1:  $("#noticetitle1").val(),
            noticedescription1: $("#noticedescription1").val(),
            noticestartdate1: $("#noticestartdate1").val(),
            noticenddate1: $("#noticenddate1").val(),
            noticeid:noticeid,
            shownoticeboards:shownoticeboards
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                noticeboardshow();
                closeupdatenoticedialog();
            usermsgfun("updated successfully");
        
            }
        }

    })
}

var today = new Date();
document.getElementById("shownoticedata").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

function noticeboardshow(){
    document.getElementById("enquirydialog").style.display='none';
    document.getElementById("shownoticeboard").style.display='block';
    document.getElementById("fileuploadn").style.display='none';
    document.getElementById("noticeinformation").style.display='none';
    document.getElementById("allnoticeinfo").style.display='none';
    document.getElementById("newnoticeboardc").style.display='none';
    document.getElementById("newnotice").style.display='none';
    // document.getElementById("noticeinformation").style.display="none";
        document.getElementById("updatenoticedialog").style.display='none';
        document.getElementById("updatenotice").style.display='none';
    var shownoticeboards = $("#shownoticeboards").val();
    if(shownoticeboards=='Notice Board Name'){
        usermsgfun("Please Select Notice Board Name ")
       return
   }

   $.ajax({
       url: "/1/noticeboard",
       type: 'POST',
       data: {
           action: 'shownoticeboard',
           shownoticedata:$("#shownoticedata").val(),
           noticeboardid:shownoticeboards,  
       },
       cache: false,
       success: function user(res) {
           if(res === 'sessionexpired'){
               alert("Session Expired, Please login Again")
               window.location.replace("/1/login")
           }else{
               if(res != 'No Task') {
                   document.getElementById("shownoticeboard").innerHTML=res
               }else{
                   document.getElementById("shownoticeboard").innerHTML=res  
               } 
           }   
       }
   })

}

//Show QRCode 

function showQRcode(){
    retrivenoticeboard();
    document.getElementById("mainmenu").style.display='none';
    document.getElementById("showQRCode").style.display='block';
}

function retrivenoticeboard(){
    $.ajax({
        url:"/1/noticeboard",
        type: 'POST',
        data: {
            action: 'retrivenoticeboard',
        },
        cache: false,
        success: function savecaller(res) {
            var slsn1 = document.getElementById("retrivnoticeboardvalues")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Notice Board Name')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.noticeboardtitle;
                        myOption.value = x.noticeboardid;
                        slsn1.add(myOption);
                    }catch(err)
                    {   
                    }
                }
            }      
        }
    })
}
function closeQRCodepage(){
    document.getElementById("showQRCode").style.display='none';
    document.getElementById("showQRCode").style.display='none';
    document.getElementById("mainmenu").style.display='block';
}
function displayqrcode(){
    if($("#retrivnoticeboardvalues").val()==='Notice Board Name' || $("#retrivnoticeboardvalues").val()===''){
        return alert("Please Select Notice Board Name");
    }
    const select = document.getElementById('retrivnoticeboardvalues');
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'shownoticeboardqrcode',
            noticeboardid: $('#retrivnoticeboardvalues').val(),
        },
        cache: false,
        success: function saveattandance(res){
            if(res !== 'error'){
               // document.getElementById("q_formorgname").innerHTML="<h1 style='margin:0px; padding:0px;'>"+res[0]+"</h1>"
                document.getElementById("noticeboard_id").value=res[0];
                document.getElementById("noticename1").innerHTML=select.options[select.selectedIndex].text;
                document.getElementById("noticeqrcode").innerHTML = "<img id='qrcodeimg' src='/getnoticeboardqrcode/" + $('#noticeboard_id').val() + ".png' style='width: 250px; height: 250px;'>";
                document.getElementById("showcallogo").innerHTML="<img width='40px' height='40px' src='/static/image/Calendaree-logo-Original.png'>"
            }  
        }
    })
}
function downloadqrcode() {
    html2canvas(document.getElementById('dqrcode'), {
        onrendered: function(canvas) {
            var link = document.createElement('a');
            link.download = 'noticeboard.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    });
}
//file upload function fileupload(noticeid,orgid){
    function fileupload(noticeid){
        document.getElementById("fileuploadn").style.display='block';
        document.getElementById("favdialogfile").style.display='block'; 
        document.getElementById("noticeinformation").style.display='none';
        document.getElementById("allnoticeinfo").style.display='none';
        document.getElementById("updatenoticedialog").style.display='none';
        document.getElementById("updatenotice").style.display='none';
        document.getElementById("noticedialog").style.display='none';
        document.getElementById("enquirydialog").style.display='none';
        document.getElementById("noticebosrdialog").style.display='none';
         document.getElementById("shownoticeboard").style.display="none";
        var hiddenbox = document.getElementById('noticeid');
        hiddenbox.value = noticeid;
    }
    function saveuploadefile() {
        var hiddenbox = document.getElementById('noticeid');
        var noticeid = hiddenbox.value;
        var uploadrec = document.getElementById("fileupload");
        if (!uploadrec.files[0]) {
            return alert("Please select file first");
        }
        if ($("#filepurposen").val().trim() === "") {
            return alert("Enter the File  Upload Purposen")
           }
        var size = uploadrec.files[0].size / 1024 / 1024;
        var fileext = uploadrec.value.split(".").pop();
        if (fileext != 'png' && fileext != 'jpg' && fileext != 'jpeg' && fileext != 'pdf' && fileext != 'mp3' && fileext != 'mp4') {
            return alert("Please select a file with 'png', 'jpg', 'jpeg', 'pdf', 'mp3', or 'mp4' extension")
        } else if (size > 1) {
            return alert("Please select a file less than 1 MB in size");
        }
        var conf = confirm("Do you want to upload this file?");
    
        if (conf === true) {
            var filestore = uploadrec.files[0];
            var formdata = new FormData();
            formdata.append('image', filestore);
            formdata.append('action', 'savefile');
    
            fetch('/1/fileoperations', { method: "POST", body: formdata }).then(response => response.text()).then(data => {
                $.ajax({
                    url: "/1/noticeboard",
                    type: 'POST',
                    data: {
                        action: 'saveuploadefile',
                        filepurposen: $("#filepurposen").val(),
                        noticeid: noticeid,
                        size: size,
                        filename: uploadrec.value.split('\\').pop().split('/').pop()
                    },
                    cache: false,
                    success: function savecaller(res) {
                        if (res == 'error') {
                            alert("Error while uploading image. Please try again later.");
                        } else {
                            closedialoguploadfile();
                            usermsgfun(res)
                            uploadrec.value = '';
                            filepurposen.value='';                        }
                    }
                });
            });
        }
    }

    function noticeinfo1(noticeid){
        var hiddenbox2 = document.getElementById('noticeid1');
        hiddenbox2.value=noticeid;
        document.getElementById("noticeinformation").style.display='block';
        document.getElementById("allnoticeinfo").style.display='block';
        // document.getElementById("noticedialog").style.display="none"
        document.getElementById("updatenoticedialog").style.display="none";
        document.getElementById("updatenotice").style.display='none';
        document.getElementById("noticedialog").style.display='none';
        document.getElementById("enquirydialog").style.display='none';
        document.getElementById("noticebosrdialog").style.display='none';
         document.getElementById("shownoticeboard").style.display="none";
        document.getElementById("fileuploadn").style.display='none';
        $.ajax({
            url: "/1/noticeboard",
            type: 'POST',
            data: {
                action: 'shownoticeinfo2',
                noticeid:noticeid,
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    document.getElementById("shownoticein").innerHTML=res
                }     
            }
        })
    }
    function downloadfilen1(fileid){
        // alert(fileid +" - notice file id")
        var hiddenbox2 = document.getElementById('noticeid1');
        var noticeid=hiddenbox2.value;
        $.ajax({
            url: "/1/noticeboard",
            type: 'POST',
            data: {
                action: 'downloadfilen1',
                noticeid:noticeid,
                data:fileid,
            },
            cache: false,
            success: function(res){ 
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{ 
                    if(res == 'error' || res =='No Image'){
                        usermsgfun("Document Did Not Exist.")
                    }else{
                        usermsgfun("File Download successfully");
                        var encodedUri = encodeURI('/getnoticefiles/'+res+'');
                        var link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", res);
                        document.body.appendChild(link);
                        link.click(); 
                        
                }
            }
            }
        })
        } 
        function closeinformationdialog(){
            document.getElementById("noticeinformation").style.display='none';
            document.getElementById("allnoticeinfo").style.display='none';
        }
        function closedialoguploadfile(){
            document.getElementById("fileuploadn").style.display='none';
            document.getElementById("favdialogfile").style.display='none';
        }

        //account status 
        function acountstatus(){
            getaccountdetailsn();
            document.getElementById("mainmenu").style.display='none';
            document.getElementById("acountstatusinfo").style.display='block';
        }
        function getaccountdetailsn(){
            $.ajax({
                url: "/1/noticeboard",
                type: 'POST',
                data: {
                    action: 'getaccountdetailsn',
                },
                cache: false,
                success: function user(res) {
                    if(res === 'sessionexpired'){
                        alert("Session Expired, Please login Again")
                        window.location.replace("/1/login")
                    }else{
                        if(res === "error"){
                            usermsgfun("Please check internet connection if the problem persists, contact us")
                        }else{
                            var stdate = new Date(res[2]);
                            var edate = new Date(res[3]);
                            edate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2);
                            stdate = stdate.getFullYear() + '-' + ('0' + (stdate.getMonth() + 1)).slice(-2) + '-' + ('0' + stdate.getDate()).slice(-2);
                            document.getElementById("state").value = res[0];
                            document.getElementById("valid").value = res[1];
                            document.getElementById("stdate").value = stdate;
                            document.getElementById("eddate").value = edate;    
                           // document.getElementById("usedquota").value = res[4]+"MB";
                            if (res[4] === "" || res[4] === undefined || res[4] === null || res[4] === "null") {
                                document.getElementById("usedquota").value = "0 MB";
                            }else{
                                document.getElementById("usedquota").value= res[4]+"MB"  
                            }
                            if (res[5] === "" || res[5] === undefined || res[5] === null || res[5] === "null") {
                                document.getElementById("quota").value = "0 MB";
                            }else{
                                document.getElementById("quota").value= res[5]+"MB"  
                            }
                        }
                    }       
                }
            })
        }
        function cancelaccountstatuspagen(){
            document.getElementById("acountstatusinfo").style.display='none';
            document.getElementById("mainmenu").style.display='block';
        }
//enquiry
function showenquirytable(){
    var shownoticeboards = $("#shownoticeboards").val();
    if(shownoticeboards=='Notice Board Name'){
        usermsgfun("Please Select Notice Board Name ")
       return
       showeq();
   }
   showeq();
    document.getElementById("enquiryinformation").style.display='block';
    document.getElementById("enquirydialog").style.display='block';
    document.getElementById("noticeinformation").style.display='none';
    document.getElementById("updatenoticedialog").style.display='none';
    document.getElementById("updatenotice").style.display='none';
    document.getElementById("shownoticeboard").style.display='none';
    document.getElementById("fileuploadn").style.display='none';
    document.getElementById("newnotice").style.display='none';
    document.getElementById("noticedialog").style.display='none';
    document.getElementById("newnoticeboardc").style.display='none';
    document.getElementById("newnotice").style.display='none';
    
    
    
}        
function closeenquirytb(){
    document.getElementById("enquiryinformation").style.display='none';
}
function showeq(){
    var shownoticeboards = $("#shownoticeboards").val();
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'showeq',
            shownoticeboards:shownoticeboards
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("showenquiryinfo").innerHTML=res
            }     
        }
    })
}
// manege member
function memberinfo(){
    showstaffreport();
    document.getElementById("staffaddinfo").style.display="block";
    document.getElementById("mainmenu").style.display='none';
}
function closemanegestaff(){
    document.getElementById("staffaddinfo").style.display='none';
    document.getElementById("mainmenu").style.display='block';
}
function searchstaff(){
    if($("#staffmobilenumber").val()==='' ){
        usermsgfun("Please enter mobile number or name")
         return
    }
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'searchstaff',
            mobileno:$("#staffmobilenumber").val(),
        },
        cache: false,
        success: function user(res) {
                if (res === 'sessionexpired') {
                    alert("Session Expired, Please login Again");
                    window.location.replace("/1/login");
                } else if (Array.isArray(res)) {
                    // User is registered, update HTML elements
                    document.getElementById("staffname").value = res[1];
                    document.getElementById("staffmail").value = res[2];
                } else {
                    // User is not registered or another error occurred
                    usermsgfun(res);
                }  
        }
    })
}
function assignstaff(){
    $.ajax({
       url: "/1/noticeboard",
       type: 'POST',
       data: {
               action: 'assignstaff',
               addposition:$("#addposition").val(),
               usermobilenumber:$("#staffmobilenumber").val(),
               username:$("#staffname").val(),
               useremail:$("#staffmail").val(),
           },
           cache: false,
           success: function user(res) {
           //document.getElementById("loader2").style.visibility='hidden'
       if (res === 'sessionexpired') {
           alert("Session Expired, Please login Again");
           window.location.replace("/1/login");
       } else {
           if (res === 'Assing staff') {
               addposition.value = '';
               staffmobilenumber.value = '';
               staffname.value = '';
               staffmail.value = '';
               usermsgfun("Staff Save Successfully");
               showstaffreport();
           } else {
               addposition.value = '';
               staffmobilenumber.value = '';
               staffname.value = '';
               staffmail.value = '';
               showstaffreport();
               usermsgfun(res);
           }
          }
           }
       })
   }
   function showstaffreport(){
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'showstaffreportn', 
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res != 'No Record') {
                    
                    document.getElementById("staffreport").innerHTML=res;   
                    
                }else{
                    document.getElementById("staffreport").innerHTML=res;   
                } 
            }                  
        }
    })
} 
function deletestaffinfo(userid){
    var ans = confirm("Do You Want To Delete This Staff")
    if(ans==true){
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'deletestaff',
            userid:userid,
        },
        cache: false,
        success: function user(res) {
            //document.getElementById("loader3").style.visibility='hidden'
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res==='Staff Deleted'){
                    usermsgfun("Staff Deleted")
                    showstaffreport();
                }
            }
        }
    })
    }
}
//delete
function noticedelete(noticeid){
    var ans = confirm("Do You Want To Delete This Notice?");

    if (ans == true) {
        var ansEnquiry = confirm("Do You Want To  Delete Notice enquiry ?");
        var enquiryValue = ansEnquiry ? 'true' : 'false'; // Convert boolean value to string 'true' or 'false'
        $.ajax({
            url: "/1/noticeboard",
            type: 'POST',
            data: {
                action: 'noticedelete',
                noticeid: noticeid,
                enquiry: enquiryValue // Pass enquiry value to the server
            },
            cache: false,
            success: function user(res) {
                if (res === 'sessionexpired') {
                    alert("Session Expired, Please login Again");
                    window.location.replace("/1/login");
                } else {
                    noticeboardshow();
                    usermsgfun(res);
                }
            }
        });
    }else{
        noticeboardshow(noticeid);
        return;
    }
}

function deletenoticefile(fileid){
   var fileida = decodeURIComponent(fileid);
    var hiddenbox2 = document.getElementById('noticeid1');
    var noticeid=hiddenbox2.value;
    var ans = confirm("Do You Want To Delete This Notice")
    if(ans==true){
    $.ajax({
        url: "/1/noticeboard",
        type: 'POST',
        data: {
            action: 'deletenoticefile',
            fileidinfo:fileid,
            fileida:fileida,
            noticeid:noticeid
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                 noticeinfo1(noticeid)
                    usermsgfun(res)
            }
        }
    })
    }
}