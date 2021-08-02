var express = require("express");
const Product = require("../models/product");
const AppData = require("../models/app-data");
var router = express.Router();

// async function getAndIncrementLastIdAsync(defaultLastId = 1000) {
//   let appData = await AppData.findOne({ _id: "DB_ID" });
//   let lastId = defaultLastId;

//   // if App data is null...
//   if (!appData) {
//     appData = new AppData({
//       _id: "DB_ID",
//       lastId: lastId,
//     });
//   } else {
//     lastId = appData.lastId;
//   }

//   lastId++;

//   appData.lastId = lastId;
//   appData.save();

//   return lastId;
// }

async function getLastIdAsync(defaultLastId = 1000) {
  let lastProduct = await Product.find({}).sort({ _id: -1 }).limit(1);
  let lastId = lastProduct.length > 0 ? lastProduct[0]._id: defaultLastId;

  lastId++;

  return lastId;
}

router.post("/", async function (req, res, next) {
  // const id = req.body._id;
  const title = req.body.title;
  const content = req.body.content;  
  const file = req.files["profilePicture"];
  const filePath = `./productimage/${file.name}`;
  file.mv(filePath);

  const lastId = await getLastIdAsync();

 const product = new Product({
  //  _id:id,
   _id: lastId.toString(),
   title: title,
   content: content,
   profilePicture: filePath,
 });

  // saves student informationy
  product
    .save()
    .then(() => {
      // sending response to user...
      res.status(200).send({
        status: 200,
        message: "Product created successfully.",
        product: product,
      });
    })
    .catch((error) => {
       if (error.code === 11000) {
         res.status(400).send({
           status: 400,
           message: `Id is already used.`,
         });
       }
      console.log("error",error);
      res.status(500).send({
        status: 500,
        message: "An error occurred." + error.message,
      });
    });
});



module.exports = router;
