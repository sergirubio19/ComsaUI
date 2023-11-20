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
    fs.appendFile('data/modbuses.yaml', yamlData, (err) => {
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
    console.log(data)
    const yamlData = yaml.dump(data, {forceQuotes: true}) 
    console.log(yamlData)
    fs.writeFileSync('data/modbuses.yaml', '---\nmodbuses:\n', (err) => {
        if (err) {
            console.error(err);
        }
    });
    console.log(data[0])
    if (data[0]) {
        fs.appendFileSync('data/modbuses.yaml', yamlData, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
            } else {
                res.send('File has been updated');
            }
        });
    }
});

app.get('/getDevices', (req, res) => {
    try {
        const data = yaml.load(fs.readFileSync('data/modbuses.yaml', 'utf8'));
        res.send(data);
      } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading to file');
      }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
