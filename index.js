const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/contact');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));

var contactList = [
    { name: "Arpan", phone: "1111111111" },
    { name: "Tony Stark", phone: "1234567890" },
    { name: "Coding Ninjas", phone: "12131321321" }
];

// Route to render the practice page
app.get('/practice', function (req, res) {
    return res.render('practice', {
        title: "Let us play with ejs"
    });
});

// Route to render the home page with contacts
app.get('/', async function (req, res) {
    try {
        const contacts = await Contact.find({});
        return res.render('home', {
            title: "Contact List",
            contact_list: contacts
        });
    } catch (err) {
        console.log("Error in fetching contacts from the database:", err);
        return res.status(500).send("Internal Server Error");
    }
});

// Route to create a new contact
app.post('/create-contact', async function (req, res) {
    try {
        const newContact = await Contact.create({
            name: req.body.name,
            phone: req.body.phone
        });
        console.log('******', newContact);
        return res.redirect('back');
    } catch (err) {
        console.log('Error in creating a contact!', err);
        return res.status(500).send("Internal Server Error");
    }
});

// Route to delete a contact by id
app.get('/delete-contact/', async function (req, res) {
    let id = req.query.id;
    try {
        await Contact.findByIdAndDelete(id);
        return res.redirect('back');
    } catch (err) {
        console.log('Error in deleting the contact from the database', err);
        return res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(port, function (err) {
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup! My Server is running on Port', port);
});
