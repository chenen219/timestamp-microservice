const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ optionSuccessStatus: 200 }));

app.use(express.static('public'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/", function (req, res) {
  const now = new Date();
  res.json({
    unix: now.getTime(),
    utc: now.toUTCString(),
  });
});

app.get("/api/:date", function (req, res) {
  const dateString = req.params.date;
  let date;

  if (!isNaN(dateString)) {
    date = new Date(parseInt(dateString));
  } else {
    date = new Date(dateString);
  }

  if (date.toUTCString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
    return;
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});
// app.get("/api/:date?", function( req, res ) {
//   const dateString = req.params.date;
//   let date;

//   if (!dateString) {
//     date = new Date();
//   } else {

//     if (!isNaN(dateString)) {
//       date = new Date(parseInt(dateString));
//     } else {
//       date = new Date(dateString);
//     }
//   }

//   if (date.toUTCString() === "Invalid date") {
//     res.json({ error: "Invalid Date" });
//     return;
//   }

//   res.json({
//     unix: date.getTime(),
//     utc: date.toUTCString()
//   });
// });

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
