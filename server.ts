import express from "express";
const app = express();
import bodyParser  from  "body-parser";
import mysql  from "mysql";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));

// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node'
});


// connect to database
mc.connect();

// Defualt response 

app.get('/',function (req,res){

	return res.send({error:true, message: "hello"});

});


// Retrieve all family 
app.get('/family', function (req, res) {
    mc.query('SELECT * FROM family', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'family relatives.' });
    });
});

// Retrieve family with id 
app.get('/family/:id', function (req, res) {
 
    let family_ID = req.params.id;
 
    if (!family_ID) {
        return res.status(400).send({ error: true, message: 'Please provide family_id' });
    }
 
    mc.query('SELECT * FROM family where id=?', family_ID, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'family list.' });
    });
 
});


// Add a new family  
app.post('/family', function (req, res) {
 
    let family = req.body.family;
 
    if (!family) {
        return res.status(400).send({ error:true, message: 'Please provide familydetails' });
    }
 
    mc.query("INSERT INTO tasks SET ? ", { family: family }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New family member has been created successfully.' });
    });
});


//  Update family with id
app.put('/family', function (req, res) {
 
    let family_id = req.body.family_id;
    let family = req.body.family;
 
    if (!family_id || !family) {
        return res.status(400).send({ error: family, message: 'Please provide task and family_id' });
    }
 
    mc.query("UPDATE tasks SET family = ? WHERE id = ?", [family, family_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'family has been updated successfully.' });
    });
});


//  Delete family
app.delete('/family/:id', function (req, res) {
 
    let family_id = req.params.id;
 
    mc.query('DELETE FROM family WHERE id = ?', [family_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
    });
 
});
 
// All other requests redirect to 404
app.all("*", function (req, res, next) {
    return res.send('Page not found');
    next();
});
 
//Port must be set to 8080 because incoming http request are routed from 80 to 8080

app.listen(8080, function(){

	console.log('Node app is running on port 8080');

});