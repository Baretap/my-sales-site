fetch('/api/posts')
    .then(res => res.json())
    .then(data => {
        const latest = document.getElementById('latest-posts');
        const popular = document.getElementById('popular-posts');
        data.latest.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `<p>${post.description}</p><p>${post.price}g</p><p>${post.location}/${post.area}</p>`;
            latest.appendChild(div);
        });
        data.popular.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `<p>${post.description}</p><p>${post.price}g</p><p>${post.location}/${post.area}</p>`;
            popular.appendChild(div);
        });
    });

function showRegister() {
    const username = prompt('Käyttäjänimi:');
    const password = prompt('Salasana:');
    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }).then(res => res.text()).then(alert);
}
