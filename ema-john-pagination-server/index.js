const express = require("express");
const cors = require("cors");
const client = require("./middleware/middleware");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("emaJohnDB").collection("products");

    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const result = await productCollection
        .find()
        .skip(page * limit)
        .limit(limit)
        .toArray();
      res.send(result);
    });
    // productByIds
    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const idsWithByObjectId = ids.map((id) => new ObjectId(id));
      const query = {
        _id: {
          $in: idsWithByObjectId,
        },
      };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });
    // count
    app.get("/productsCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("john is busy shopping");
});

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
});
