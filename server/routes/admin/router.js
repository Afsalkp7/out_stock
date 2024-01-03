const express = require("express");
const route = express.Router();
const adminCollection = require("../../model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;
const auth = require("../../middlewere/auth");
const session = require("express-session");
const { token } = require("morgan");
const PlaceOrder = require("../../model/orderPlaceModel");
const userCollection = require("../../model/userModel");
const Coupon = require("../../model/couponModel");
const Product = require("../../model/productModel");
const Category = require("../../model/category");
const Brand = require("../../model/brandsModel");
const Banner = require("../../model/bannerModel");

const isSameDay = (date1, date2) => {
  const day1 = new Date(date1);
  const day2 = new Date(date2);
  return (
    day1.getUTCFullYear() === day2.getUTCFullYear() &&
    day1.getUTCMonth() === day2.getUTCMonth() &&
    day1.getUTCDate() === day2.getUTCDate()
  );
};

const {
  AuthRegistrationsCredentialListMappingContext,
} = require("twilio/lib/rest/api/v2010/account/sip/domain/authTypes/authRegistrationsMapping/authRegistrationsCredentialListMapping");

// route.get("/",(req,res)=>{
//     res.render('adminSignup')
// })
// route.post("/admin_login",async(req,res)=>{
//     try {
//         const {password,cpassword} = req.body
//         if(password === cpassword){
//             const outstockAdminData = new adminCollection({
//                 userName : req.body.name,
//                 email : req.body.email,
//                 phone : req.body.phone,
//                 password : req.body.password,
//                 cpassword : req.body.cpassword
//             })
//             const adminData = await outstockAdminData.save()
//             res.render("adminLog")
//         }else{
//             res.render("adminSignup")
//         }
//     } catch (error) {
//         res.send(error)
//     }
// })

route.get("/", (req, res) => {
  const token = req.cookies.session;
  if (token) {
    res.redirect("/admin/index");
  } else {res.render("adminlog");}
});

route.get("/index", auth, async (req, res) => {
  if (req.cookies.session) {
    const _id = req.adminId;
    const admin = await adminCollection.findOne({ _id });
    //find order count
    const orderCount = await PlaceOrder.countDocuments({});
    console.log("orderCount : " , orderCount);
    const orderPlaceCount = await PlaceOrder.countDocuments({
      orderStatus: "Order Placed",
    });
    const orderShippedCount = await PlaceOrder.countDocuments({
      orderStatus: "Shipped",
    });
    const orderOutForDeliveryCount = await PlaceOrder.countDocuments({
      orderStatus: "Out for delivery",
    });
    const orderDeliveredCount = await PlaceOrder.countDocuments({
      orderStatus: "Delivered",
    });
    const orderCancelledCount = await PlaceOrder.countDocuments({
      orderStatus: "cancelled",
    });
    // find user count
    const userount = await userCollection.countDocuments({});
    //find total earnings
    const totalEarnings = await PlaceOrder.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);
    console.log("totalEarnings",totalEarnings);
    const earings = totalEarnings[0].total;

    //find amount online payment

    //find total earnings
    const CODAmount = await PlaceOrder.aggregate([
      {
        $match: {
          paymentId: "cash on delivery"
        }
      },
      {
        $group: {
          _id: null,
          totalAmountSum: {
            $sum: "$totalAmount"
          }
        }
      }
    ])
    const cashOnDeliveryAmount = CODAmount[0].totalAmountSum;

    //find products count
    const productsCount = await Product.countDocuments({});
    //find category count
    const categoryCount = await Category.countDocuments({});
    //find brands count
    const brandsCount = await Brand.countDocuments({});
    //find banners count
    const bannerCount = await Banner.countDocuments({});

    //find count of coupons
    const couponCount = await Coupon.countDocuments({
      startDate: {
        $lte: new Date(),
      },
      endDate: {
        $gte: new Date(),
      },
    });
    //find discound amount
    const discount = await PlaceOrder.aggregate([
      {
        $group: {
          _id: null,
          totalAmountSum: {
            $sum: "$discound"
          }
        }
      }
    ])
    const couponDeduction = discount[0].totalAmountSum
    // sales report in last week
    const lastWeekOrders = await PlaceOrder.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$orderedDate",
              {
                $dateSubtract: {
                  startDate: "$$NOW",
                  unit: "day",
                  amount: 7,
                },
              },
            ],
          },
        },
      },
    ]);
    const weekOrdersAmount = [];
    for (i = 0; i < 7; i++) {
      var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      var filteredData = lastWeekOrders.filter((obj) =>
        isSameDay(obj.orderedDate, targetDate)
      );
      var grandTotalSum = 0;
      for (j = 0; j < filteredData.length; j++) {
        grandTotalSum += filteredData[j].totalAmount;
      }
      weekOrdersAmount.push(grandTotalSum);
    }

    //today sale
    const todayOrder = weekOrdersAmount[0]

    //sales on this year

    const lastMonthOrders = await PlaceOrder.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$orderedDate",
              {
                $dateSubtract: {
                  startDate: "$$NOW",
                  unit: "month",
                  amount: 12,
                },
              },
            ],
          },
        },
      },
    ]);

    const YearOrdersAmount = [];
    for (i = 0; i < 12; i++) {
      var targetMonth = i;

      var filteredData = lastMonthOrders.filter((obj) => {
        return obj.orderedDate.getMonth() === targetMonth;
      });
      var grandTotalSum = 0;
      for (j = 0; j < filteredData.length; j++) {
        grandTotalSum += filteredData[j].totalAmount;
      }
      YearOrdersAmount.push(grandTotalSum);
    }
    //find onlinePayment
    const onlinePayment = earings-cashOnDeliveryAmount
    //find last 5 orders
    const lastOrders = await PlaceOrder.find();
    const last5Orders = lastOrders.slice(0, 5);
    
    res.render("dashboard", {
      admin,
      orderCount,
      userount,
      earings,
      couponCount,
      weekOrdersAmount,
      YearOrdersAmount,
      orderPlaceCount,
      orderShippedCount,
      orderOutForDeliveryCount,
      orderDeliveredCount,
      orderCancelledCount,
      productsCount,
      categoryCount,
      brandsCount,
      bannerCount,
      last5Orders,
      cashOnDeliveryAmount,
      onlinePayment,
      couponDeduction,
      todayOrder,
    });
  } else {
    res.redirect("/admin");
  }
});

route.post("/admin_login", async (req, res) => {
  const { email, loginPassword } = req.body;
  try {
    const adminProfile = await adminCollection.findOne({ email });
    if (
      adminProfile &&
      (await bcrypt.compare(loginPassword, adminProfile.password))
    ) {
      const token = jwt.sign({ adminId: adminProfile._id }, secretKey);
      // req.session.adminId = adminProfile._id;
      res.cookie("session", token);
      return res.redirect("/admin");
    } else {
      res.render("adminlog", { emailMatch: true });
    }
  } catch (error) {
    res.send(error)
  }
});

route.put("/update", auth, async (req, res) => {
  const admin_id = req.body._id;
  console.log(admin_id);
  const updatedData = await adminCollection.updateOne(
    { _id: admin_id },
    { $set: req.body }
  );
  res.json(updatedData);
});

route.get("/logout", (req, res) => {
  if (req.cookies.session) {
    res.clearCookie("session");
    res.redirect("/admin");
  } else {
    res.render("adminlog");
  }
});

module.exports = route;
