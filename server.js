const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let path = require('path');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/rider', express.static('public'));

const credentials = {
    loginUsername: process.env.login_username,
    loginPassword: process.env.login_password
};

let token = "";
for(let i=0; i<20; i++){
    token += String.fromCharCode(Math.floor(Math.random() * 26)+65); 
}

function calcPriority(bond){
    let priority;
    if(bond===0) priority=0;
    else if (bond>=2575 && bond<=2594) priority=2575; 
    else if (bond>=2563 && bond<=2575) priority=2563; 
    else if (bond>=2541 && bond<=2563) priority=2541;
    else if (bond>=2500 && bond<=2541) priority=2500;
    else if (bond>=2490 && bond<=2500) priority=2490;
    else if (bond>=2472 && bond<=2490) priority=2472;
    else priority=bond;
    return priority;
}

function checkAuth(auth){
    if(auth===token && token!==""){
        return true;
    } else {
        return false;
    }
}

let requests = [];
let currentRiders = [];
let count = 0;

app.post('/reset', (req,res) =>{
    let auth = req.headers.authorization;
    if (auth==="master-reset")
    token = "";
    for(let i=0; i<20; i++){
        token += String.fromCharCode(Math.floor(Math.random() * 26)+65); 
    }
    count=0;
    requests = [];
    currentRiders = [];
    res.status(200).send();
})

app.get('/', (req, res) => {
    res.sendFile('/public.index.html', {root: path.join(__dirname)});    
})
app.get('/login', (req, res) => {
    res.sendFile('/public/login.html', {root: path.join(__dirname)});    
})
app.get('/pickups', (req, res) => {
    res.sendFile('/public/pickups.html', {root: path.join(__dirname)});    
})

app.get('/requests', (req,res) =>{
    let auth = req.headers.authorization;
    if (!checkAuth(auth)){
        res.status(401).send({message: 'unathorized'});
        return;
    }
    res.status(200).send(requests);
});

app.post('/new-request', (req,res) =>{
    let name = req.body.name;
    let location = req.body.location;
    let passengers = req.body.passengers;
    let phone = req.body.phone;
    let priority = parseInt(name.replace(/'/g, ""));
    if(isNaN(priority)){
        priority=5000;
    } else {
        priority = calcPriority(priority);
    }
    let newRequest = {
        id : count,
        name : name,
        priority : priority,
        location : location,
        passengers : passengers,
        phone : phone
    }
    count++;
    let index;
    if(priority!==5000){
        let i;
        for(i=0; i<requests.length; i++){
            if(requests[i].priority>priority){
                break;    
            }
        }
        requests.splice(i, 0, newRequest);
        index = i + 1;
    } else {
        requests.push(newRequest);
        index = requests.length;
    }
    if(requests.length==1){
        //PUSH NOTIFICATION HERE
    }
    res.status(200).send({message : index});
});

app.get('/rider/:id', (req, res)=>{
    res.sendFile('/public/rider.html', {root: path.join(__dirname)});
});

app.get('/pickup/:id', (req, res) =>{
    let auth = req.headers.authorization;
    if (!checkAuth(auth)){
        res.status(401).send({message: 'unathorized'});
        return;
    }
    let index = requests.findIndex(obj => obj.id == req.params.id);
    currentRiders.push(requests[index]);
    requests.splice(index, 1);
    res.status(200).send(currentRiders.find(obj => obj.id == req.params.id));
});

app.post('/login', (req, res) => {
    let username= req.body.username + "";
    if(username.length<=1 || username.length>=16){
        res.status(401).send({message: 'unauthorized'}); 
        return;
    }
    let password= req.body.password + "";
    if(password.length<=1 || password.length>=20){
        res.status(401).send({message: 'unauthorized'});
        return; 
    }
    if(username === credentials.loginUsername && password === credentials.loginPassword) {
        res.setHeader('Set-Authorization', token);
        res.status(200).send({message:'Authentication successful '});
    } else {
        res.status(401).send({message: 'unauthorized'}); 
    }
});

app.post('/dropoff/:id', (req, res) =>{
    let auth = req.headers.authorization;
    if (!checkAuth(auth)){
        res.status(401).send({message: 'unathorized'});
        return;
    }
    currentRiders.splice(currentRiders.findIndex(obj => obj.id == req.params.id),1);
    res.status(200).send();
});

const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`I'm listening on ${port}`);
});