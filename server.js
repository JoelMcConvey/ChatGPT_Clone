const express = require('express');
const cors = require('cors');
const path = require('path')
const fetch = require('node-fetch');
const app = express();
const buildPath = path.join(__dirname, 'build');
const port = process.env.PORT || 3001;
require('dotenv').config();


app.use(express.static(buildPath))
app.use(express.json())
app.use(cors());

const API_KEY = process.env.REACT_APP_API_KEY;

app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message }],
            max_tokens: 200, 
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    } catch(error) {
        console.error(error);
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
  })

app.listen(port, () => console.log('Your server is running on PORT ' + port))