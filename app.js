const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3900;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("./server/database/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

dotenv.config({ path: "config.env" });

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
app.use(passport.initialize());
app.use(passport.session())


app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));



app.use("/", require("./server/routes/user/indexRouter"));
app.use("/shop", require("./server/routes/user/shop"));
app.use("/admin", require("./server/routes/admin/router"));
app.use("/admin/users", require("./server/routes/admin/userRouter"));
app.use("/admin/products", require("./server/routes/admin/productRouter"));
app.use("/admin/brands", require("./server/routes/admin/brandRouter"));
app.use("/admin/categories", require("./server/routes/admin/categoryRouter"));

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
