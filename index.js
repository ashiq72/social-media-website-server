const express = require("express");
const app = express();
var cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://facebookClone:yrhpVQgyE7uIqBh1@cluster0.yrvrisu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const serviceCollection = client.db("facebookClone").collection("posts");
    const reviewCollection = client.db("facebookClone").collection("comments");
    const aboutCollection = client.db("facebookClone").collection("aboutInfo");

    app.get("/posts", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const posts = await cursor.toArray();
      res.send(posts);
    });
    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const post = await serviceCollection.findOne(query);
      res.send(post);
    });
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await serviceCollection.insertOne(post);
      res.send(result);
    });

    app.post("/comment", async (req, res) => {
      const comment = req.body;
      const result = await reviewCollection.insertOne(comment);
      res.send(result);
    });
    app.get("/comment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const cursor = reviewCollection.find(query);
      const comments = await cursor.toArray();
      res.send(comments);
    });
    app.post("/about", async (req, res) => {
      const post = req.body;
      const result = await aboutCollection.insertOne(post);
      res.send(result);
    });

    app.get("/about", async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const result = await aboutCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Server link ${port}`);
});
