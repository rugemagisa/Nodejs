var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'immosquaredb',
  debug: false
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
 
router.get('/select', function (req,res,next){
  db.query("SELECT * FROM annonce", function (err, rs){
    res.render('select', {annonce: rs});
  });
});

// get users with api
router.get('/api/annonce',(req,res)=> {
  db.query('SELECT * FROM annonce', (err,rows,fields)=>{
      if(!err)
      res.send(rows);
      else
      res.send(err);
  })
});

// API get one user

router.get('/api/annonce/:IdAnnonce',(req,res)=> {
  db.query('SELECT * FROM annonce WHERE IdAnnonce = ?',[req.params.iduser], (err,rows,fields)=>{
      if(!err)
      res.send(rows);
      else
      console.log(err);
  })
});

//Insert a user ne fonctionne pas

/* GET form new annonce */
router.get('/form', function(req, res, next){
  let annonce = req.body;
  res.render('form', { annonce: {} }); // ?
  
});
/* POST form new annonce */
router.post('/form', function(req, res, next){
  db.query('INSERT INTO annonce SET ?', req.body, function(err, rs){
    res.render('select');
  })
})

//Delete a User

router.get('/delete', function (req,res, next){
  db.query('DELETE FROM annonce where idannonce = ?', req.query.id, function (err, rs){
    res.redirect('/select');
  })
});

//delete a user with postman

router.delete('/api/:IdAnnonce',(req,res)=> {
  db.query('DELETE FROM annonce WHERE IdAnnonce = ?', [req.params.IdAnnonce],(err,rows,fields)=>{
      if(!err)
      res.send('Deleted Successfully.');
      else
      console.log(err);
  })
});


//Update a user 

router.get('/edit', function (req, res, next) {
  db.query('SELECT * FROM annonce WHERE IdAnnonce = ?', req.query.id , function(err,rs) {
    res.render('form',{ annonce: rs[0]});
  })
});

router.post('/edit', function (req,res,next) {
  var param = [
    req.body,  //This is for the update
    req.query.id  // this is the condition
  ]
  db.query('UPDATE annonce SET ? WHERE IdAnnonce = ?', param, function(err, rs){
    res.redirect('/select'); 
  })
});

// Update with Api

router.put('/api/annonce/:IdAnnonce', (req, res, next)=> {
  var param = [
    req.body,
    req.query.id
  ]
  db.query('UPDATE annonce SET ? WHERE IdAnnonce = ?', [req.params.id],(err, rows, fields)=> {
    if(!err)
    res.send('Edit sucessful');
    else
    console.log(err);
  })
});

//post with API

router.post('/api/annonce', function (req, res) {
  
  let IdAnnonce = req.body.IdAnnonce;
  let IdUser = req.body.IdUser;
  let IdCategorie = req.body.IdCategorie;

console.log(IdAnnonce+" "+IdUser+" "+IdCategorie);
  if (!IdAnnonce && !IdUser && !IdCategorie) {
      return res.status(400).send({ error:true, message: 'Please provide Information to be added' });
  }

  db.query("INSERT INTO annonce(IdAnnonce, IdUser, IdCategorie) value(?,?,?) ", [IdAnnonce,IdUser,IdCategorie], function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'Record added successfully' });
  });
});



module.exports = router;

