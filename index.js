const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// MiddleWare---------
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0jt69he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const serviceCollection = client.db("carDoctorTwo").collection("servicesTwo");
    const bookingCollection = client.db("carDoctorTwo").collection("bookingsTwo");

    // Data Get Methode
    app.get('/servicesTwo', async(req, res)=>{
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    // Single Data Read ba Get Id unushare
    app.get('/servicesTwo/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId((id))}
        const options = {
            projection: {title: 1, price: 1, service_id: 1, img: 1 },

          };
          const result = await serviceCollection.findOne(query, options);
          res.send(result);
    })

    // Bookings and some data read ba get

      app.get('/bookingsTwo', async (req, res) => {
          console.log(req.query.email);
          let query = {};
          if (req.query?.email) {
              query = { email: req.query.email }
          }
          const result = await bookingCollection.find(query).toArray();
          res.send(result);
      })

    // Bookings 
    app.post('/bookingsTwo', async (req, res) => {
        const booking = req.body;
        console.log(booking);
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
    });


       app.patch('/bookingsTwo/:id', async (req, res) => {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const updatedBooking = req.body;
          console.log(updatedBooking);
          const updateDoc = {
              $set: {
                  status: updatedBooking.status
              },
          };
          const result = await bookingCollection.updateOne(filter, updateDoc);
          res.send(result);
      })


    // Bookings Delete
          app.delete('/bookingsTwo/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) }
          const result = await bookingCollection.deleteOne(query);
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




app.get('/', (req, res) =>{
    res.send('Doctor is running');

})


app.listen(port, ()=>{
    console.log(`car doctor server is running on port ${port}`)
})
