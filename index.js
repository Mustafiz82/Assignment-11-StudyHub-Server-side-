const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5100;
require("dotenv").config();

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
	},
});

async function run() {
	try {
		await client.connect();

		const database = client.db("AssignmentDB");
		const AssignmentCollection = database.collection("Assignment");
		const SubmittedAssignmentCollection = database.collection(
			"SubmittedAssignment"
		);

		//  create operation

		app.post("/assignments", async (req, res) => {
			const data = req.body;
			console.log(data);
			const result = await AssignmentCollection.insertOne(data);
			res.send(result);
		});

		//   read operation

		app.get("/assignments", async (req, res) => {
			const cursor = AssignmentCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		app.get("/featured", async (req, res) => {
			const cursor = AssignmentCollection.find().skip(8).limit(6);
			const result = await cursor.toArray();
			res.send(result);
		});

		//  specefic data read operation

		app.get("/assignments/:id", async (req, res) => {
			const id = req.params.id;
			// console.log(id);
			const query = { _id: new ObjectId(id) };
			const result = await AssignmentCollection.findOne(query);
			res.send(result);
		});

		// Delete  Operation of Assignmet

		app.delete("/assignments/:id", async (req, res) => {

			const id = req.params.id;
			const { email } = req.query;

			const query = { _id: new ObjectId(id) };
            console.log(id);
			// const result = await AssignmentCollection.findOne(query);
			const result = await AssignmentCollection.findOne(query);

			console.log("delete result find : " , result);

            if (!result) {
                console.log("no item found")
                return res.status(404).json({ message: "Assignment not found" });
              }

            if(email == result?.creatorEmail){
               
                const deleteResult = await AssignmentCollection.deleteOne(query);
                res.send(deleteResult)
            }
            else{
                return res.status(403).json({ message: "Access denied. Email does not match." });
            }

            // const deleteResult = await AssignmentCollection.deleteOne(query);
            // res.send(deleteResult)
			// const query = {_id : new ObjectId(id)}

			// const data =

			// query to select which data need to be delete if not used
			// all data will be deleted
			// const result = await AssignmentCollection.deleteOne(query);
			// res.send(result)
		});

		//  update operation

		app.put("/assignments/:id", async (req, res) => {
			const id = req.params.id;
			const updateAssignment = req.body;
			console.log(id, updateAssignment);

			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					creatorEmail: updateAssignment.creatorEmail,
					dueDate: updateAssignment.dueDate,
					description: updateAssignment.description,
					marks: updateAssignment.marks,
					imageURL: updateAssignment.imageURL,
					difficulty: updateAssignment.difficulty,
				},
			};

			console.log(updateDoc);

			const result = await AssignmentCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.send(result);
		});

		//   submitted Assignment create operation

		app.post("/submittedAssignments", async (req, res) => {
			const data = req.body;
			console.log(data);
			const result = await SubmittedAssignmentCollection.insertOne(data);
			res.send(result);
		});

		//   submitted Assignment read operation

		app.get("/submittedAssignments", async (req, res) => {
			const query = { status: "pending" };
			const cursor = SubmittedAssignmentCollection.find(query);

			const result = await cursor.toArray();
			res.send(result);
		});

		// find each Submitted Assgnment

		app.put("/submittedAssignments/:id", async (req, res) => {
			const id = req.params.id; // Get the ID from the route parameters
			const updateSubmitAssignment = req.body;
			console.log(id, updateSubmitAssignment);

			const filter = { _id: new ObjectId(id) };
			console.log(filter);

			const options = { upsert: true };
			const updateDoc = {
				$set: {
					status: updateSubmitAssignment.status,
					ObtainMarks: updateSubmitAssignment.obtainMarks,
					feedback: updateSubmitAssignment.feedback,
				},
			};

			//   console.log(updateDoc);

			const result = await SubmittedAssignmentCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.send(result);
		});

		app.get("/mySubmittedAssignments", async (req, res) => {
			const query = req.query;
			console.log(query);
			// const query = { userEmail: "md.mustafizrahman8260@gmail.com" };
			const cursor = SubmittedAssignmentCollection.find(query);
			const result = await cursor.toArray();
			res.send(result);
		});


        // 

		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`simple crud is running on ${port}`);
});
