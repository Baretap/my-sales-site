const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // Palvelee juuressa olevat tiedostot (index.html)
app.use('/public', express.static(path.join(__dirname, 'public'))); // Palvelee public-kansion sisällön

// Lataa data JSON-tiedostosta
const loadData = async () => {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { users: [], posts: [] };
    }
};

// Tallenna data JSON-tiedostoon
const saveData = async (data) => {
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
};

// Etusivu: uusimmat ja suosituimmat
app.get('/api/posts', async (req, res) => {
    const data = await loadData();
    const latest = data.posts.slice(-4);
    const popular = data.posts.sort((a, b) => b.likes - a.likes).slice(0, 4);
    res.json({ latest, popular });
});

// Rekisteröinti
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const data = await loadData();
    if (data.users.find(u => u.username === username)) {
        return res.status(400).send('Käyttäjä olemassa');
    }
    data.users.push({ username, password });
    await saveData(data);
    res.send('Rekisteröity!');
});

// Julkaisun luonti
app.post('/api/posts', async (req, res) => {
    const { username, image, description, price, location, area } = req.body;
    const data = await loadData();
    const user = data.users.find(u => u.username === username);
    if (!user) return res.status(401).send('Kirjaudu ensin');
    const post = {
        id: Date.now(),
        username,
        image,
        description,
        price,
        location,
        area,
        likes: 0,
        date: new Date().toISOString()
    };
    data.posts.push(post);
    await saveData(data);
    res.send('Julkaistu!');
});

app.listen(3000, () => console.log('Palvelin käynnissä: http://localhost:3000'));
