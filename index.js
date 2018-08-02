const express = require('express');
      const bodyParser = require('body-parser');
      const cors = require('cors');
      const Pusher = require('pusher');
      const Sentiment = require('sentiment');
      require('dotenv').config();

      const app = express();

      app.use(cors());
      app.use(bodyParser.urlencoded({extended: false}));
      app.use(bodyParser.json());

    // Ensure that your pusher credential are properly set in the .env file  
      const pusher = new Pusher({
          appId: "570776",
          key: "36197b25768cdb28c23f",
          secret: "0f648db77f225752b8a2",
          cluster: "ap2",
          encrypted: true
      });

      app.set('port', process.env.PORT || 3000);

      app.post('/messages', (req, res) => {
          const sentiment = new Sentiment();
          const sentimentScore = sentiment.analyze(req.body.text).score;
          const payload = {
              text: req.body.text,
              username: req.body.username,
              time: req.body.time,
              sentiment: sentimentScore
          }
          pusher.trigger('chat', 'message', payload);
          res.send(payload)
      })
      app.listen(app.get('port'), () => {
          console.log("Listening on port " + app.get('port'));
      })