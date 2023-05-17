const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 50001

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello jhon')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tfxumrl.mongodb.net/?retryWrites=true&w=majority`;

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

        const productsCollection = client.db('emaJhon').collection('products')


        app.get('/products', async (req, res) => {
            const { limit, page } = req.query;
            const pageSize = parseInt(limit) || 10;
            const pageNumber = parseInt(page) || 1;
            const skip = pageNumber * pageSize;
            const result = await productsCollection.find().skip(skip).limit(pageSize).toArray()
            res.send(result)
        })

        app.get('/totalProducts', async (req, res) => {
            const result = await productsCollection.estimatedDocumentCount()
            res.send({ totalProducts: result })
        })

        app.post('/inventory', async (req, res) => {
            const ids = req.body
            const objectIds = ids.map(id => new ObjectId(id))
            const query = { _id: { $in: objectIds } }
            const result = await productsCollection.find(query).toArray()
            res.send(result)
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


app.listen(port)