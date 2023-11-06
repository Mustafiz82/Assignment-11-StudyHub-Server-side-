const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5100;
require('dotenv').config()


app.use(cors());    
app.use(express.json());


app.get("/", (req, res) => {
  res.send("simple crud is running");
});



const uri = `mongodb+srv://${process.env.USERDB}:${process.env.USERPASS}@cluster0.uotm6ic.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();

    const database = client.db("AssignmentDB");
    const AssignmentCollection = database.collection("Assignment");


    app.post("/assignments" , async (req, res) => {
        const data = req.body;
        console.log(data);
        const result = await AssignmentCollection.insertOne(data);
        res.send(result);
      });

    
    app.get("/assignments" , async (req , res) => {

        const cursor = AssignmentCollection.find()
        const result = await cursor.toArray()
        res.send(result)        
    })


    app.get("/assignments/:id" , async(req , res) =>{
        const id = req.params.id
        console.log(id);
        const query = {_id : new ObjectId(id)}
        const result = await AssignmentCollection.findOne(query);
        res.send(result)
  
  
  
      })
  



    
  


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {

    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port, () => {
  console.log(`simple crud is running on ${port}`);
});


