const express = require('express')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
var cors = require('cors')


const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(403).json({ flag: 0, msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Split 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ flag: 0, msg: 'Token missing after Bearer' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ flag: 0, msg: 'Invalid token' });
  }
};


//Import Model
const UserModel = require('./models/Users');
const app = express()
const port = process.env.PORT || 4000;
//DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>console.log("Connection established"))
.catch(err => console.error(err));
//DB End 
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));


app.get('/', (req, res) => {
  res.send('Hello World!')
})
//Add API
//Register API
app.post('/register', async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ flag: 1, msg: 'Registration successful', token, mydata: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ flag: 0, msg: 'Registration failed' });
  }
});


//Display API
app.get('/display', verifyToken, (req, res) => {
  UserModel.find()
    .then(data => {
      if (data.length > 0) {
        res.json({ flag: 1, msg: 'success', mydata: data });
      } else {
        res.json({ flag: 0, msg: 'No Record Found' });
      }
    })
    .catch(err => console.error(err));
});

//Delete API
app.delete('/delete/:id', verifyToken, (req, res) => {
  UserModel.findByIdAndRemove(req.params.id)
  .then(data => res.json({flag:1,msg:'Record deleted'}))
  .catch(err => console.error(err));
});
//Edit API
app.get('/edit/:id', verifyToken, (req, res) => {
  UserModel.findById(req.params.id)
  .then(data => {
    console.log(data);
    res.json({flag:1,msg:'Record found',mydata:data})
  })
  .catch(err => console.error(err));
});

//Update
app.put('/update/:id', verifyToken, (req, res) => {
  UserModel.findByIdAndUpdate(req.params.id, req.body)
  .then(data => {
    console.log(data);
    res.json({flag:1,msg:'Record Updated',mydata:data})
  })
  .catch(err => console.error(err));
});
//Login API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ flag: 0, msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ flag: 0, msg: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ flag: 1, msg: 'Login successful', token, mydata: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ flag: 0, msg: 'Login failed' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
