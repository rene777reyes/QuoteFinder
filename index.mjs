import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "q68u8b2buodpme2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xl4jx4dujap92wk3",
    password: "p9wkm8o141l7i9z0",
    database: "q7umu6ct1r9qcxua",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
   let sql = `SELECT authorId, firstName, lastName
              FROM q_authors
              ORDER BY lastName`;
   const [rows] = await pool.query(sql);  
   //console.log(rows);
   let sql2 = `SELECT DISTINCT category
                FROM q_quotes
                ORDER BY category`;
    const [rows2] = await pool.query(sql2);        
   res.render('home.ejs', {"authors": rows, "categories": rows2});
});

app.get('/searchByAuthor', async (req, res) => {
   let authorId = req.query.authorId;
   let sql=`SELECT authorId, firstName, lastName, quote
              FROM q_quotes
              NATURAL JOIN q_authors
              WHERE authorId = ?`;
   let sqlParams = [authorId];
    const [rows] = await pool.query(sql, sqlParams);
   res.render('results.ejs',{"quotes":rows});
});

app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;
    let sql=`SELECT authorId, firstName, lastName, quote
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE category = ?`;
    let sqlParams = [category];
     const [rows] = await pool.query(sql, sqlParams);
    res.render('results.ejs',{"quotes":rows});
 });

app.get('/searchByKeyword', async(req, res) => {
   let keyword = req.query.keyword;
   let sql = `SELECT authorId, firstName, lastName, quote
              FROM q_quotes
              NATURAL JOIN q_authors
              WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    //console.log(rows);
    res.render('results.ejs', {"quotes": rows});
});

app.get('/searchByLikes', async(req, res) => {
    let min = req.query.min;
    let max = req.query.max;
    //console.log(min);
    //console.log(max);
    let sql = `SELECT authorId, firstName, lastName, quote
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE likes
               BETWEEN ? AND ?`;
     let sqlParams = [min, max];
     const [rows] = await pool.query(sql, sqlParams);
     //console.log(rows);
     res.render('results.ejs', {"quotes": rows});
 });


//local API to get all info for a specific author
app.get('/api/author/:id', async(req, res) => {
   let authorId = req.params.id;
   let sql = `SELECT *
              FROM q_authors
              WHERE authorId = ?`;
  const [rows] = await pool.query(sql, [authorId]);          
  res.send(rows);
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})