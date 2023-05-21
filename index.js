const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytasiev.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		// await client.connect();

		const toyCollection = client.db('toyMarketplace').collection('toys');
		const cricketCollection = client
			.db('toyMarketplace')
			.collection('cricket');

		const footballCollection = client
			.db('toyMarketplace')
			.collection('football');

		const volleyballCollection = client
			.db('toyMarketplace')
			.collection('volleyball');

		app.get('/toys', async (req, res) => {
			const limit = parseInt(req.query.limit);
			const result = await toyCollection
				.find()
				.sort({ price: -1 })
				.limit(limit)
				.toArray();
			res.send(result);
		});

		app.get('/toys', async (req, res) => {
			console.log(req.query);
			let query = {};
			if (req.query?.email) {
				query = { email: req.query.email };
			}
			const result = await toyCollection.find(query).toArray();
			res.send(result);
		});

		app.get('/toys/:text', async (req, res) => {
			console.log(req.params.text);
			if (
				req.params.text == 'football' ||
				req.params.text == 'cricket' ||
				req.params.text == 'volleyball'
			) {
				const result = await toyCollection
					.find({ category: req.params.text })
					.toArray();
				return res.send(result);
			}
			const result = await toyCollection.find().toArray();
			res.send(result);
		});

		app.get('/toys/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await toyCollection.findOne(query);
			res.send(result);
		});

		app.post('/toys', async (req, res) => {
			const newToy = req.body;
			const result = await toyCollection.insertOne(newToy);
			res.send(result);
		});

		app.get('/football', async (req, res) => {
			const filter = await footballCollection.find().toArray();
			res.send(filter);
		});

		app.get('/cricket/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await cricketCollection.findOne(query);
			console.log(result);
			res.send(result);
		});

		app.get('/football/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await footballCollection.findOne(query);
			console.log(result);
			res.send(result);
		});

		app.get('/volleyball/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await volleyballCollection.findOne(query);
			console.log(result);
			res.send(result);
		});

		app.post('/football', async (req, res) => {
			const newFootball = req.body;
			const result = await footballCollection.insertOne(newFootball);
			res.send(result);
		});

		app.get('/cricket', async (req, res) => {
			const filter = await cricketCollection.find().toArray();
			res.send(filter);
		});

		app.post('/cricket', async (req, res) => {
			const newCricket = req.body;
			const result = await cricketCollection.insertOne(newCricket);
			res.send(result);
		});

		app.get('/volleyball', async (req, res) => {
			const filter = await volleyballCollection.find().toArray();
			res.send(filter);
		});

		app.post('/volleyball', async (req, res) => {
			const newVolleyball = req.body;
			const result = await volleyballCollection.insertOne(newVolleyball);
			res.send(result);
		});

		app.put('/toys/:id', async (req, res) => {
			const id = req.params.id;
			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updatedToy = req.body;

			const toy = {
				$set: {
					name: updatedToy.name,
					quantity: updatedToy.quantity,
					sellerName: updatedToy.sellerName,
					category: updatedToy.category,
					price: updatedToy.price,
					details: updatedToy.details,
					picture: updatedToy.picture,
					rating: updatedToy.rating,
				},
			};
			const result = await toyCollection.updateOne(filter, toy, options);
			res.send(result);
		});

		app.delete('/toys/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await toyCollection.deleteOne(query);
			res.send(result);
		});
		// Send a ping to confirm a successful connection
		await client.db('admin').command({ ping: 1 });
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!'
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Toy marketplace is running');
});

app.listen(port, () => {
	console.log(`Toy marketplace server is running on port ${port}`);
});
