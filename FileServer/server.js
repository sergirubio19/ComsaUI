const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const yaml = require('js-yaml');
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Use the default CORS configuration
app.use(express.json());

app.post('/writeToFile', (req, res) => {
    let data = req.body; // Assuming you are sending the data in the request body
    console.log(data);
    //data = JSON.parse(JSON.stringify(data))
    const yamlData = yaml.dump(data, {forceQuotes: true})     
    fs.appendFile('../Vuetify/IOTDevices/modbuses.yaml', yamlData, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error writing to file');
        } else {
            res.send('Data has been written to file');
        }
    });
});

app.post('/updateFile', (req, res) => {
    let data = req.body; // Assuming you are sending the data in the request body
    const yamlData = yaml.dump(data, {forceQuotes: true}) 
    console.log('YAML:\n' + yamlData)
    fs.writeFile('../Vuetify/IOTDevices/devices.yaml', yamlData, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error writing to file');
        } else {
            res.send('File has been updated');
        }
    });
});

app.get('/getDevices', (req, res) => {
    try {
        const data = yaml.load(fs.readFileSync('../Vuetify/IOTDevices/devices.yaml', 'utf8'));
        res.send(data);
      } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading to file');
      }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
