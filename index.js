const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middelwere  //
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ee1wrfu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
 
    await client.connect();


    const foodsCollection = client.db('foodshop').collection('foods')
    const cartsCollection = client.db('foodshop').collection('cart')
 

app.get("/foods", async (req,res)=>{
    foods = await foodsCollection.find().toArray()
    res.send(foods)
})
app.get("/carts", async (req,res)=>{
  const email= req.query.email
  const filter = {email:email}
    foods = await cartsCollection.find(filter).toArray()
    res.send(foods)
})

app.put("/addToCart/:id", async(req,res)=>{

  const id = req.params.id
  const item = req.body
  const filter ={_id:new ObjectId(id)}
  const options = { upsert: true };
  const updateDoc = {
        $set:item,
      };
  const cartItem = await cartsCollection.updateOne(filter,updateDoc,options)
  res.send(cartItem)

})


app.delete("/deleteCartItem/:id", async(req,res)=>{
  
 const id = req.params.id
  const filter = {_id:new ObjectId(id)}
  const cartItem = await cartsCollection.deleteOne(filter)
  res.send(cartItem)

})



app.put("/updateCartItem/:id", async(req,res)=>{

  const id = req.params.id
  const item = req.body
  const filter ={_id:new ObjectId(id)}
  const options = { upsert: true };
  const updateDoc = {
        $set:item,
      };
  const cartItem = await cartsCollection.updateOne(filter,updateDoc,options)
  res.send(cartItem)

})

  
}


run().catch(console.dir);


app.get("/",(req,res) =>{
res.send("Food shop server is running")
})
app.listen(port,()=>{
    console.log(`server is running :${port}`);
})