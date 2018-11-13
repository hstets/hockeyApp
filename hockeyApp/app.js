var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

// DB connection string
//var connectdb = "postgres://stets:simba@localhost/pphockeydb";

const config = {
    user: 'stets',
    database: 'pphockeydb',
    password: 'simba',
    port: 5432
};

// pool takes the object above -config- as parameter
const pool = new pg.Pool(config);

// Assign dust engine to .dust files
app.engine('dust', cons.dust);

// set default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res, next) => {

    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }

        client.query('SELECT * from "ppPlayers"', function(err,result) {
          if(err) {
            return console.error('error running query',err);
          }
          res.render('index', {ppPlayers: result.rows});
          done();
        })
    })
});

// Server
app.listen(3000,function(){
  console.log('Server is started on port 3000!');
});
