const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log('URL = ', req.url);
  console.log('Original_URL = ', req.originalUrl);
  console.log('METHOD = ', req.method);
  console.log('HOST = ', req.headers.host);
  console.log('IsSecure = ', req.secure);
  console.log('BODY', req.body);
  console.log('QUERY', req.query);

  next();
});

app.all('/test', (req, res) => {
  res.status(200).json({ message: 'KKKKKK'});
})
app.get('/get', (req,res) => {
    res.status(200).json({message: 'Get'});
})

app.post('/post', (req,res) => {
    res.status(200).json({message: 'Post'});
})

app.put('/put', (req,res) => {
    res.status(200).json({message: 'Put'});
})

app.patch('/patch', (req,res) => {
    res.status(200).json({message: 'Patch'});
})

app.delete('/delete', (req,res) => {
    res.status(200).json({message: 'Delete'});
})

// функция сложения
app.post('/sum', (req,res) => {
    let Sum = req.body.a + req.body.b;
    res.status(200).json({message: 'Result:' + Sum});
})

// функция смены регистра
app.post('/reverseCase', (req,res) => {
    let str = req.body.a;
    let str1 = '';
    for (let i = 0; i < str.length; i++ )
    {
        if (str[i] === str[i].toUpperCase())
        {
            str1 += str[i].toLowerCase();
        }
        else
        {
            str1 += str[i].toUpperCase();
        }
    }
    res.status(200).json({message: 'Reverse case:'+ str1});
})

// функция обратного массива
app.post('/reverseArray', (req,res) => {
    let array = req.body.arr;
    let reverseArray = array.reverse();
    res.status(200).json({message: 'Reverse Array:' + reverseArray});
})


http.createServer(app).listen(3000, () => {
  console.log('Server is working on port 3000');
})