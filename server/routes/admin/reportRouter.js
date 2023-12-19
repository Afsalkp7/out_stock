const express = require("express");
const route = express.Router();
const auth = require("../../middlewere/auth");
const adminCollection = require("../../model/adminModel");
const PlaceOrder = require("../../model/orderPlaceModel");
const { order } = require("paypal-rest-sdk");
const Order = require("../../model/oraderModel");
const Product = require("../../model/productModel")


const isSameDay = (date1, date2) => {
  const day1 = new Date(date1);
  const day2 = new Date(date2);
  return (
    day1.getUTCFullYear() === day2.getUTCFullYear() &&
    day1.getUTCMonth() === day2.getUTCMonth() &&
    day1.getUTCDate() === day2.getUTCDate()
  );
};


route.get("/", auth, async (req, res) => {
  const _id = req.adminId;
  const admin = await adminCollection.findOne({ _id });

  //
  const orders = await PlaceOrder.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);
  let totalOrders = 0;
  let delivered;
  let cancelled;
  let pendingOrders = 0;
  for (ord of orders) {
    totalOrders += ord.count;
    if (ord._id == "Delivered") {
      delivered = ord.count;
    } else if (ord._id == "cancelled") {
      cancelled = ord.count;
    } else {
      pendingOrders += ord.count;
    }
  }
  const orderCount = { delivered, cancelled, totalOrders, pendingOrders };
  //
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

  //

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
  //find last 5 orders

  const lastOrders = await PlaceOrder.find();
  const last5Orders = lastOrders.slice(0, 5);

  //find current month orders

  const currentMonthOrders = await PlaceOrder.aggregate([
    {
      $match: {
        $expr: {
          $gt: [
            "$orderedDate",
            {
              $dateSubtract: {
                startDate: "$$NOW",
                unit: "month",
                amount: 1,
              },
            },
          ],
        },
      },
    },
  ]);


  const monthOrdersAmount = [];

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const filteredData = currentMonthOrders.filter((obj) => {
      return new Date(obj.orderedDate).getDate() === i;
    });
    let grandTotalSum = 0;
    for (j = 0; j < filteredData.length; j++) {
      grandTotalSum += filteredData[j].totalAmount;
    }
    monthOrdersAmount.push({ x: grandTotalSum, y: i });
  }

  const last5YearOrders = await PlaceOrder.aggregate([
    {
      $match: {
        $expr: {
          $gt: [
            "$orderedDate",
            {
              $dateSubtract: {
                startDate: "$$NOW",
                unit: "year",
                amount: 5,
              },
            },
          ],
        },
      },
    },
  ]);

  console.log(last5YearOrders.length);
  const fiveYears = [];
  for (i = 0; i < 5; i++) {
    var current = new Date();
    current.setFullYear(current.getFullYear() - i);
    fiveYears.push(current.getFullYear());
  }
  const fiveYearAmounts = [];
  for (i = 0; i < fiveYears.length; i++) {
    const filteredData = last5YearOrders.filter((obj) => {
      return new Date(obj.orderedDate).getFullYear() === fiveYears[i];
    });
    let grandTotalSum = 0;
    for (j = 0; j < filteredData.length; j++) {
      grandTotalSum += filteredData[j].totalAmount;
    }
    fiveYearAmounts.push(grandTotalSum);
  }

  const mostSelled = await PlaceOrder.aggregate([
    {
      $unwind: {
        path: "$orderItems",
      },
    },
    {
      $group: {
        _id: "$orderItems.productId",
        totalSold: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalSold: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  const mostSelledProduct = await Product.findById(mostSelled[0]._id)
  const totalSold = mostSelled[0].totalSold
  const mostOrdred = {mostSelledProduct,totalSold}  
  const secondMostSelledProduct = await Product.findById(mostSelled[1]._id)
  const secondTotalSold = mostSelled[1].totalSold
  const secondMostOrdred = {secondMostSelledProduct,secondTotalSold}  
  const thirdMostSelledProduct = await Product.findById(mostSelled[2]._id)
  const thirdTotalSold = mostSelled[2].totalSold
  const thirdMostOrdred = {thirdMostSelledProduct,thirdTotalSold}  
 

  res.render("adminReport", {
    admin,
    orderCount,
    weekOrdersAmount,
    YearOrdersAmount,
    last5Orders,
    monthOrdersAmount: JSON.stringify(monthOrdersAmount),
    fiveYearAmounts,
    fiveYears,
    mostOrdred,
    secondMostOrdred,
    thirdMostOrdred
  });
});

module.exports = route;
