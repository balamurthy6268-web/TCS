const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Users</h1>
        <div id="users"></div>

        <script>
          fetch('/api/users')
            .then(r => r.json())
            .then(data => {
              document.getElementById('users').innerHTML =
                data.users.map(u => '<p>' + u.name + '</p>').join('');
            });
        </script>
      </body>
    </html>
  `);
});

app.get('/api/users', (req, res) => {
  res.json({
    users: [{ name: 'Real User' }]
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});