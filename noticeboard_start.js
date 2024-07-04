var ENVCALURL = "";
// var ENVCALURL = "https://dev.calendaree.com:55000"
const https = require('https');
var busboy = require('connect-busboy');
const http = require('http');
const mysql = require('mysql');
const express = require('express');//manage servers and routes
var bodyParser = require('body-parser');
const crypto = require ("crypto");
const session = require('express-session');
const { Console, info, error } = require('console');
const { query } = require('express');
const app=express();
// app.use(bodyParser.json());
var up = bodyParser.urlencoded({ extended: false });
const oneDay = 1000 * 60 * 60 * 24;
const {v4 : uuidv4, validate} = require('uuid');
const multer = require("multer");
const fs = require('fs');
const QRCode = require('qrcode');
const base64ToImage = require('base64-to-image');
const base64ToFile = require('base64-to-file');
const { func } = require('assert-plus');
const { resolve } = require('path');
const { execFileSync } = require('child_process');
const { bashCompletionSpecFromOptions } = require('dashdash');
app.use("/static", express.static("static"));
//app.use(fileUpload());
const port = 55000;
const host = 'localhost';
var stats = ""
app.set('views', './views');
app.set('view engine', 'pug');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const csvtojson = require('csvtojson');

// export const isAuthenticated = async (req, res, next) => {
//     res.set('isAuth', true);
//     next();
// }


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay}
  }))

  app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
}));

//   secret - a random unique string key used to authenticate a session. It is stored in an environment variable and can’t be exposed to the public. The key is usually long and randomly generated in a production environment.

// resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request. This can result in a race situation in case a client makes two parallel requests to the server. Thus modification made on the session of the first request may be overwritten when the second request ends. The default value is true. However, this may change at some point. false is a better alternative.

// saveUninitialized - this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.

// cookie: { maxAge: oneDay } - this sets the cookie expiry time. The browser will delete the cookie after the set duration elapses. The cookie will not be attached to any of the requests in the future. In this case, we’ve set the maxAge to a single day as computed by the following arithmetic.

app.get("/1/login",function(req, res){
    req.session.destroy();
    res.render("login.pug")
})
const tempdocstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./userdata/tempfiles");
    },
    onError : function(err, next) {
        console.log('error', err);
        next(err);
    },    
    filename: (req, file, cb) => {
        const fileExtension = file.originalname
        req.session.filename = fileExtension
        // console.log(req.session.sessionid+ ' file upload ' + req.session.userid)
        cb(null, req.session.userid+"."+fileExtension.split(".").pop());
    },
})
const uploadtemp = multer({
    storage: tempdocstorage,
    limits: { fileSize: 209715200000}
})

app.get('/getattendanceuser/:filename', (req, res) => {
    fname = "./userdata/download/"+ req.params.filename
    //console.log(fname +" Address")

    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res); 
    }
 });
app.post("/1/fileoperations",uploadtemp.single('image'), async (req,res)=>{

//   app.post("/1/fileoperations",uploadtemp.single('video'), async (req,res)=>{
    if(!req.session.userid){
        res.send("sessionexpired")
    }else if(req.body.action == 'savefile'){
        console.log("save file -")
        res.send("ok")
    }else if(req.body.action == 'retriveimage'){
        console.log("retriv file -")
        retrivefile(req,res)
    }else if(req.body.action == 'replacefile'){
        console.log("replacefile file -")
        replacefile(req,res)
    }else if(req.body.action == 'deletefile'){
        console.log("delete file -")
        deletefile(req,res)
    }
    else{
        console.log("Wrong Choice")
    }
})

//image trtriv
function retrivefile(req,res,fileid1,path1,orgid,successfun){
    var fileid = fileid1
    console.log(path1 +" path1")
    var nameoftempfol = path1
    let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
    fcon.query(sql,function(err,result){
        console.log(sql + " retrive query 123")
        //console.log(result)
        if(err) console.log(err)
        else if(result.length>0){
            if (fs.existsSync("./userdata1/" + nameoftempfol)){
                
            }else{
                fs.mkdir("./userdata1/"+nameoftempfol,{ recursive: true }, function(err){
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("New directory successfully created.")
                    }
                })
            }
            try {
                let path = "./userdata1/" + nameoftempfol+"/"
                console.log(path+" retrivefile path")
                let filename1 = result[0].filename
                console.log(filename1 +"122")
                let filename = filename1.split(".")
                //  console.log(filename[0])
                //  console.log(filename[1] )
                var optionalObj = {'fileName': filename[0], 'type': filename[1]};
                base64ToImage(result[0].file,path,optionalObj);
                successfun(filename1)
                console.log(filename1)     
            } catch (error){
                successfun("error")
            }
        }else{
            successfun("No Image")
        }
    })
}
//retrivefile1

function retrivefile1(req,res,fileid1,path1,orgid,successfun){
    var fileid = fileid1
    // console.log(path1 +" path1")
    var nameoftempfol = path1
    let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
    fcon.query(sql,function(err,result){
        if(err){
            console.log(err)
        }else if(result.length>0){
            var arr=[];
        arr.push(result[0].filename)
        arr.push(result[0].file)
        arr.push(result[0].file.length)
        successfun(arr);
        }else{
            console.log("file not found")
            successfun("File not Found")
        }
    })
}
// video retriv
// function retrivefile(req,res,fileid1,path1,orgid,successfun){
//     //console.log("123456")
//     var fileid = fileid1
//    // console.log(fileid +"  fileid")
//     var nameoftempfol = path1
//     //console.log(nameoftempfol +" nameoftempfol")
//     let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
//     fcon.query(sql,function(err,result){
//        // console.log(sql)
//         //console.log(result)
//         if(err) console.log(err)
//         else if(result.length>0){
//             if (fs.existsSync("./userdata/" + nameoftempfol)){
                
//             }else{
//                 fs.mkdir("./userdata/"+nameoftempfol,{ recursive: true }, function(err){
//                     if (err) {
//                         console.log(err)
//                     } else {
//                         console.log("New directory successfully created.")
//                     }
//                 })
//             }
//             try {
//                 let path = "./userdata/" + nameoftempfol+"/"
//                 // console.log(path+" retrivefile path")
//                 let filename1 = result[0].filename
//                 let filename = filename1.split(".")
//                 //console.log(filename[0] +"")
//                 //console.log(filename[1] +"3333")
//                 var optionalObj = {'fileName': filename[0], 'type': filename[1]};
//                 //console.log(optionalObj.fileName + " " + optionalObj.type +" optionalObj")
//                 // base64ToImage(result[0].file,path,optionalObj);
//                 let obj1 = result[0].file.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
//                 obj1 = obj1.replace(/ /g, '+'); // <--- this is important
//                 fs.writeFile(path+filename1, obj1, 'base64', function(err) {
//                    // console.log(err);
//                 });
//                 //  base64ToFile(result[0].file, path, optionalObj);
//                 // base64ToVideo(result[0].file,path,optionalObj);
//                 successfun(filename1)
//                 //console.log(filename1 +"   *filename1")     
//             } catch (error){
//                 console.log(error)
//                 successfun("error")
//             }
//         }else{
//             successfun("No Image")
//         }
//     })
// }

//---------------------------Update Quote Savefiledb, replace file,deletefile,retrivefile---------------------------
function savefiledb(req,res,orgid,successfun){
    let fileid = uuidv4(); 
    console.log(fileid +" --fileid")
    let success = fileid
    // console.log( success +" succ....")
    // console.log(req.session.filename +"  ..filename")
    if(req.session.filename == undefined || req.session.filename == 'undefined')
    {
        return successfun("error while uploading");
    }
    let fileExtension = req.session.filename.split(".").pop()
   console.log( fileExtension +" ...fileExtension")
    const file = "./userdata/tempfiles/"+req.session.userid+"."+fileExtension
    // console.log(file + " - file ***")
    if (fs.existsSync(file)){
        var bitmap = fs.readFileSync(file);
        // console.log(" - bitmap ***")
        let png = "data:image/"+fileExtension+";base64,"
        // console.log(png + " - png ***")
        var fileurl = Buffer.from(bitmap).toString('base64');
        png = png + fileurl
    //    console.log(file +"file -" + png+ +"-png")
        if (!file){
            console.log(" - !file ***")
           return successfun("Please upload a file.");
        }
        var sql = "insert into uploadfile(orgid,fileid,filename,file,date)values('"+orgid+"','"+fileid+"','"+req.session.filename+"','"+png+"',now())"
        try{
            fcon.query(sql,function(err,result){
                // console.log(  "......"+sql +" .. fcon  1234567890")
                if(err) console.log(err)
                else if(result.affectedRows>0){
                  return successfun(success);
                }else{
                    return successfun("error while uploading");
                }
            }) 
        } catch (error) {
            return successfun("error while uploading");
        }       
    } 
    else{
       return successfun("error while uploading")
    }
}

function savefiledb1(filename,filecontent, orgid, successfun) {
    let fileid = uuidv4();
    console.log(fileid + " --fileid");
    
    let fileExtension = filename.split(".").pop();
    console.log(fileExtension + " ...fileExtension");

    // Convert file content to base64
    let fileBase64 = filecontent.toString('base64');
    let fileurl = "data:image/" + fileExtension + ";base64," + fileBase64;
    // let fileurl = "data:image/" + fileExtension + ";base64,"; 
    var sql = "insert into uploadfile(orgid,fileid,filename,file,date)values('"+orgid+"','"+fileid+"', '"+filename+"', '"+fileurl+"', now())";
    try {
      fcon.query(sql,function (err, result) {
        // console.log("......" + sql + " .. fcon");
        if (err) {
          console.log(err);
          return successfun("error while uploading");
        } else if (result.affectedRows > 0) {
          return successfun(fileid); 
        } else {
          return successfun("error while uploading");
        }
      });
    } catch (error) {
      return successfun("error while uploading");
    }
}


function replacefile(req,res,orgid,fileid,successfun){
    if(req.session.filename == undefined || req.session.filename == 'undefined')
    {
        return successfun("error");
    }    
    let fileExtension = req.session.filename.split(".").pop()
    const file = "./userdata/tempfiles/"+req.session.userid+"."+fileExtension
    if (fs.existsSync(file)){
        var bitmap = fs.readFileSync(file);
        let png = "data:image/"+fileExtension+";base64,"
        var fileurl = Buffer.from(bitmap).toString('base64');
        png = png + fileurl
        if (!file) {
           successfun("Please upload a file.");
        }
        var sql = "update uploadfile set filename='"+req.session.filename+"', file='"+png+"', date=now() where fileid like'"+fileid+"' and orgid like'"+orgid+"'";
        fcon.query(sql,function(err,result){
            //console.log(sql)
            //console.log(result)
            if(err) console.log(err)
            else if(result.affectedRows>0){
                successfun("Updated")
            }else{
                successfun("error")
            }
        })            
    } 
    else{
        successfun("error")
    }
}

function deletefile(req,res,fileid,orgid,successfun){
    if(fileid == null || fileid == undefined || fileid == '' || fileid === 'undefined' || fileid === 'null'){
        successfun("Please send fileid")
    }else{
        var sql ="delete from uploadfile where orgid like'"+orgid+"' and fileid like '"+fileid+"'";
        fcon.query(sql,function(err,result){
            console.log(sql +" file db delet function")
            if(err) {
                console.log(err)
                successfun("err")
            }else if(result.affectedRows>0){
                successfun("file Deleted")
            }else{
                successfun("File Not Existed")
            }
        })
    }
}

app.post("/1/login",up,(req,res)=>{
    if(req.body.action==="loginbutton"){ 
        // console.log("hello")
        var mobileno=req.body.mobileno;
        var password =req.body.password;
        var sql = "select * from usermaster_t.users where mobile like '"+mobileno+"' and password like '"+password+"'"
        //   console.log(sql)
        mcon.query(sql,function(error, results){
        // console.log(sql+"............")     
        st1 = [];
              if (error) {
                console.log(error)
            } else if (results.length > 0) {
                st1.push(results.name)
                //  console.log(st1)
                req.session.userid = results[0].userid;
                //  console.log(req.session.userid +" userid")
                req.session.username = results[0].name;
                req.session.mobileno = results[0].mobileno;
                req.session.password = results[0].password;
                req.session.email = results[0].email;
                req.session.save();
                res.send("yes")
                // console.log(req.session.userid)
                // console.log(req.session.mobileno +"  mobile n")
                // console.log("save")
            }  else {
                 res.send("Invalid username or password.")
             }
        })
    }else if(req.body.action==="saveregister"){
        var username=req.body.username;
        var mobileno=req.body.mobileno;
        var email=req.body.email;
        var password=req.body.password;
        // var compassword=req.body.compassword;
        var userid=uuidv4();
        var sql = "select * from usermaster_t.users where mobile = '"+mobileno+"'";
        var sql1 = "insert into usermaster_t.users(userid,name,password,mobile,email) values('"+userid+"','"+username+"','"+password+"','"+mobileno+"','"+email+"')"
        mcon.query(sql,function(err,result1){
            //   console.log(sql+"register")
            if(err)console.log(err)
            else if(result1.length>0){
                //console.log(res)
                res.send("User Already Exist")
            }
             else{
                mcon.query(sql1,function(err,result){
                    if(err)console.log(err)
                    else if(result.length>0){
                        //  console.log("not")
                        res.send("error")
                    }else{
                        res.send("save")
                         }
                })
            }
        }) 
    }
})
// app.get("/1/menu", (req, res) => {
//     // console.log("here menu page.....")
//     if(!req.session.userid){
//         // confirm.log("asmi")
//         res.redirect("/1/login")
//     }else if(req.session.userid) {
//         username = req.session.username
//         email = req.session.email
//         mobileno = req.session.mobileno
//         console.log(req.session.mobileno + " - req.session.mobileno")
//         // console.log("showing menu for "+username+" "+email+" "+mobileno+"")
//         //mcon.query("select * from modules where is visible like 'yes'")
//         console.log("menu.pug",{user: req.session.userid, username: username,mobileno:mobileno});
//         res.render("menu.pug",{user: req.session.userid, username: username,mobileno:mobileno});
//     }
// });
app.get("/1/menu", (req, res) => {
    if(!req.session.userid){
        res.redirect("/1/login")
    }
    if(req.session.userid) {
        username = req.session.username
        email = req.session.email
        mobile = req.session.mobile
        // console.log("showing menu for "+username+" "+email+" "+mobile)
        mcon.query("select * from modules where isvisible like 'yes'")
        res.render("menu.pug",{user: req.session.userid, username: username});
    }
});
app.get("/1/Calendareemainpage",function(req, res){
    req.session.destroy();
    res.render("Calendareemainpage.pug")
})
app.post("/1/Calendareemainpage",up,async (req,res)=>{
    // if(!req.session.userid){
    //     res.send("sessionexpired")
    //     //res.redirect("/1/login")
    // }
})

//--------------------------------My New Project------------------------------------

//task register
const ucon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pranalimu$24',
    database: 'user',
    port: 3306
 });

 const fcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'filesdb_t',
    port: 45203
});

const trcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'taskregister_t',
    port: 45203
})
const ncon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'noticeboard_t',
    port: 45203
})

const mcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'usermaster_t',
    port: 45203
});

app.get('/getnoticelogo/:filename', (req, res) => {
    // filename="9841827e-f5c6-4343-bf4b-b1c024ae496206a8e5c4-802e-454e-8c0b-2f5a4ae3cd1a.pdf"
    fname = "./userdata/noticeboardlogo/"+req.session.orgid+"/"+ req.params.filename
    console.log(fname)
    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res); 
    }
 });
 app.get('/getnoticefiles/:filename', (req, res) => {
    // filename="9841827e-f5c6-4343-bf4b-b1c024ae496206a8e5c4-802e-454e-8c0b-2f5a4ae3cd1a.pdf"
    // fname = "./userdata/noticeboardfiles/"+req.session.orgid+"/"+req.params.filename
    //console.log(fname)
    // if (fs.existsSync(fname)){
    //    var readStream = fs.createReadStream(fname);
    //     // We replaced all the event handlers with a simpleh call to readStream.pipe()
    //     readStream.pipe(res); 
    // }

    var x=req.params.filename;
    var x2= x.split(".");
    var path="";
    var fileid = x2[0];
    retrivefile1(req, res, fileid, path, req.session.orgid, (successfun) => {
        if (!successfun) {
            res.send('File not found');
            return;
        }   
        var x1=successfun[0];
        var x3= x1.split(".");
        var fileidm = x3[1];
        // console.log(fileidm + " fileid x2----")
        const base64 = successfun[1].split(';base64,').pop();
        const base641 = Buffer.from(base64, 'base64');
        if(fileidm=='jpeg' || fileidm === 'jpg'){
        res.setHeader('Content-Type', 'image/jpeg');
        // console.log(" - img ****")
        }else{
            
            res.setHeader('Content-Type', 'application/pdf'); 
            // console.log(" - pdf ****")
        }
        res.setHeader('Content-Length', base641.length);

        res.end(base641);
    });
 });
 app.get('/getnoticefilesQR/:filename', (req, res) => {
    // filename="9841827e-f5c6-4343-bf4b-b1c024ae496206a8e5c4-802e-454e-8c0b-2f5a4ae3cd1a.pdf"
    //fname = "./userdata/noticeboardfilesQR/"+req.params.filename
    //console.log(fname)
    // if (fs.existsSync(fname)){
    //    var readStream = fs.createReadStream(fname);
    //     // We replaced all the event handlers with a simpleh call to readStream.pipe()
    //     readStream.pipe(res); 
    // }

    var x=req.params.filename;
    const orgid = req.query.orgid;
    console.log(orgid + " QR orgid")
    var x2= x.split(".");
    var path="";
    var fileid = x2[0];
    retrivefile1(req, res, fileid, path, orgid, (successfun) => {
        if (!successfun) {
            res.send('File not found');
            return;
        }   
        var x1=successfun[0];
        var x3= x1.split(".");
        var fileidm = x3[1];
        // console.log(fileidm + " fileid x2----")
        const base64 = successfun[1].split(';base64,').pop();
        const base641 = Buffer.from(base64, 'base64');
        if(fileidm=='jpeg' || fileidm === 'jpg'){
        res.setHeader('Content-Type', 'image/jpeg');
        // console.log(" - img ****")
        }else{
            
            res.setHeader('Content-Type', 'application/pdf'); 
            // console.log(" - pdf ****")
        }
        res.setHeader('Content-Length', base641.length);

        res.end(base641);
    });

 });
//noticeboard QRCode get
 
app.get('/getnoticeboardqrcode/:filename', (req, res) => {
    fname = "./userdata/noticeboard/QRCode/"+ req.params.filename
    console.log(fname)
    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res); 
     }  
});
function gettotalsize2(subid,orgid,successfun){
    let sql ="SELECT orgid, sum(LENGTH(file)) / 1024 / 1024 as 'Size' FROM uploadfile where orgid = '"+orgid+"';"
    fcon.query(sql,function(err,result){
        // console.log(sql +"  gettotalsizee2")
        if(err) console.log(err)
        else{
            let filesize= parseFloat(result[0].Size).toFixed(2);
            // console.log(filesize +" filesize")
            var sql1 ="update subscriptions set usedquota="+filesize+" where subscriptionid like'"+subid+"'";
            mcon.query(sql1, function(err,result){
                console.log(sql1 +"   mcon update ")
                if(err) console.log(err)
                else if(result.affectedRows>0){
                    successfun("Successful")                  
                }else{
                    successfun("Failed")
                }
            })
        }
    })
}

/////////////////        Notice Board Project   /////////////////////////
app.get("/1/noticeboard",async(req, res) => {
    if(!req.session.userid){
        res.redirect("/1/login")
    }else{
        var admin = 0;
        var started = 0;
        var User = 0;
        var substatus= 0;
        var orgcolor="";
        var sqla="select * from usermaster_t.subscriptions where userid='"+req.session.userid+"' and moduleid='3'";
        // console.log("sqla     "+sqla)
        mcon.query(sqla,(err,result)=>{
        if(err) console.log(err)
            else if(result.length>0){
                admin = 1;
                req.session.admin = admin
                req.session.subid = result[0].subscriptionid;
            }else{
                admin= 0;
            }
            var sql="select * from noticeboard_t.organization where subsid='"+req.session.subid+"' ";
                //console.log("sql......."+sql)
                ncon.query(sql, (err, result)=>{
                if(err) console.log(err)
                else if (result.length>0) {
                    //console.log("one")
                    started = 1;                     
                    req.session.orgid = result[0].orgid;
                    //console.log(req.session.orgid +"orgid")
                } else {
                    started = 0;
                    //console.log("two")
                }
                    var sql3="select noticeboard_t.userinfo.orgid,noticeboard_t.organization.orgname from noticeboard_t.userinfo join noticeboard_t.organization on noticeboard_t.userinfo.orgid =  noticeboard_t.organization.orgid where  noticeboard_t.userinfo.userid ='"+req.session.userid+"' and staffposition = 'User'";
                    // console.log(sql3)
                    ncon.query(sql3, (err,result)=>{
                    if(err) console.log(err)
                    else if (result.length>0) {
                        User = 1;
                        req.session.User = User;                     
                        req.session.orgid = result[0].orgid;
                        req.session.orgname = result[0].orgname;
                        console.log(req.session.User + "Player")
                    } else {
                        User = 0;
                    }
                        ncon.query("select enddate,subscriptionid from usermaster_t.subscriptions where subscriptionid in(select organization.subsid from noticeboard_t.organization where orgid like '"+req.session.orgid+"')",function(err,result){
                            if(err)console.log(err)
                            else if(result.length>0){
                                var enddate = result[0].enddate
                                let date1 = new Date()
                                const diffTime = enddate.getTime() - date1.getTime();
                                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                                if(diffDays>0){
                                        substatus = 1;
                                }else{
                                        substatus = 0;    
                                } 
                            }
                            var sql="select * from noticeboard_t.organization where orgid='"+req.session.orgid+"' ";
                            // console.log("sql......."+sql)
                            ncon.query(sql, (err, result)=>{
                                if(err) console.log(err)
                                else if (result.length>0) {
                                    //console.log("one")
                                    req.session.orgcolor = result[0].csscolor;                   
                                    orgcolor=req.session.orgcolor;
                                    if(orgcolor == 'undefined' || orgcolor == null || orgcolor == 'null' || orgcolor == undefined || orgcolor == 'NaN-aN-aN'){
                                        orgcolor='style'
                                    }
                                    //console.log(req.session.orgid +"orgid")
                                } else {
                                    orgcolor = 0;
                                    //console.log("two")
                                }        

                            res.render("noticeboard.pug",{userid: req.session.userid,username: req.session.username,admin:admin,started:started,User:User,substatus:substatus,orgcolor:orgcolor});
                            console.log("noticeboard.pug",{userid:req.session.userid,username: req.session.username,admin:admin,started:started,User:User,substatus:substatus,orgcolor:orgcolor});
                            })    
                        })
                 })
            })
        })
    }
});

app.post("/1/noticeboard",up,async (req,res)=>{
    //console.log(req.get('origin') +" .....")
    if(!req.session.userid){
        res.send("sessionexpired")
    }else if(req.body.action==="subscriben"){
        var startdate = new Date();
        var subscribeidnew = uuidv4();
        var currentdate = startdate.getFullYear()+'-'+("0" + (startdate.getMonth() + 1)).slice(-2)+'-'+("0" + startdate.getDate()).slice(-2) +" "+startdate.getHours()+':'+startdate.getMinutes()+':'+startdate.getSeconds();
        let days =3;
        let newDate = new Date(Date.now()+days*24*60*60*1000);
        let ndate = ("0" + newDate.getDate()).slice(-2);
        let nmonth = ("0" + (newDate.getMonth() + 1)).slice(-2);
        let nyear = newDate.getFullYear();   
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();
        let seconds = newDate.getSeconds();       
        let nextdate = nyear+'-'+nmonth+'-'+ndate +" "+hours+':'+minutes+':'+seconds 
        var sql1="select * from subscriptions where userid='"+req.session.userid+"' and moduleid=3 ";
        // console.log(sql1 +" -subscription")
        mcon.query (sql1, function(err, result){
        // console.log(result)
            if(err) console.log(err)
            else if(result.length>0){
                res.send("used")
            }else{
                var sql2 = "insert into subscriptions (userid, subscriptionid, moduleid, startdate, enddate,isprimary ) values('"+req.session.userid+"','"+subscribeidnew+"',3,'"+currentdate+"','"+nextdate+"','yes')"
                mcon.query(sql2, function(err, data){
                    if (err) throw err;
                    res.send("Saved")
                    });   
                }
        })
    }
else if(req.body.action==="saveorginfo"){
    var orgid = uuidv4();
    var nameorg = req.body.nameorg
    var phoneno = req.body.phoneno
    var orgaddress = req.body.orgaddress
    var orgaddress2 = req.body.orgaddress2
    var orgcity = req.body.orgcity
    var orgstate = req.body.orgstate
    var orgemail = req.body.orgemail
    var sql = "insert into organization (subsid, orgid,orgname, phoneno,address1,address2,city,state,email) values('"+req.session.subid+"','"+orgid+"','"+nameorg+"', '"+phoneno+"','"+orgaddress+"','"+orgaddress2+"','"+orgcity+"','"+orgstate+"','"+orgemail+"')"
    ncon.query(sql,function(err,result1){
        if(err)console.log(err)
            else if (result1.affectedrows>0)
            {
                res.send("Information saved successfully")
            }else{
                res.send("Information saved successfully")
            }
           
    })
}
else if(req.body.action==="retriveorginfo"){
    var sql="select * from organization where subsid='"+req.session.subid+"'";
    //console.log(sql)
    ncon.query(sql,function (err,result){
        if(err)console.log(err)
        else if(result.length>0){
            var arr=[];
            arr.push(result[0].orgname)
            arr.push(result[0].phoneno)
            arr.push(result[0].address1)
            arr.push(result[0].address2)
            arr.push(result[0].city)
            arr.push(result[0].state)
            arr.push(result[0].email)
            res.send(arr)
        }else{
            console.log("Orginfo error")
        }
    })
}
else if(req.body.action==="orgcolornoticeboard"){
    var csscolor = req.body.csscolor
    var sql = "update organization set csscolor='"+csscolor+"'  where subsid='"+req.session.subid+"'";
    ncon.query(sql,function(err,result){
       console.log(sql  +  ">>>>")
        if(err)console.log(err)
        else if(result.affectedRows>0){
           res.send("updated successfully")
        }else{
            res.send("orginfo error")
        }
    })
}
else if (req.body.action === 'retrivebgstylecolornb') {
    var sql = "select * from usermaster_t.bgstyle ";
    mcon.query(sql, function(err, result) {
        // console.log(sql +"   retrivprojectname")
        if (err) console.log(err, req);
        else if (result.length > 0) {
            r = [];
            for (i = 0; i < result.length; i++) {
                r.push('{"name":"' + result[i].name + '","filename":"' + result[i].filename + '"}');
            }
            res.send(r);
        } else {
            res.send("error");
        }
    })
}

else if(req.body.action==="updateorg"){
    var nameorg = req.body.nameorg
    var phoneno = req.body.phoneno
    var uaddress = req.body.uaddress
    var uaddress2 = req.body.uaddress2
    var ucity = req.body.ucity
    var ustate = req.body.ustate
    var uemail = req.body.uemail
    var sql = "update organization set orgname='"+nameorg+"',phoneno='"+phoneno+"',address1='"+uaddress+"',address2='"+uaddress2+"',city='"+ucity+"',state='"+ustate+"',email='"+uemail+"'  where subsid='"+req.session.subid+"'";
    ncon.query(sql,function(err,result){
       // console.log(sql  +  ">>>>")
        if(err)console.log(err)
        else if(result.affectedRows>0){
           res.send("updated successfully")
        }else{
            res.send("orginfo error")
        }
    })
}

else if(req.body.action==='noticeblogo'){
    return new Promise((resolve, reject) => {
        savefiledb(req,res,req.session.orgid,(successfun) => {
            resolve(successfun);
        });
    }).then((data)=>{
        ncon.query("UPDATE organization SET logoid ='"+data+"' where orgid='"+req.session.orgid+"'" , function(err,result){
            if(err) console.log(err);
            else if(result.affectedRows>0){
                res.send('successful')
            }else{
                console.log("something went wrong please try after sometime.....")
            }
        })
    })   
}
else if(req.body.action === 'getlogonoticeb'){
    let path ="noticeboardlogo"+"/"+req.session.orgid
    ncon.query("select logoid from organization where orgid like'"+req.session.orgid+"'",function(err,result){
        if(err) console.log(err)
        else if(result.length>0){
            let fileid = result[0].logoid
            return new Promise((resolve, reject) => {
                retrivefile(req,res,fileid,path,req.session.orgid,(successfun) => {
                    resolve(successfun);
                });
            }).then((data)=>{
                res.send(data)
            })

        }else{
            res.send("no file")
        }
    })    
}
else if (req.body.action === 'savestatus') {
    var allstatus = req.body.newstatus;
    if (!allstatus || allstatus.trim() === '') {
      res.send("Status name cannot be null or empty.");
      return;
    }
    var checkDuplicateSql = "SELECT COUNT(*) AS status_count FROM orgstatuses WHERE orgid = '" + req.session.orgid + "' AND statusname = '" + allstatus + "'";
    ncon.query(checkDuplicateSql, function (err, result) {
        //console.log(checkDuplicateSql)
      if (err) {
        console.log(err);
        res.send("An error occurred.");
      } else {
        if (result[0].status_count > 0) {
          res.send("Duplicate status name. Status already exists.");
        } else {
          var insertSql = "INSERT INTO orgstatuses(orgid, statusname, seq) VALUES('" + req.session.orgid + "', '" + allstatus + "', '1000')";
          ncon.query(insertSql, function (err, result) {
           // console.log(insertSql)
            if (err) {
              console.log(err);
              res.send("An error occurred while inserting the status.");
            } else if (result.affectedRows > 0) {
              res.send("Information saved successfully");
            } else {
              res.send("Insert failed.");
            }
          })
        }
      }
    })
}
else if(req.body.action==='retrivestatus'){
    var sql="select * from orgstatuses where orgid = '"+req.session.orgid+"' ORDER BY seq;"
    ncon.query(sql,function(err,result){
        if(err)console.log(err,req)
        else if(result.length>0){
            r = []
            for(i=0;i<result.length;i++){
                r.push('{"statusname":"'+result[i].statusname+'","orgid":"'+result[i].orgid+'"}')
            }
            res.send(r)
        }else{
            res.send("retrive status error")
        }
    })
}
else if (req.body.action === "deletestatus") {
    var statusname = req.body.statusname;
    // Delete from taskstatus table
    var sqlDeleteStatus = "DELETE FROM noticeboard_t.orgstatuses WHERE orgid='" + req.session.orgid + "' AND statusname='" + statusname + "'";
    ncon.query(sqlDeleteStatus, function (err, resultStatus) {
        if (err) {
            console.log(err);
        } else {
                    res.send("Delete");
                }
        })
    }
    else if(req.body.action==='retriveallstatus'){
        var sql="select * from statuses ";
        ncon.query(sql,function(err,result){
            if(err)console.log(err,req)
            else if(result.length>0){
                r = []
                for(i=0;i<result.length;i++){
                    r.push('{"statusname":"'+result[i].statusname+'"}')
                }
                res.send(r)
            }else{
                res.send("retrive all status error")
            }
        })
    }
    else if (req.body.action === 'addorgstatus') {
        var orgstatus = req.body.orgstatus;
        if (!orgstatus || orgstatus.trim() === '') {
          res.send("Status name cannot be null or empty.");
          return;
        }
        var checkDuplicateSql = "SELECT COUNT(*) AS status_count FROM orgstatuses WHERE orgid = '" + req.session.orgid + "' AND statusname = '" + orgstatus + "'";
        ncon.query(checkDuplicateSql, function (err, result) {
            // console.log(checkDuplicateSql)
          if (err) {
            console.log(err);
            res.send("An error occurred.");
          } else {
            if (result[0].status_count > 0) {
              res.send("Duplicate status name. Status already exists.");
            } else {
              var insertSql = "INSERT INTO orgstatuses(orgid, statusname, seq) VALUES('" + req.session.orgid + "', '" + orgstatus + "', '1000')";
              ncon.query(insertSql, function (err, result) {
            //  console.log(insertSql +" - org status")
                if (err) {
                  console.log(err);
                  res.send("An error occurred while inserting the status.");
                } else if (result.affectedRows > 0) {
                  res.send("Data inserted.");
                } else {
                  res.send("Insert failed.");
                }
              })
            }
          }
        })
    }
    //notice board
    else if (req.body.action === "creatnewnoticeboard") {
        var noticeboardtitle = req.body.noticeboardtitle;
        var noticeboarddescription = req.body.noticeboarddescription;
        var sql = "SELECT COUNT(*) AS count FROM noticeboard_t.noticeboard WHERE orgid='"+req.session.orgid+"' and noticeboardtitle = '" + noticeboardtitle + "'";
        ncon.query(sql, function (err, checkResult) {
            // console.log(sql +" -  checkExistenceQuery")
            if (err) {
                res.send("error");
            } else {
                var noticecount = checkResult[0].count;
    
                if (noticecount > 0) {
                    res.send("Notice Board  Name already exists. Please choose a different name.");
                } else {
                    var noticeboardid = uuidv4();
                    var sql1 = "INSERT INTO noticeboard_t.noticeboard (orgid, noticeboardid, noticeboardtitle, description,createdby) VALUES('" + req.session.orgid + "','" + noticeboardid + "','" + noticeboardtitle + "', '" + noticeboarddescription + "','"+req.session.userid+"')";
                    ncon.query(sql1, function (err, insertResult) {
                        // console.log(sql1 +"- insertQuery")
                        if (err) {
                            res.send("error");
                        } else if (insertResult.affectedRows > 0) {
                            res.send("data insert");
                        } else {
                            res.send("something went wrong please try after sometime.....");
                        }
                    });
                }
            }
        });
    
    }
    else if (req.body.action === 'retrivenoticeboardname') {
        var sql = "SELECT * FROM noticeboard WHERE orgid = '" + req.session.orgid + "'";
        ncon.query(sql, function(err, result) {
           // console.log(sql +"   retrivprojectname")
            if (err) console.log(err, req);
            else if (result.length > 0) {
                r = [];
                for (i = 0; i < result.length; i++) {
                    r.push('{"noticeboardtitle":"' + result[i].noticeboardtitle + '","noticeboardid":"' + result[i].noticeboardid + '"}');
                }
                res.send(r);
            } else {
                res.send("error");
            }
        });
    }
    else if(req.body.action==="retrivnoticeinfo"){
        var noticeid=req.body.noticeid;
        var shownoticeboards=req.body.shownoticeboards
          var sql="select * from notices where orgid='"+req.session.orgid+"'and noticeboardid='"+shownoticeboards+"' and noticeid='"+noticeid+"';"
            ncon.query(sql,function (err,result){
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].noticetitle)
                arr.push(result[0].noticetext)
                arr.push(result[0].fromdate)
                arr.push(result[0].todate)
                arr.push(result[0].noticeid)
                res.send(arr)
            }else{
                console.log("Retrive Update error")
            }
        })
    }
    else if(req.body.action==="updatenoticeinformation"){
        var noticetitle1 = req.body.noticetitle1
        var noticedescription1 = req.body.noticedescription1
        var noticestartdate1 = req.body.noticestartdate1
        var noticenddate1 = req.body.noticenddate1
        var noticeid = req.body.noticeid
        var shownoticeboards = req.body.shownoticeboards
        var sql = "update notices set noticetitle='"+noticetitle1+"',noticetext='"+noticedescription1+"',fromdate='"+noticestartdate1+"',todate='"+noticenddate1+"'  where orgid='"+req.session.orgid+"' and noticeboardid='"+shownoticeboards+"' and noticeid='"+noticeid+"'";
        ncon.query(sql,function(err,result){
            if(err)console.log(err)
            else if(result.affectedRows>0){
               res.send("updated successfully")
            }else{
                res.send("error")
            }
        })
    }
    else if (req.body.action === "creatnewnotice") {
        var noticeboardid= req.body.noticeboardid;
        var noticetitle = req.body.noticetitle;
        var noticedescription = req.body.noticedescription;
        var noticestartdate = req.body.noticestartdate;
        var noticenddate = req.body.noticenddate;
        var cdate = new Date();
        cdate = cdate.getFullYear() + '-' + ('0' + (cdate.getMonth() + 1)).slice(-2) + '-' + ('0' + cdate.getDate()).slice(-2) + ' ' + ('0' + cdate.getHours()).slice(-2) + ':' + ('0' + cdate.getMinutes()).slice(-2) + ':' + ('0' + cdate.getSeconds()).slice(-2);
        var noticeid = uuidv4();
        var sql1 = "INSERT INTO noticeboard_t.notices (orgid, noticeboardid, noticeid, noticetitle,noticetext,fromdate,todate,createddate,createdby) VALUES('" + req.session.orgid + "','" + noticeboardid + "','" + noticeid + "', '" + noticetitle + "','"+noticedescription+"','"+noticestartdate+"','"+noticenddate+"','"+cdate+"','"+req.session.userid+"')";
                ncon.query(sql1, function (err, insertResult) {
                    //console.log(sql1 +"- insertQuery")
                    if (err) {
                        res.send("error");
                    } else if (insertResult.affectedRows > 0) {
                        res.send("data insert");
                    } else {
                        res.send("something went wrong please try after sometime.....");
                    }
                });
            }
    else if (req.body.action === "shownoticeboard") {
    var noticeboardid = req.body.noticeboardid;
    var shownoticedata = req.body.shownoticedata;
        var sql = "SELECT noticetitle, noticeboardid, noticeid, fromdate, todate, createddate, noticetext FROM noticeboard_t.notices WHERE orgid = '" + req.session.orgid + "' AND noticeboardid = '" + noticeboardid + "' AND ('" + shownoticedata + "' BETWEEN fromdate AND todate OR '" + shownoticedata + "' = DATE(fromdate) OR '" + shownoticedata + "' = DATE(todate));";           
        //  console.log(sql + " - show notice board sql");
        ncon.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            if (result.length === 0) {
                res.send("No Data");
                return;
            }

            // var colors = ['#a2cdf9', '#f69b9b', '#b0c9fb', '#f388d5', '#9fd0fe', '#e6e600', '#e19ff7', '#aaf9aa', '#7d7773', '#4d8146', '#48acdf', '#ea2626', '#adebad', '#f6f6ab', '#92f692'];
            var colors =['#b3e7e7','#c2c2eb','#efc6da','#96e8e8','#ecc7e3','#eacdf4','#f3d2d2','#d3e7cd','#d0d0f3','#f6daf6','#cecef0','#e1ebd7','#dcc3f4','#bff3e8','#bcccec','#83dcdc'];

            var tbltext = "<div class='notice-container' style='width: 100%; height: 100%; border-color: coral !important;box-shadow:rgba(191, 195, 221, 0.2) 0 -25px 18px -14px inset,rgba(175, 199, 226, 0.15) 0 1px 2px,rgba(179, 191, 215, 0.15) 0 2px 4px,rgba(136, 161, 168, 0.15) 0 4px 8px,rgba(139, 173, 190, 0.15) 0 8px 16px,rgba(164, 169, 192, 0.15) 0 16px 32px; border-style: ridge !important; border-width: 25px !important; border-color: coral !important; background-color:#dbf0fa'>";

            result.forEach(function (notice, index) {
                var colorIndex = Math.floor(Math.random() * colors.length);
                var color = colors[colorIndex];
                // var rotationValue = Math.floor(Math.random() * 11) - 5; // Random rotation between -5 to 5 degrees
                if(req.session.admin){
                tbltext += "<div class='notice-item' style='background-color: " + color + "; box-shadow: 6px 5px 4px #c1c1c1;'>";
                tbltext += "<div class='notice-title'>" + notice.noticetitle + "</div>";
                tbltext += "<div class='notice-actions'>";
                tbltext +="<img onclick=fileupload(\""+notice.noticeid+"\"); src='/static/image/fileupload.png'  style='width:30px; cursor: pointer;' title='File Upload''/>"
                tbltext += "<img onclick='onclick=noticeinfo1(\""+notice.noticeid+"\");' src='/static/image/information.png' style='width:30px; cursor: pointer;' title='Notice Information' />";
                tbltext += "<img onclick='onclick=editenoticeinfo(\""+notice.noticeid+"\");' src='/static/image/editnotice.png' style='width:30px; cursor: pointer;' title='Notice Edite' />";
                tbltext += "<img onclick='onclick=noticedelete(\""+notice.noticeid+"\");' src='/static/image/trash.png' style='width:25px; cursor: pointer;' title='Notice Delete' />";
                tbltext += "</div></div>";
                }else{
                    tbltext += "<div class='notice-item' style='background-color: " + color + "; box-shadow: 6px 5px 4px #c1c1c1;'>";
                    tbltext += "<div class='notice-title'>" + notice.noticetitle + "</div>";
                    tbltext += "<div class='notice-actions'>";
                    tbltext += "<img onclick='onclick=noticeinfo1(\""+notice.noticeid+"\");' src='/static/image/information.png' style='width:30px; cursor: pointer;' title='Notice Information' />";
                    tbltext += "</div></div>";
                }
            });

            tbltext += "</div>";
            res.send(tbltext);
            
        });
    }
    else if (req.body.action === "shownoticeinfo2") {
        var noticeid = req.body.noticeid;
       var sql = "SELECT nf.*, n.* FROM noticefiles nf JOIN notices n ON nf.orgid = n.orgid AND nf.noticeid = n.noticeid WHERE nf.noticeid='" + noticeid + "' AND nf.orgid='" + req.session.orgid + "';";
        ncon.query(sql, function (err, result) {
            //console.log(sql);
            if (err) {
                console.log(err);
            } else if (result.length > 0) {
                if(req.session.admin){
                var tbltext = "<table id='report' style='width: 100%;'><tr><th colspan='3'>Notice Information</th></tr>";
                var noticeTitle = result[0].noticetitle;
                var noticeText = result[0].noticetext;
                var fromDate = result[0].fromdate ? result[0].fromdate.toLocaleString() : ''; // Convert date to string
                var toDate = result[0].todate ? result[0].todate.toLocaleString() : ''; // Convert date to string
                tbltext += "<tr><td colspan='3'><strong>Notice Title:</strong> " + noticeTitle + "</td></tr>";
                tbltext += "<tr><td colspan='3'><strong>Notice Text:</strong> " + noticeText + "</td></tr>";
                // Display Start and End Date
                tbltext += "<tr><td colspan='2'><strong>Start Date:</strong> " + fromDate + "</td><td><strong>End Date:</strong> " + toDate + "</td></tr>";
                // Display Files if available
                //if (result.some(entry => entry.fileid)) { // Check if any file exists
                
                tbltext += "<tr><th>File Name</th><th colspan='2'>Action</th></tr>";

                for (var i = 0; i < result.length; i++) {
                    var fileid= result[i].fileid;
                    var fileid1 = fileid.split('||')[0]; 
                    var fileName = fileid.split('||')[1];
                // console.log(fileid + " /// fileid")
                    // tbltext += "<tr><td>" + fileName + "</td><td colspan='2'><button class='butonbg' onclick=downloadfilen1('" + fileid1 + "');><img src='/static/image/downloadfile.png' style='width:22px;'/></button> <button class='butonbg' onclick=deletenoticefile('" + fileid + "');><img src='/static/image/trash.png' style='width:22px;'/></button></td></tr>";
                    tbltext += "<tr><td>" + fileName + "</td><td colspan='2'><button class='butonbg' onclick=\"downloadfilen1('" + fileid1 + "');\"><img src='/static/image/downloadfile.png' style='width:22px;'/></button> <button class='butonbg' onclick=\"deletenoticefile('" + encodeURIComponent(fileid) + "');\"><img src='/static/image/trash.png' style='width:22px;'/></button></td></tr>";

                }  
                // } else {
                //     tbltext += "<tr><td colspan='2'>No Files</td></tr>";
                // }
                }else{
                    var tbltext = "<table id='report' style='width: 100%;'><tr><th colspan='2'>Notice Information</th></tr>";
                var noticeTitle = result[0].noticetitle;
                var noticeText = result[0].noticetext;
                var fromDate = result[0].fromdate ? result[0].fromdate.toLocaleString() : ''; // Convert date to string
                var toDate = result[0].todate ? result[0].todate.toLocaleString() : ''; // Convert date to string
                tbltext += "<tr><td colspan='2'><strong>Notice Title:</strong> " + noticeTitle + "</td></tr>";
                tbltext += "<tr><td colspan='2'><strong>Notice Text:</strong> " + noticeText + "</td></tr>";
                // Display Start and End Date
                tbltext += "<tr><td><strong>Start Date:</strong> " + fromDate + "</td><td><strong>End Date:</strong> " + toDate + "</td></tr>";
                // Display Files if available
                //if (result.some(entry => entry.fileid)) { // Check if any file exists
                
                tbltext += "<tr><th>File Name</th><th>Action</th></tr>";
                
                    for (var i = 0; i < result.length; i++) {
                        var fileid= result[i].fileid;
                        var fileid1 = fileid.split('||')[0]; 
                        var fileName = fileid.split('||')[1];
                        // if (logtype === 'file') {
                        //     var fileName = result[i].logtext.split('||')[1]; // Extracting file name
                        //     var fileId = result[i].logtext.split('||')[0]; // Extracting file ID
                       
                            tbltext += "<tr><td>" + fileName + "</td><td><button onclick=downloadfilen1('" + fileid1 + "');><img src='/static/image/downloadfile.png' style='height:22px; width:22px;'/></button></td></tr>";  
                        }
                    }
                
                tbltext += "</table>";
                res.send(tbltext);
            } else {
                // If no files are associated with the notice, fetch notice information from the notices table
                var sql1 ="SELECT * FROM notices WHERE noticeid='" + noticeid + "' AND orgid='" + req.session.orgid + "';";
                ncon.query(sql1, function (err, result) {
                    //console.log(sql1);
                    if (err) {
                        console.log(err);
                        res.send("Error occurred while fetching notice information.");
                    } else if (result.length > 0) {
                        var tbltext = "<table id='report' style='width: 100%;'><tr><th colspan='2'>Notice Information</th></tr>";
                        var noticeTitle = result[0].noticetitle;
                        var noticeText = result[0].noticetext;
                        var fromDate = result[0].fromdate ? result[0].fromdate.toLocaleString() : ''; // Convert date to string
                        var toDate = result[0].todate ? result[0].todate.toLocaleString() : ''; // Convert date to string
                        
                        // Display Notice Title
                        tbltext += "<tr><td colspan='2'><strong>Notice Title:</strong> " + noticeTitle + "</td></tr>";
                    
                        // Display Notice Text
                        tbltext += "<tr><td colspan='2'><strong>Notice Text:</strong> " + noticeText + "</td></tr>";
                    
                        // Display Start and End Date
                        tbltext += "<tr><td><strong>Start Date:</strong> " + fromDate + "</td><td><strong>End Date:</strong> " + toDate + "</td></tr>";
                    
                        tbltext += "</table>";
                        res.send(tbltext);
                    } else {
                        res.send("No Notice Found.");
                    }
                });
            }
        });
    }
    else if(req.body.action === 'downloadfilen1'){
        var noticeid = req.body.noticeid;
        var noticefileid=req.body.data;
        // let path ="noticeboardfiles"+"/"+ req.session.orgid
        sql="select * from noticefiles where noticeid = '"+noticeid+"' and fileid like '%"+noticefileid+"%' and orgid like '"+req.session.orgid+"'"
        ncon.query(sql, function(err,result){
         console.log(sql)
            if(err) console.log(err,req)
            else if(result.length>0){
                var fileid1=result[0].fileid;
                var fileid = fileid1.split('||')[0]; 
                // return new Promise((resolve, reject) => {
                //     retrivefile(req,res,req.body.data,path,req.session.orgid,(successfun) => {
                //     resolve(successfun);
                //     });
                // }).then((data)=>{
                    res.send(fileid)
                // })
            }else{
                res.send("no file")
            }
        })
    }
    else if(req.body.action === 'deletenoticefile'){
        var fileid1=req.body.fileidinfo; 
        var fileida=req.body.fileida;
        var noticeid=req.body.noticeid;
        var fileid = fileid1.split('%7C%7C')[0]; // Extracting fileid from encoded string
        // console.log(fileid);
        var sql1="delete from noticefiles where orgid='"+req.session.orgid+"' And noticeid='"+noticeid+"' And fileid='"+fileida+"';"
        ncon.query(sql1,function(err,result1){
        console.log(sql1 +" delete file")
            if(err) console.log(err)
            else{
                return new Promise((resolve, reject) => {
                    deletefile(req,res,fileid,req.session.orgid,(successfun)=>{
                    resolve(successfun);

                    });
                    res.send("Delete file")
                })
            }
        })
    }
   else if(req.body.action === 'downloadqrcode'){
    let noticeboardId = req.body.data; // Assuming this is the ID of the notice board
    var data=noticeboardId+".png"
    res.send(data)
       
}

    //show notice board QRCode
    else if (req.body.action === 'retrivenoticeboard') {
        var sql = "SELECT * FROM noticeboard WHERE orgid = '" + req.session.orgid + "'";
        ncon.query(sql, function(err, result) {
            // console.log(sql +"   retrivprojectname")
            if (err) console.log(err, req);
            else if (result.length > 0) {
                r = [];
                for (i = 0; i < result.length; i++) {
                    r.push('{"noticeboardtitle":"' + result[i].noticeboardtitle + '","noticeboardid":"' + result[i].noticeboardid + '"}');
                }
                res.send(r);
            } else {
                res.send("error");
            }
        });
    }
    else if(req.body.action === 'shownoticeboardqrcode') {
        let noticeid = req.body.noticeboardid;
        data = [];
        //data.push("http://localhost:55000/1/noticeboardQR/" + noticeid);
        var ENVCALURL1=req.get('origin');
        ENVCALURL=ENVCALURL1;
        data.push(ENVCALURL+"/1/noticeboardQR/"+noticeid)

        QRCode.toFile('./userdata/noticeboard/QRCode/' + noticeid + '.png', data, {
            dark: '#208698',
            light: '#FFF',
            margin: 2,
            height: 400,
            width: 400
        }, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send("Error generating QR code");
            } else {
                if (fs.existsSync("./userdata/noticeboard/QRCode/" + noticeid + '.png')) {
                    data = [];
                    data.push(noticeid);
                    res.send(data);
                } else {
                    res.status(500).send("QR code file not found");
                }
            }
        });
    }
    //file upload
    else if (req.body.action==="saveuploadefile"){
        var filepurposen=req.body.filepurposen;
        var filename=req.body.filename; 
        var noticeid=req.body.noticeid; 
        var size=req.body.size;
        var cdate=new Date();
        cdate = cdate.getFullYear() + '-' + ('0' + (cdate.getMonth() + 1)).slice(-2) + '-' + ('0' + cdate.getDate()).slice(-2) + ' ' + ('0' + cdate.getHours()).slice(-2) + ':' + ('0' + cdate.getMinutes()).slice(-2) + ':' + + ('0' + cdate.getSeconds()).slice(-2)
        var sql = "select subscriptions.quota, subscriptions.usedquota from subscriptions where subscriptionid like '" + req.session.subid + "'";
        mcon.query(sql, function (err, result) {
            // console.log(sql + "   .....")
            if (err) console.log(err)
                else if (result.length > 0) {
                    let quota = 0, usedquota = 0;
                        if (result[0].quota == null || result[0].quota == undefined || result[0].quota == "") {
                            quota = 0
                            console.log(quota + "  111111 quota")
                        } else {
                            quota = result[0].quota;
                        }
                        if (result[0].usedquota == null || result[0].usedquota == undefined || result[0].usedquota == "") {
                            usedquota = 0
                        } else {
                        usedquota = result[0].usedquota;
                        }
                        if (usedquota > quota) {
                            res.send("You have reached the maximum limit of file upload")
                    } else {
                     return new Promise((resolve, reject) => {
                            savefiledb(req,res,req.session.orgid,(successfun)=>{
                                resolve(successfun)
                            })
                    }).then((data)=>{
                        var sql3 ="insert into noticefiles(orgid, noticeid, fileid,filepurpose, createddate,createdby) values('"+req.session.orgid+"','"+noticeid+"','"+data+'||'+filename+"','"+filepurposen+"','"+cdate+"','"+req.session.userid+"')";
                        ncon.query(sql3,function(err,result){
                        // console.log(sql3)
                            if(err) console.log(err)
                            else if(result.affectedRows>0){
                                return new Promise((resolve, reject) => {
                                    gettotalsize2(req.session.subid, req.session.orgid, (successfun) => {
                                        resolve(successfun)
                                    });
                                }).then((data) => {
                                    res.send("File Upload successfully")
                            })
                        }else{
                            res.send("error")
                        }
                    })     
                })         
           }
        }
        })
    }
    else if(req.body.action === "getaccountdetailsn"){
        mcon.query("select * from subscriptions where userid='" + req.session.userid + "' and moduleid=3", function(err, results){
            if(err) console.log(err)  
            else{
                var date_ob = new Date();
                let acc=[];
                let date = new Date(results[0].enddate)
                var diff = date.getTime() - date_ob.getTime()  
                var daydiff = diff / (1000 * 60 * 60 * 24)
                if(daydiff>0){
                    acc.push("Active")
                    let days = Math.round(daydiff)
                    acc.push(days)
                }
                else{
                    acc.push("deactive")
                    let days = 0
                    acc.push(days)
                }
                acc.push(results[0].startdate);
                acc.push(results[0].enddate);
                acc.push(results[0].usedquota);
                acc.push(results[0].quota)
                res.send(acc);
            }       
        })
    } 
    else if(req.body.action==="showeq"){
        var shownoticeboards = req.body.shownoticeboards
        var tbltext ="";
        var sql ="SELECT * FROM noticeboard_t.enquiry WHERE orgid='"+req.session.orgid+"' AND noticeboardid='"+shownoticeboards+"'  ;"
        //    var sql ="SELECT * FROM mlm_t.member a, plan b, plandetails c WHERE a.planid=b.planid and b.planid=c.planid AND memberid='"+refrenceid+"' and c.levels = '1';" 
        ncon.query(sql,async  function (err,result){
            // console.log(sql +" 111..........")
            if(err)console.log(err)
            else if(result.length>0){ 
                var tbltext = "<table id='report' class='eqrtable'><tr><th style='width:180px'>Name</th><th style='width:150px'>Contact No</th><th>Enquiry Date</th><th>Question</th></tr>"
               
                for(var i=0;i<result.length;i++){
                        var contactno =result[i].contactno;
                        if(contactno == 'undefined' || contactno == undefined || contactno == 'null' || contactno == null){
                            contactno = ''
                        }
                        var name = result[i].name;
                        if(name == 'undefined' || name == undefined || name == 'null' || name == null){
                            name = ''
                        }
                        var enquirytext =result[i].enquirytext;
                        if(enquirytext == 'undefined' || enquirytext == undefined || enquirytext == 'null' || enquirytext == null){
                            enquirytext = ''
                        }
                        var currentdate = result[i].currentdate;
                            if(currentdate == 'undefined' || currentdate == null || currentdate == 'null' || currentdate == undefined || currentdate == 'NaN-aN-aN'){
                                currentdate=''
                            }else{
                                currentdate = currentdate.getFullYear()+'-'+("0" + (currentdate.getMonth() + 1)).slice(-2)+'-'+("0" + currentdate.getDate()).slice(-2);     
                            }
                         var row="<tr><td  style='text-align: left;'>"+name+"</td><td>"+contactno+"</td><td>"+currentdate+"</td><td>"+enquirytext+"</td></tr>"
                    tbltext += row;
                       
                    }
                    tbltext +="</table>";  
                    res.send(tbltext);
                    //res.send("Data update.");
                   
                }else{
                    res.send("No Record")
                }
        })
    }
    else if (req.body.action === "assignstaff") {
        var addposition = req.body.addposition;
        var username = req.body.username;
        var useremail = req.body.useremail;
        var contactno = req.body.usermobilenumber;
    
        if (!username || !useremail || !contactno || addposition === 'select' || addposition === 'null' || !addposition) {
            var missingField;
    
            if (!contactno) missingField = "Mobile number";
            else if (!username) missingField = "User Name";
            else if (!useremail) missingField = "User Email";
            else if (!addposition) missingField = "Position";
            else if (addposition) missingField = "Position";
    
            res.send("Please fill the " + missingField + " field.");
            return;
        } else {
            mcon.query("SELECT * FROM users WHERE mobile = '" + contactno + "'", function (err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length > 0) {
                    var userid = result[0].userid;
                    ncon.query("SELECT * FROM userinfo WHERE userid='" + userid + "' AND orgid <> '" + req.session.orgid + "'", function (err, existingUserResult) {
                        if (err) {
                            console.log(err);
                        } else if (existingUserResult.length > 0) {
                            res.send("User already exists in another organization");
                        } else {
                            mcon.query("SELECT * FROM subscriptions WHERE userid='" + userid + "' AND moduleid=3", function (err, results) {
                                if (err) {
                                    console.log(err);
                                } else if (results.length > 0) {
                                    res.send("User Has Subscription For This Module");
                                } else {
                                    var sql1 = "SELECT * FROM usermaster_t.users WHERE mobile='" + req.body.usermobilenumber + "'";
                                    mcon.query(sql1, function (err, result1) {
                                        if (err) {
                                            console.log(err);
                                        } else if (result1.length > 0) {
                                            var userid = result1[0].userid;
                                            //var userProjectsQuery = "SELECT projectid, position FROM orgusers WHERE userid = '" + userid + "'";
                                            //trcon.query(userProjectsQuery, function (err, userProjectsResult) {
                                                // if (err) {
                                                //     console.log(err);
                                                // } else {
                                                //     var userAlreadyAdded = false;
                                                //     for (var i = 0; i < userProjectsResult.length; i++) {
                                                //         var existingProjectId = userProjectsResult[i].projectid;
                                                //         var existingPosition = userProjectsResult[i].position;
    
                                                //         if (existingProjectId != projectid && existingPosition != addposition) {
                                                //             // User is already added to a different project with a different position
                                                //             userAlreadyAdded = true;
                                                //             break;
                                                //         }
                                                //     }
                                                    // if (userAlreadyAdded) {
                                                    //     res.send("User already assigned to another project with a different position");
                                                    // } else {
                                                        ncon.query("SELECT * FROM userinfo WHERE userid='" + userid + "' AND orgid = '" + req.session.orgid + "' AND staffposition = '" + addposition + "'", function (err, duplicateCheckResult) {
                                                            if (err) {
                                                                console.log(err);
                                                            } else if (duplicateCheckResult.length > 0) {
                                                                res.send("User is already assigned to this position in the organization");
                                                            } else {
                                                                // Proceed with the insertion since no duplicate is found
                                                                var sql = "INSERT INTO userinfo (orgid,userid, staffcontactno,staffname ,staffemail,staffposition) VALUES('" + req.session.orgid + "','" + userid + "','" + contactno + "','" + username + "','" + useremail + "','" + addposition + "')";
                                                                ncon.query(sql, function (err, result) {
                                                                    // console.log(sql);
                                                                    if (err) {
                                                                        console.log(err);
                                                                    } else if (result.affectedRows > 0) {
                                                                        res.send("Assign staff");
                                                                    } else {
                                                                        res.send("Assign staff");
                                                                    }
                                                                });
                                                            }
                                                        });
                                                        
                                                   // }
                                               // }
                                          //  });
                                        } else {
                                            res.send("user is already added with a different position");
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.send("Number is not registered in calendaree.com");
                }
            });
        }
    }
    else if(req.body.action==="searchstaff"){
        var mobileno = req.body.mobileno
        var sql="select * from usermaster_t.users where mobile='"+mobileno+"'";
        mcon.query(sql,function(err,result){
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].mobileno)
                arr.push(result[0].name)
                arr.push(result[0].email)
                arr.push(result[0].userid)
                res.send(arr)
            }else{
                //res.send(arr)
            res.send("User is not registered") 
            }
        })
    }
    else if(req.body.action==="showstaffreportn"){
        var tbltext = ""
        var sql="select * from noticeboard_t.userinfo where orgid='"+req.session.orgid+"'";
        ncon.query(sql,function (err,result){
            if(err)console.log(err)
            else if(result.length>0){ 
                 tbltext = "<table id='report'><tr><th style='width:150px'>Name</th><th style='width:150px'>Contact No</th><th>Email</th><th style='width:150px'>Position</th><th>Delete Staff</th></tr>"
                for(var i=0;i<result.length;i++){
                    var staffname =result[i].staffname;
                    var staffemail = result[i].staffemail;
                    var staffcontactno = result[i].staffcontactno;
                    var staffposition = result[i].staffposition;
                    tbltext=tbltext+"<tr><td>"+staffname+"</td><td>"+staffcontactno+"</td><td>"+staffemail+"</td><td>"+staffposition+"</td><td button  onclick=deletestaffinfo('"+result[i].userid+"');><img src='/static/image/trash.png' style='width:22px;'/></button></td></tr>"
                }
                tbltext=tbltext+"</table>"
                
                res.send(tbltext)
                }else{
                    res.send("No Record")
                }
        })
    }
    else if(req.body.action==="deletestaff"){
        var userid = req.body.userid;
        var sql = "DELETE FROM userinfo WHERE userid ='"+userid+"' and orgid='"+req.session.orgid+"';"
        ncon.query(sql,function(err,result1){
            // console.log(sql +"////")
               if(err) console.log(err)
               else{
                       res.send("Staff Deleted")
               }
           })    
    }
    //notice deleted  
    else if (req.body.action === "noticedelete") {
        var noticeid = req.body.noticeid;
        var orgid = req.session.orgid;
        var enquiry=req.body.enquiry;
        var sql = "SELECT * FROM notices WHERE orgid='"+orgid+"' AND noticeid='"+noticeid+"'";
        ncon.query(sql, function (err, noticeResults) {
            console.log(sql + " -sql")
            if (err) {
                console.log(err);
            } else if (noticeResults.length > 0) {
                var noticeid1 = noticeResults[0].noticeid;
                var sql2 = "DELETE FROM notices WHERE orgid='"+orgid+"' AND noticeid='"+noticeid1+"'";
                ncon.query(sql2, function (err, result1) {
                    console.log(sql2 + " -sql2")
                    if (err) {
                        console.log(err)
                    } else {
                        var sql1 = "SELECT * FROM noticefiles WHERE orgid='"+orgid+"' AND noticeid='"+noticeid+"'";
                        ncon.query(sql1,function (err, fileResults) {
                            console.log(sql1 + " -sql1")
                            if (err) {
                                console.log(err);
                            } else if (fileResults.length > 0) {
                                var promises = fileResults.map(file => {
                                    var fileid1 = file.fileid;
                                    var sql3 = "DELETE FROM noticefiles WHERE orgid='"+orgid+"' AND noticeid='"+noticeid+"' AND fileid='"+fileid1+"'";
                                    return new Promise((resolve, reject) => {
                                        ncon.query(sql3, function (err, result) {
                                            console.log(sql3 + " -sql3")
                                            if (err) {
                                                console.log(err)
                                                reject(err);
                                            } else {
                                                var fileid = fileid1.split('||')[0];
                                                deletefile(req, res, fileid, orgid, (successfun) => {
                                                    resolve(successfun);
                                                });
                                            }
                                        });
                                    });
                                });
                                Promise.all(promises)
                                    .then(() => {
                                        if(enquiry==='true'){
                                        var sql5="delete from enquiry where orgid='"+orgid+"' And noticeid='"+noticeid+"'";
                                        ncon.query(sql5,function(err,result){
                                            console.log(sql5 +" enquiry")
                                            if (err) {
                                                console.log(err);
                                            } else{
                                                res.send(" notice Deleted  ");
                                            }
                                        })
                                     }else{
                                        res.send(" notice Deleted  ");
                                     }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.send("Error occurred while deleting files.");
                                    });
                            } else {
                                if(enquiry==='true'){
                                    var sql5="delete from enquiry where orgid='"+orgid+"' And noticeid='"+noticeid+"'";
                                    ncon.query(sql5,function(err,result){
                                        console.log(sql5 +" enquiry")
                                        if (err) {
                                            console.log(err);
                                        } else{
                                            res.send(" notice Deleted  ");
                                        }
                                    })
                                 }else{
                                    res.send(" notice Deleted  ");
                                 }
                                
                            }
                        });
                    }
                });
            } else {
                res.send("Notice not found");
            }
        });
    }
       
});

app.get("/1/noticeboardQR/:noticeid",async(req,res) =>{
    req.session.noticeid=req.params.noticeid
    console.log("get " + req.session.noticeid)
    res.render('noticeboardQR.pug')
    // var showsearch=yes;
    
})
app.post('/1/noticeboardQR',up, (req, res) => {
    if(!req.session.noticeid){
        res.redirect("/1/login")
    }
    else if (req.body.action === "noticeboardshow") {
        var noticeboardid = req.body.noticeboardid;
        var shownoticedata = req.body.shownoticedata;
        var sql1 = "SELECT orgid FROM noticeboard_t.noticeboard WHERE noticeboardid='" + noticeboardid + "'";
        
        ncon.query(sql1, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            if (result.length === 0) {
                res.send("No Data");
                return;
            }
            var orgid1 = result[0].orgid;
            // console.log(orgid1 + " - orgid");
    
            var sql = "SELECT noticetitle, noticeid, orgid FROM noticeboard_t.notices WHERE orgid='" + orgid1 + "' AND noticeboardid = '" + noticeboardid + "' AND ('" + shownoticedata + "' BETWEEN fromdate AND todate OR '" + shownoticedata + "' = DATE(fromdate) OR '" + shownoticedata + "' = DATE(todate));";
            // console.log(sql + " - show notice board sql");
            ncon.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
    
                if (result.length === 0) {
                    res.send("No Data");
                    return;
                }
    
                var colors =['#b3e7e7','#c2c2eb','#efc6da','#96e8e8','#ecc7e3','#eacdf4','#f3d2d2','#d3e7cd','#d0d0f3','#f6daf6','#cecef0','#dcc3f4','#bff3e8','#bcccec','#83dcdc'];
    
                var tbltext = "<div class='notice-container' style='width: 100%; height: 100%; border-color: coral !important;box-shadow:rgba(191, 195, 221, 0.2) 0 -25px 18px -14px inset,rgba(175, 199, 226, 0.15) 0 1px 2px,rgba(179, 191, 215, 0.15) 0 2px 4px,rgba(136, 161, 168, 0.15) 0 4px 8px,rgba(139, 173, 190, 0.15) 0 8px 16px,rgba(164, 169, 192, 0.15) 0 16px 32px; border-style: ridge !important; border-width: 25px !important; border-color: coral !important; background-color:#dbf0fa'>";
    
                result.forEach(function (notice, index) {
                    var colorIndex = Math.floor(Math.random() * colors.length);
                    var color = colors[colorIndex];
                    // var rotationValue = Math.floor(Math.random() * 11) - 5; // Random rotation between -5 to 5 degrees
    
                    tbltext += "<div class='notice-item' style='background-color: " + color + ";'>";
                    tbltext += "<div class='notice-title'>" + notice.noticetitle + "</div>";
                    tbltext += "<div class='notice-actions'>";
                    tbltext += "<img onclick='noticeinfo(\"" + notice.noticeid + "\",\"" + notice.orgid + "\")' src='/static/image/information.png' style='width:30px; cursor: pointer;' title='Notice Information' />";
                    tbltext += "<img onclick='handleEnquiryClick(\"" + notice.noticeid + "\",\"" + notice.orgid + "\")' src='/static/image/enquiry.png' style='width:25px; cursor: pointer;' title='Enquiry' />";
                    tbltext += "</div></div>";
                });
    
                tbltext += "</div>";
                res.send(tbltext);
            });
        });
    }
    else if (req.body.action === "searchnotices") {
    var searchnoticetext = req.body.searchnoticetext;
    var sql = "SELECT noticeboardtitle, noticeboardid FROM noticeboard_t.noticeboard where noticeboardtitle like '%" + searchnoticetext + "%';";
     console.log(sql);
    ncon.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return;
        } else if (result.length > 0) {
            var tbltext = "<table id='report' class='searchtable' style='width:100%;'><th>Notice Boards</th><th>Notice Board Open</th><tr>";
            for (var i = 0; i < result.length; i++) {
                var noticeboardid = result[i].noticeboardid;
                var noticeboardtitle = result[i].noticeboardtitle;
                var ENVCALURL1=req.get('origin');
                ENVCALURL=ENVCALURL1;
                tbltext += "<tr><td style='width:300px;'><div>" + noticeboardtitle + "</div></td><td style='width:100px;'><a href="+ENVCALURL+"/1/noticeboardQR/" + noticeboardid + " style='color:rgb(96, 136, 224);'>Open</a></td></tr>";                // tbltext += "<td ><div>" + noticeboardtitle + "</div></td><td><a href='http://dev.calendaree.com:55000/1/noticeboardQR/" + noticeboardid + "'> open </a></td>";
            }
            tbltext += "</tr></table>";
            res.send(tbltext);
        }
    });
}
 else if (req.body.action === "shownoticeinfo1") {
        var noticeid = req.body.noticeid;
        var orgid = req.body.orgid;
        
      var sql = "SELECT nf.*, n.* FROM noticefiles nf JOIN notices n ON nf.orgid = n.orgid AND nf.noticeid = n.noticeid WHERE nf.noticeid='" + noticeid + "' AND nf.orgid='" + orgid + "';";
        
        ncon.query(sql, function (err, result) {
            //console.log(sql);
            if (err) {
                console.log(err);
            } else if (result.length > 0) {
                var tbltext = "<table id='report' style='width: 100%;'><tr><th colspan='2'>Notice Information</th></tr>";
                var noticeTitle = result[0].noticetitle;
                var noticeText = result[0].noticetext;
                var fromDate = result[0].fromdate ? result[0].fromdate.toLocaleString() : ''; // Convert date to string
                var toDate = result[0].todate ? result[0].todate.toLocaleString() : ''; // Convert date to string
               // var fileid1= result[0].fileid;
                // Display Notice Title
                tbltext += "<tr><td colspan='2'><strong>Notice Title:</strong> " + noticeTitle + "</td></tr>";
            
                // Display Notice Text
                tbltext += "<tr><td colspan='2'><strong>Notice Text:</strong> " + noticeText + "</td></tr>";
            
                // Display Start and End Date
                tbltext += "<tr><td><strong>Start Date:</strong> " + fromDate + "</td><td><strong>End Date:</strong> " + toDate + "</td></tr>";
            
                // Display Files if available
                //if (result.some(entry => entry.fileid)) { // Check if any file exists
                    tbltext += "<tr><th>File Name</th><th>Action</th></tr>";
                    for (var i = 0; i < result.length; i++) {
                        var fileid= result[i].fileid;
                        var fileid1 = fileid.split('||')[0]; 
                        var fileName = fileid.split('||')[1];
                        // if (logtype === 'file') {
                        //     var fileName = result[i].logtext.split('||')[1]; // Extracting file name
                        //     var fileId = result[i].logtext.split('||')[0]; // Extracting file ID
                            tbltext += "<tr><td>" + fileName + "</td><td><button onclick=downloadfilen('" + fileid1 + "');><img src='/static/image/downloadfile.png' style='height:22px; width:22px;'/></button></td></tr>";
                       // }
                    }
                // } else {
                //     tbltext += "<tr><td colspan='2'>No Files</td></tr>";
                // }
                
                tbltext += "</table>";
                res.send(tbltext);
            } else {
                // If no files are associated with the notice, fetch notice information from the notices table
                var sql1 ="SELECT * FROM notices WHERE noticeid='" + noticeid + "' AND orgid='" + orgid + "';";
                ncon.query(sql1, function (err, result) {
                    //console.log(sql1);
                    if (err) {
                        console.log(err);
                        res.send("Error occurred while fetching notice information.");
                    } else if (result.length > 0) {
                        var tbltext = "<table id='report' style='width: 100%;'><tr><th colspan='2'>Notice Information</th></tr>";
                        var noticeTitle = result[0].noticetitle;
                        var noticeText = result[0].noticetext;
                        var fromDate = result[0].fromdate ? result[0].fromdate.toLocaleString() : ''; // Convert date to string
                        var toDate = result[0].todate ? result[0].todate.toLocaleString() : ''; // Convert date to string
                        
                        // Display Notice Title
                        tbltext += "<tr><td colspan='2'><strong>Notice Title:</strong> " + noticeTitle + "</td></tr>";
                    
                        // Display Notice Text
                        tbltext += "<tr><td colspan='2'><strong>Notice Text:</strong> " + noticeText + "</td></tr>";
                    
                        // Display Start and End Date
                        tbltext += "<tr><td><strong>Start Date:</strong> " + fromDate + "</td><td><strong>End Date:</strong> " + toDate + "</td></tr>";
                    
                        tbltext += "</table>";
                        res.send(tbltext);
                    } else {
                        res.send("No Notice Found.");
                    }
                });
            }
        });
    }
    else if(req.body.action === 'downloadfilen'){
        var noticeid = req.body.noticeid;
        var orgid=req.body.orgid;
        var fileid =req.body.data;
        // var noticeid = req.body.noticeid;
        let path ="noticeboardfilesQR"
        //sql="select * from tasklog where taskid = '"+taskid+"' and orgid like '"+req.session.orgid+"'"
            sql="select * from noticefiles where noticeid = '"+noticeid+"' and fileid like '%"+fileid+"%' and orgid='"+orgid+"'"

        ncon.query(sql, function(err,result){
         console.log(result)
            if(err) logerror(err,req)
            else if(result.length>0){
                var fileid1=result[0].fileid;
                var fileid = fileid1.split('||')[0]; 
                // return new Promise((resolve, reject) => {
                //     retrivefile(req,res,req.body.data,path,orgid,(successfun) => {
                //     resolve(successfun);
                //     });
                // }).then((data)=>{
                    // res.send(fileid)
                    res.send({ fileid, orgid });
                // })
            }else{
                res.send("no file")
            }
        })
    }
    else if(req.body.action==="enquiryseve"){
        var noticeid = req.body.noticeid;
        var orgid2=req.body.orgid2;
        var ename = req.body.ename;
        var contactno = req.body.econtactno;
        var enqtext = req.body.enqtext;
        var noticebid=req.body.noticeboardid;
        var currentdate = new Date();
        var currentdate = currentdate.getFullYear()+'-'+("0" + (currentdate.getMonth() + 1)).slice(-2)+'-'+("0" + currentdate.getDate()).slice(-2) +" "+currentdate.getHours()+':'+currentdate.getMinutes()+':'+currentdate.getSeconds();
        var sql = "insert into enquiry(orgid,contactno,name, currentdate,noticeid,enquirytext,noticeboardid) values('"+orgid2+"','"+contactno+"','"+ename+"', '"+currentdate+"','"+noticeid+"','"+enqtext+"','"+noticebid+"')"
        ncon.query(sql,function(err,result1){
            console.log(sql)
            if(err)console.log(err)
                else if (result1.affectedrows>0)
                {
                    res.send("Enquity Send, Thank You...!")
                }else{
                    res.send("Enquity Send, Thank You...!")
                }  
        })
    }
    else if (req.body.action === "retriveorgname") {
        var noticeboardid = req.body.noticeboardid;
        var sql = "SELECT orgid, noticeboardtitle FROM noticeboard WHERE noticeboardid = '" + noticeboardid + "'";
        ncon.query(sql, function (err, result) {
            // console.log(sql + " show orgid")
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
            } else if (result.length > 0) {
                var orgid = result[0].orgid;
                var arr = [];
                arr.push(result[0].noticeboardtitle);
                var orgSql = "SELECT orgname, address1, phoneno FROM organization WHERE orgid ='" + orgid + "'";
                ncon.query(orgSql, function (err, orgResult) {
                    console.log(orgSql + " orgsql")
                    if (err) {
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    } else if (orgResult.length > 0) {
                        arr.push(orgResult[0].orgname);
                        arr.push(orgResult[0].address1);
                        arr.push(orgResult[0].phoneno);
                        res.send(arr);
                    } else {
                        res.send("Organization not found");
                    }
                });
            } else {
                res.send("Noticeboard not found");
            }
        });
    } else {
        res.status(400).send("Bad Request");
    }
    
});  

app.listen(port,()=>{
    console.log('Server started at  port ${port}')
})


// const optionsssl = {
//     key: fs.readFileSync("/home/cal100/certs/25feb23/cal25feb23.pem"),
//     cert: fs.readFileSync("/home/cal100/certs/25feb23/hostgator.crt"),
// };
// app.listen(55556, () => {
//      console.log(`Server started at  port ${55000}`);
// })
// https.createServer(optionsssl, app).listen(port);

