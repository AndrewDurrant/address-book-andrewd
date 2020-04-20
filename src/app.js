require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

const { NODE_ENV } = require('./config');

const app = express();

const morganOption = NODE_ENV === 'production'
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  let message; // eslint-disable-line no-unused-vars
  if (NODE_ENV === 'production') {
    message = 'Server error';
  } else {
    console.log(error);
    message = error.message;
  }
  res.status(500).json({ error: error.message });
});

const addresses = [
  {
    "id": "3c8da4d5-1597-46e7-baa1-e402aed70d80", 
    "firstName": "Pato",
    "lastName": "Banton",
    "address1": "720 Skylark Way",
    "address2": "Apt. 311",
    "city": "Seattle",
    "state": "WA",
    "zip": "98047"
  },
  {
    "id": "3c77ytw5-1597-46e7-baa1-e402aed70d80", 
    "firstName": "Bingy",
    "lastName": "Bunny",
    "address1": "900 E 333 S",
    "address2": "",
    "city": "Beaver",
    "state": "UT",
    "zip": "84033"
  },
];

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.get('/address', (req, res) => {
  res
    .json(addresses);
});

app.post('/address', (req, res) => {
  const { firstName, lastName, address1, address2, city, state, zip } = req.body;


  // Check to see that all required fields were sent.
  if (!firstName) {
    return res
      .status(400)
      .send('First name required');
  }

  if (!lastName) {
    return res
      .status(400)
      .send('Last name required');
  }

  if (!address1) {
    return res
      .status(400)
      .send('Address required');
  }

  if (!city) {
    return res
      .status(400)
      .send('City required');
  }

  if (!state) {
    return res
      .status(400)
      .send('State required');
  }

  if (!zip) {
    return res
      .status(400)
      .send('Zip code required');
  }

  // make sure first and last name are formatted correctly
  if (firstName.match(/^(?=.*\d)/)) {
    return res
      .status(400)
      .send('First name must be letters only');
  }

  if (lastName.match(/^(?=.*\d)/)) {
    return res
      .status(400)
      .send('Last name must be letters only');
  }

  if (address1.length < 6 || address1.length > 30) {
    return res
      .status(400)
      .send('Address must be between 6 and 30 characters');
  }

  if (city.match(/^(?=.*\d)/)) {
    return res
      .status(400)
      .send('City must only contain letters');
  }

  if (state.length !== 2) {
    return res
      .status(400)
      .send('State must be exactly 2 letters');
  }

  if (zip.length !== 5) {
    return res
      .status(400)
      .send('Zip must be a five digit number');
  }

  const id = uuidv4();
  const newAddress = {
    id, 
    firstName, 
    lastName,
    address1, 
    address2, 
    city,
    state,
    zip
  };

  addresses.push(newAddress);

  res
    .status(201)
    .location(`http://localhost:8000/address/${id}`)
    .json(newAddress);
});

app.delete('/address/:addressId', (req, res) => {
  const { addressId } = req.params;
  const index = addresses.findIndex(a => a.id === addressId);

  if (index === -1) {
    return res
      .status(404)
      .send('Address not found');
  }

  addresses.splice(index, 1);

  res
    .status(204)
    .end();
});


// if no route matches, return 404 with HTML page - Express default route

module.exports = app;