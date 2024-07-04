function usermsgfun(msg){
    document.getElementById("divusermsg").style.visibility = "visible";
    document.getElementById("usermsg12").innerHTML = msg;
    setTimeout(function(){
    document.getElementById("divusermsg").style.visibility = "hidden";
    }, 2000);
}
var today = new Date();
document.getElementById("shownoticedata1").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

function noticeboardshow() {
    var nid = window.location.href;
    //alert(nid)
    var noticeid= nid.split("/");
    //alert(noticeid +" notice id")
    var search=noticeid[5];
    //alert(search +" search")
    if(search=="showsearch"){
       
       // alert("hello " + noticeid)
        document.getElementById("searchnotice").style.display="block";
        document.getElementById("enquiry").style.display="none";
        document.getElementById("noticeinformation").style.display="none";
        document.getElementById("shownoticeboard1").style.display="none";
        document.getElementById("orginfo2").style.display="none";
        document.getElementById("orginfo1").style.display="none";
        return
    }
    $.ajax({
        url: "/1/noticeboardQR",
        type: 'POST',
        data: {
            action: 'noticeboardshow',
            shownoticedata: $("#shownoticedata1").val(),
            noticeboardid: noticeid[5] // Add the noticeboardid here
        },
        cache: false,
        success: function (res) {
            if (res === 'sessionexpired') {
                alert("Session Expired, Please login Again");
                window.location.replace("/1/login");
            } else {
                retriveorgname();
                document.getElementById("shownoticeboard1").innerHTML = res;
            }
        },
        error: function (err) {
            console.error('Error:', err);
        }
    });
}
function searchnotices(){
    if($("#searchnoticetext").val()===''){
        return alert("Please Add Notice Board Name first ")
    }
    
    var nid = window.location.href;
    var noticeid= nid.split("/");
    var search=noticeid[5];
    //alert(search)
    $.ajax({
        url: "/1/noticeboardQR",
        type: 'POST',
        data: {
            action: 'searchnotices',
            searchnoticetext:$("#searchnoticetext").val(),
            search:search
        },
        cache: false,
        success: function (res) {
            if (res === 'sessionexpired') {
                alert("Session Expired, Please login Again");
                window.location.replace("/1/login");
            } else {
               //alert(res)
               document.getElementById("showsearchnotice").innerHTML = res;
            }
        }
        
    });

}

// function showNoticeInfo(element, fromDate, toDate, noticeText) {
//     var infoDiv = document.createElement('div');
//     infoDiv.innerHTML = "<strong>From:</strong> " + fromDate + "<br><strong>To:</strong> " + toDate + "<br><br>" + decodeURIComponent(noticeText);
//     infoDiv.style.backgroundColor = 'white';
//     infoDiv.style.padding = '10px';
//     infoDiv.style.border = '1px solid black';
//     //infoDiv.style.width = 'auto'; // Adjust width to fit content height
//     infoDiv.style.height = 'auto';
//     infoDiv.style.maxWidth = '300px'; // Set a maximum width to prevent excessive stretching
//     infoDiv.style.position = 'absolute'; // Position absolutely to prevent interference with other elements
//     infoDiv.style.zIndex = '9999'; // Set a high z-index to ensure visibility
//     infoDiv.style.whiteSpace = 'pre-line'; // Preserve line breaks
//     infoDiv.style.wordWrap = 'break-word'; // Break long words to prevent overflow
//     infoDiv.style.pointerEvents = 'none'; // Ignore mouse events on the info div to prevent interference with the notice elements

//     // Calculate position relative to the viewport
//     var rect = element.getBoundingClientRect();
//     var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
//     var topPosition = rect.top + scrollTop + element.offsetHeight + 5; // Position below the notice element
//     var leftPosition = rect.left + scrollLeft; // Align with the left edge of the notice element

//     infoDiv.style.top = topPosition + 'px';
//     infoDiv.style.left = leftPosition + 'px';

//     // Append to the document body
//     document.body.appendChild(infoDiv);

//     // Add mouseout event listener to remove infoDiv when mouse moves away from the notice element
//     element.addEventListener('mouseout', function() {
//         // Remove the infoDiv when mouse moves away from the notice element
//         infoDiv.remove();
//     });
// } 

function shownb(){
    noticeboardshow();
    document.getElementById("shownoticeboard1").style.display="block";
    document.getElementById("enquiry").style.display="none";
    document.getElementById("noticeinformation").style.display="none";

}

function retriveorgname() {
    var nid = window.location.href;
    var noticeid = nid.split("/");
    
    $.ajax({
        url: "/1/noticeboardQR",
        type: 'POST',
        data: {
            action: 'retriveorgname',
            noticeboardid: noticeid[5]
        },
        cache: false,
        success: function (res) {
            document.getElementById("orgdetails").innerHTML = "<b style='font-size:25px;'>"+res[1]+"</b></br><b>Address</b>: "+res[2]+"</br><b>Contact No</b>: "+res[3]+"</br><b style='margin:0px; padding:0px;'>Notice Board: "+res[0]+"</b>"
        },
        error: function (err) {
            console.error('Error:', err);
        }
    });
}
function closeenquiryd(){
    document.getElementById("enquiry").style.display="none";
    document.getElementById("enquirydialog").style.display="none";
}
function handleEnquiryClick(noticeid,orgid){
    document.getElementById("enquiry").style.display="block";
    document.getElementById("enquirydialog").style.display="block";
    document.getElementById("noticeinformation").style.display="none";
    // document.getElementById("shownoticeboard1").style.display="none";
    var hiddenbox4 = document.getElementById('noticeid2');
    hiddenbox4.value = noticeid;
    var hiddenbox1 = document.getElementById('organizationid');
    hiddenbox1.value = orgid;  
}
function enquiryseve(){
    var hiddenbox4 = document.getElementById('noticeid2');
    var noticeid = hiddenbox4.value;
    var hiddenbox1 = document.getElementById('organizationid');
    var orgid = hiddenbox1.value;
    var nid = window.location.href;
    var noticeide = nid.split("/");
    var nb= noticeide[5]
     if($("#ename").val()===''){
         return alert("Enter the  Name")
     }
     var contactNo = $("#econtactno").val().trim();
    if (contactNo === "") {
        return alert("Enter the contact no");
    }
        if (contactNo.length < 10) {
            return alert("Please enter a valid contact number");
        }
        if ($("#enqtext").val().trim() === "") {
         return alert("Enter the text")
        }
     $.ajax({
         url: "/1/noticeboardQR",
         type: 'POST',
         data: {
             action: 'enquiryseve',
             ename:$("#ename").val(),
             econtactno: contactNo,
             enqtext: $("#enqtext").val(),
             noticeid:noticeid,
             orgid2:orgid,
             noticeboardid: nb
         },
         cache: false,
         success: function user(res) {
         if(res === 'sessionexpired'){
             alert("Session Expired, Please login Again")
             window.location.replace("/1/login")
         }else{
            usermsgfun(res)
            closeenquiryd();
             ename.value='';
             econtactno.value='';
             enqtext.value='';
         }
         }  
     })    
 }
// function fileupload(noticeid,orgid){
//     document.getElementById("fileuploadn").style.display="block";
//     document.getElementById("favdialogfile").style.display="block"; 
//     document.getElementById("noticeinformation").style.display="none";
//     var hiddenbox = document.getElementById('noticeid');
//     hiddenbox.value = noticeid;
   
//     var hiddenbox1 = document.getElementById('organizationid');
//     hiddenbox1.value = orgid; 
// }

// function saveuploadefile(){
//     var hiddenbox = document.getElementById('noticeid');
//     var noticeid = hiddenbox.value;
//     var hiddenbox1 = document.getElementById('organizationid');
//     var orgid = hiddenbox1.value;

//     var uploadrec = document.getElementById("fileuploadn");
// if (!uploadrec || !uploadrec.files || !uploadrec.files[0]) {
//     return alert("Please select a file first");
// }

//     var size = uploadrec.files[0].size / 1024 / 1024;
//     var fileext = uploadrec.value.split(".").pop();
//     alert(size + "23")
//     if (fileext != 'png' && fileext != 'jpg' && fileext != 'jpeg' && fileext != 'pdf' && fileext != 'mp3' && fileext != 'mp4') {
//         return alert("please select 'png' , 'jpg' , 'jpeg' , 'pdf' extention")
//     } else if (size > 1) {
//         return alert("please select file less than 1 mb");
//     }
//     var conf = confirm("Do You Want TO Upload This File!!!! ");

//     if (conf === true) {
//         var filestore = uploadrec.files[0];
//         var formdata = new FormData();
//         formdata.append('image', filestore);
//         formdata.append('action', 'savefile');

//         fetch('/1/fileoperations', { method: "POST", body: formdata }).then(response => response.text()).then(data => {
//             $.ajax({
//                 url: "/1/noticeboardQR",
//                 type: 'POST',
//                 data: {
//                     action: 'saveuploadefile',
//                     filepurposen:$("#filepurposen").val(),
//                     noticeid: noticeid,
//                     orgid:orgid,
//                     size:size,
//                     filename: uploadrec.value.split('\\').pop().split('/').pop()
//                 },
//                 cache: false,
//                 success: function savecaller(res) {
//                     if (res == 'error') {
//                      alert("Error while uploading image try again later")
//                     } else {
//                         //uploadrec.value = '';
                        
//                     }
//                 }
//             })
//         })
//     }
// }

// function saveuploadefile() {
//     var hiddenbox = document.getElementById('noticeid');
//     var noticeid = hiddenbox.value;
//     alert(noticeid +" -noticeid")
//     var hiddenbox1 = document.getElementById('organizationid');
//     var orgid = hiddenbox1.value;
//     alert(orgid+ " - orgid")
//     var uploadrec = document.getElementById("fileupload");
//     if (!uploadrec.files[0]) {
//         return alert("Please select file first");
//     }
//     var size = uploadrec.files[0].size / 1024 / 1024;
//     var fileext = uploadrec.value.split(".").pop();
//     alert(size + "23")
//     if (fileext != 'png' && fileext != 'jpg' && fileext != 'jpeg' && fileext != 'pdf' && fileext != 'mp3' && fileext != 'mp4') {
//         return alert("Please select a file with 'png', 'jpg', 'jpeg', 'pdf', 'mp3', or 'mp4' extension")
//     } else if (size > 1) {
//         return alert("Please select a file less than 1 MB in size");
//     }
//     var conf = confirm("Do you want to upload this file?");

//     if (conf === true) {
//         var filestore = uploadrec.files[0];
//         var formdata = new FormData();
//         formdata.append('image', filestore);
//         formdata.append('action', 'savefile');

//         fetch('/1/fileoperations', { method: "POST", body: formdata }).then(response => response.text()).then(data => {
//             $.ajax({
//                 url: "/1/noticeboardQR",
//                 type: 'POST',
//                 data: {
//                     action: 'saveuploadefile',
//                     filepurposen: $("#filepurposen").val(),
//                     noticeid: noticeid,
//                     orgid: orgid,
//                     size: size,
//                     filename: uploadrec.value.split('\\').pop().split('/').pop()
//                 },
//                 cache: false,
//                 success: function savecaller(res) {
//                     if (res == 'error') {
//                         alert("Error while uploading image. Please try again later.");
//                     } else {
//                         //uploadrec.value = '';
//                     }
//                 }
//             });
//         });
//     }
// }
function noticeinfo(noticeid,orgid){
    // alert(noticeid +" - " + orgid)
    var hiddenbox2 = document.getElementById('noticeid1');
    hiddenbox2.value=noticeid;
    var hiddenbox2 = document.getElementById('orginfo');
    hiddenbox2.value=orgid;
    
    document.getElementById("noticeinformation").style.display="block";
    // document.getElementById("shownoticeboard1").style.display="none";
    document.getElementById("allnoticeinfo").style.display="block";
    document.getElementById("enquiry").style.display="none";
    $.ajax({
        url: "/1/noticeboardQR",
        type: 'POST',
        data: {
            action: 'shownoticeinfo1',
            noticeid:noticeid,
            orgid:orgid
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                //alert(res)
                document.getElementById("shownoticei").innerHTML=res
            }     
        }
    })
}

function downloadfilen(fileid1){
    var hiddenbox2 = document.getElementById('noticeid1');
    var noticeid=hiddenbox2.value;
    var hiddenbox2 = document.getElementById('orginfo');
    var orgid=hiddenbox2.value;
    // alert(noticeid +" - " + orgid)
   // alert(fileid1 )
    // alert(taskid  +"...file1")
    //alert(fileId +"'''''''''''''")
    $.ajax({
        url: "/1/noticeboardQR",
        type: 'POST',
        data: {
            action: 'downloadfilen',
            noticeid:noticeid,
            data:fileid1,
            orgid:orgid
        },
        cache: false,
        success: function(res){  
            alert(res)
            if(res == 'error' || res =='No Image'){
                alert("Document Did Not Exist.")
            }else{
                usermsgfun("File Download successfully");
                var encodedUri = encodeURI('/getnoticefilesQR/'+ res.fileid + '?orgid=' + orgid);
                //alert(encodedUri)
                //alert("hello")
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", res.fileid);
                document.body.appendChild(link);
                link.click(); 
                 
           }
        }
    })
    } 
    function closeinfodialog(){
        document.getElementById("noticeinformation").style.display="none";
    }
