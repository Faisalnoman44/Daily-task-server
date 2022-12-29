const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c0svav3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const taskCollection = client.db('demoTask').collection('taskCollections')

        // app.delete('/bikes/:id', veifyJWT, verifySeller, async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const result = await bikeCollections.deleteOne(filter);
        //     res.send(result);
        // })

        app.get('/task', async(req, res) =>{
            const allTask = await taskCollection.find({}).toArray()
            res.send(allTask)
        })

        app.post('/task', async(req, res) =>{
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result)
        })

        app.put('/task/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    isCompleted: 'completed'
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/task/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.log)


app.get('/', async(req, res) =>{
    res.send('Demo task server running');
})

app.listen(port, ()=> console.log(`Demo task server is running ${port}`))