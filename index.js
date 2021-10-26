const express = require('express');
const http = require('http');
const cors = require('cors');
const { consumers } = require('stream');
const { rawListeners } = require('process');
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("DataBase", "postgres", "1245", {
  dialect: "postgres",
  host: "localhost"
});
const db1 = sequelize.define("Db1", {
  title: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  }
});
sequelize.sync().then(result=>console.log(result))
.catch(err=> console.log(err));

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./localstorage');
  }

if (!!localStorage.getItem("Arr")){
    var Arr = localStorage.getItem("Arr");
}
else{
    var Arr = [];
}

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

app.post('/strings', (req,res) =>{
    let string = req.body.str;
    Arr.push(string);
    localStorage.setItem("Arr", Arr);
    res.status(200).json({message: "Done!"});
})

app.get('/strings', (req,res) => {
    res.status(200).json({message: 'String Array is ' + Arr.toString()});
})

app.delete('/strings/:index', (req,res) => {
    index = req.params.index - 1;
    if (index != Arr.length - 1){
    Arr = Arr.slice(0,index).concat(Arr.slice(index + 1));
    }
    else{
        Arr.pop();
    }
})

app.delete('/strings', (req,res) => {
    Arr = [];
    res.status(200).json({message:'All done!'});
})

app.post('/db', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let Db1 = db1.build({
      title: title,
      description: description
    });
    Db1.save();
    res.status(200).json({message: "Created DataBase", title: title, description: description})
    })
    
    app.get('/db',async (req, res) => {
      let title = req.body.title;
      let Db1 = await db1.findAll({
        raw: true,
        where : {
          title: title
        }
      })
      Db1 = Db1[0];
      if (Db1 != undefined){
        res.status(200).json({message: "Your DataBase", title: Db1.title, description: Db1.description})
      }
      else {
        res.status(404).json({message: "DataBase not found"})
      }
      
    })
    
    app.put('/db',async (req, res) => {
      let title = req.body.title;
      let description = req.body.description;
      let Db1 = await db1.findAll({
        raw: true,
        where : {
          title: title
        }
      })
      if (Db1[0] != undefined){
         await db1.update(
          {description : description}, 
          { where : {
            title: title
          }
        })
        res.status(200).json({message: "Changed DataBase", title: title, description: todo.description })
      }
      else {
        res.status(404).json({message: "DataBase not found"})
      }
    })
    
    app.delete('/db',async (req, res) => {
      let title = req.body.title;
      let Db1 =await db1.findAll({
        where : {
          title: title
        }
      })
      Db1 = Db1[0];
      if (Db1 != undefined){
        db1.destroy({
          where : {
            title: title
          }
        });
        res.status(200).json({message: "Deleted DataBase", title: title})
      }
      else {
        res.status(404).json({message: "DataBase not found"})
      }
    })
    
    app.delete('/db/all',async (req, res) => {
      let title = req.body.title;
      let Db1 =await db1.findAll({
      })
      if (Db1[0] != undefined){
        db1.destroy({
          truncate: true,
      })
      res.status(200).json({message: "Deleted all DataBases"})
      }
      else
      res.status(200).json({message: "Table is empty"})
    })

http.createServer(app).listen(3000, () => {
  console.log('Server is working on port 3000');
})