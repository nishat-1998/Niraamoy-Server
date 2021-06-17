const express = require('express');
const app = express();
const cors = require('cors');
const fs= require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port = process.env.PORT || 5055;


app.use(cors());
app.use(express.json())
app.use(express.static('Review'));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send("Hello, Niraamoy Health Server Is Working")
})
const uri = "mongodb+srv://niraamoyHealth:Nh18448521@cluster0.98xqu.mongodb.net/niraamoyStore?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const adminCollection = client.db("niraamoyStore").collection("products");
  const orderCollection = client.db("niraamoyStore").collection("order");

  app.get('/products',(req,res) =>{
    adminCollection.find()
    .toArray((err,items) =>{
       res.send(items)
      console.log('from db',items)
    })
})

app.post('/addProduct', (req, res) => {
  const file = req.files.file;
  const name = req.body.name;  
  const group = req.body.group;
  const company = req.body.company;
  const type = req.body.type;
  const regular = req.body.regular;
  const selling = req.body.selling;
  const pieces= req.body.pieces;
  const size = req.body.size;
  const quantity = req.body.quantity;
  const newImg = file.data;
 // const filePath = `${__dirname}/product/${file.name}`;
//  file.mv(filePath,err =>{
 //   if(err){
 //     console.log(err);
   //   return res.status(500).send({msg: 'Failed to Upload'});
 //   }

   // const newImg= fs.readFileSync(filePath);
    const encImg= newImg.toString('base64');

    var image ={
      contentType: file.mimetype,
      size:file.size,
      img: Buffer.from(encImg, 'base64')
    };

    adminCollection.insertOne({ name, group, company, type, regular, selling, pieces, size, quantity, image })
    .then(result => { 
        res.send(result.insertedCount > 0);
    })

   // return res.send({name:file.name, path: `${file.name}`})
  })



app.get('/orders/:id', (req, res) => {
  adminCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, documents) => {
    res.send(documents)
  })
})

app.post('/productsByOrder', (req, res) => {
  console.log(req.body);
  const orderProducts = req.body;
  orderCollection.insertOne(orderProducts)
  .then((result) => {
    console.log('Showing Ordered', result.insertedCount);
    res.send(result.insertedCount > 0)
  })
})


});


  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })