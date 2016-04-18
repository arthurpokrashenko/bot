Demo project, which illustrates FaceBot capabilities.

# Example
```javascript
import { Router } from 'express';
import http from 'http';
import express from 'express';
import FaceBot from '../lib/facebot.js';

let app = express();
let api = Router();

let bot = new FaceBot({
    token: '%FACEBOOK_PAGE_ACCESS_TOKEN%',
    verify: '%FACEBOOK_WEBHOOK_TOKEN%'
});

bot.on('message', (payload, reply) => {
    let text = payload.message.text
    
    reply('text', text, (err) => {
      if (err) throw err
    })
});

app.server = http.createServer(app);
app.use('/webhook', bot.middleware());
app.server.listen(8080);
```


