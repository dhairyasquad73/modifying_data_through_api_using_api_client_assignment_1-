const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3010 || process.env.PORT;

// middlieware
app.use(bodyParser.json());
app.use(express.static('static'));

// mongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://dhairyajangirs73:dhairya123@cluster0.fe8x2.mongodb.net/" , { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// define menuItem schema
const menuItemSchema = new mongoose.Schema({
  name: {type :String, required: true},
  price: {type: Number, required: true},
  description: String,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// routes
app.post('/menu', async (req, res) => {
  try {
    const {name, price, description} = req.body;
    if (!name || !price) {
      return res.status(400).send('name and price are required');
    }

    const newItem = new MenuItem({name, price, description});
    await newItem.save();
    res.status(201).json({message: 'Item added successfully', item: newItem});
  } catch (error) {
    res.status(500).send({error: "Internal server error"});
  }
});

app.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(201).json(items);
  } catch (error) {
    res.status(500).send({error: "Internal server error"});
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
