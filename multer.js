// const multer = require("multer");

// const storage = multer.diskStorage({
//     destination : function (req,file,cb){
//         cb(null,'/img/uploads/')
//     },
//     filename : function (req,res,cb){
//         cb(null,Date.now() + '-' + file.originalname)
//     }
// })

// const fileFilter=(req,file,cb)=>{
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
//         cb(null,true)
//     }else{
//         cb({message:'un supported file format'},false)
//     }
// }

// const upload = multer({
//     storage:storage,
//     limits:{fileSize:1024*1024},
//     fileFilter:fileFilter
// })

// module.exports = upload;
