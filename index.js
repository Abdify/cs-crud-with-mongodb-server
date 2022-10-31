const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("colors");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database connected".yellow.italic);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
}

dbConnect();

const Product = client.db("foodPanda").collection("products");
const User = client.db("foodPanda").collection("users");

// endpoint
app.post("/product", async (req, res) => {
  try {
    const result = await Product.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the product",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/product", async (req, res) => {
  try {
    const cursor = Product.find({});
    const products = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: products,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id: ObjectId(id) });

    if (!product?._id) {
      res.send({
        success: false,
        error: "Product doesn't exist",
      });
      return;
    }

    const result = await Product.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount) {
      res.send({
        success: true,
        message: `Successfully deleted the ${product.name}`,
      });
    } else {
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: ObjectId(id) });

    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.patch("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.updateOne({ _id: ObjectId(id) }, { $set: req.body });

    if (result.matchedCount) {
      res.send({
        success: true,
        message: `successfully updated ${req.body.name}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't update  the product",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => console.log("Server up and running".cyan.bold));
