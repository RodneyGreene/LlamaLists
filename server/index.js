const express = require("express");
const cors = require('cors');
const monk = require('monk');

const app = express();

//create a connection to the lists database.
//if it doesn't exist, mongo will create it.
const db = monk("localhost/lists");

//create a collection called lists
//if it doesn't exist, mongo will create it.
const lists = db.get('lists');

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => { //When you get a request for the / endpt, do something
    response.json({
        message: "Ka-pooey!!"
    })
});

app.get('/lists', (request, response) => {
    lists
        .find()
        .then(lists => {
            response.json(lists);
        });
});

function isValidList(list) {
    return list.name && list.name.toString().trim() !== '' &&
        list.content && list.content.toString().trim() !== '';
}

// listening to /list endpoint
app.post("/list", (request, response) => {
    //validate before inserting into database
    if (isValidList(request.body)) {
        //create a new list object
        const list = {
            name: request.body.name.toString(),
            content: request.body.content.toString(),
            created: new Date()
        }

        //insert the new object into our collection
        lists
            .insertOne(list) //MongoDB single insert
            .then(createdList => {
                //respond with what was just inserted
                response.json(createdList);
            });

        console.log(list);

    } else {
        response.status(422);
        response.json({
            message: "Name and content are required."
        });
    }
});

app.listen(5000, () => {
    console.log("Listening on http://localhost:5000");
});