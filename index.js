const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');
const app = express();

app.use(cors({ optionSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

let urlDatabase = [];
let urlCounter = 1;

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl", function(req, res, next) {
  const originalUrl = req.body.url;

  try {
    const parsedUrl = new URL(originalUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }

    dns.lookup(parsedUrl.hostname, (err, address) => {
      if (err || !address) {
        return res.json({ error: 'invalid url'});
      }

      const shortUrl = urlCounter++;
      urlDatabase.push({
        original_url: originalUrl,
        short_url: shortUrl
      });
      console.log(urlDatabase);

      res.json({
        original_url: originalUrl,
        short_url: shortUrl
      });
    });
  } catch (error) {
    res.json({ error: 'invalid url'});
  }
});

app.get("/api/shorturl/:short_url", function(req, res) {
  const shortUrl = parseInt(req.params.short_url);

  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
