const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhgag9l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("users");

    // get data
    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    // post data 
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    // user related API

    // get
    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const user = await cursor.toArray();
      res.send(user);
    })

    // create
    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user)
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    //  update
    app.patch('/user', async (req, res) => {
      const user = req.body;
      console.log(user)
      const filter = { email: user.email }
      const updateUser = {
        $set: {
          lastSign: user.lastSign
        }
      }
      const  option = { upsert: true }
      const result = await userCollection.updateOne(filter, updateUser, option)
      res.send(result)
    })

    // Delete
    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = userCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Require the routes in our application/server.
app.get('/', (req, res) => {
  res.send('Coffee Store server is running')
})

app.listen(port, () => {
  console.log(`Coffee store  server is listening on ${port}`)
})