let exp = require('express');
// /public/index.html
let app = exp();

let port = 8080;

let fs = require('fs');

app.use(exp.json());
app.use(exp.urlencoded({extended: true}));

app.use(exp.static(__dirname + '/public')); // set the static files location

app.get('/', (req, res) =>
{

     
    res.send(fs.readFileSync('./file.json'));
});


app.post('/', (req, res) =>
{
  let data = JSON.stringify(req.body);

 fs.writeFile('file.json' , data , 'utf-8' ,
 function(err)
 {
  if(err)
  throw err;
 });

 res.send();

 });


app.listen(port , function ()
{
    console.log('Server started on http://localhost'+port+'/' );
})
