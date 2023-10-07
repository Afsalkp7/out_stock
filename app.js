const express = require("express");
const app = express()
const dotenv = require("dotenv")
const PORT = process.env.PORT || 3900   
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path")
const mongoose = require("./server/database/db")
const cookieParser = require('cookie-parser');


dotenv.config({path:"config.env"})

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser())

app.set("view engine",'hbs')
app.set("views",path.join(__dirname,'views'))

app.use("/css",express.static(path.resolve(__dirname,"assets/css")))
app.use("/img",express.static(path.resolve(__dirname,"assets/img")))
app.use("/js",express.static(path.resolve(__dirname,"assets/js")))


app.use('/',require("./server/routes/user/indexRouter"))
app.use('/admin',require('./server/routes/admin/router'))




// app.use((req, res, next) => {
//     res.status(404).send("Page not found");
//   });

app.listen(PORT,()=>console.log(`server is running on ${PORT}`))