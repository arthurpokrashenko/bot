import { Router } from 'express';
import facets from './facets';
import webhook from './webhook';
import cianAPI from '../lib/cian.js';
import FaceBot from '../lib/facebot.js';
import config from '../settings/base.json';

export default function() {
  let api = Router();
  let bot = new FaceBot({
    token: config.facebook_page_access_token,
    verify: config.facebook_webhook_token
  })

  // https://github.com/remixz/messenger-bot
  bot.on('message', (payload, reply) => {
    let text = payload.message.text
    console.log('text', text);
    console.log('text', { text });
    
    reply('text', text, (err) => {
      if (err) throw err
    })
  });

	// mount the facets resource
	api.use('/facets', facets);
  // api.use('/webhook', webhook);
  api.use('/webhook', bot.middleware());

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			version : '1.0'
		});
  });

  /* Tests */
  // cianAPI
  //   .validateAddressToHouse('Москва, ул. 2-я Кабельная, 6')
  //   .then(cianAPI.getHouseId)
  //   .then(function(houseId) {
  //     return cianAPI.estimate(2, 55, houseId);
  //   })
  //   .then(function(data) {
  //     console.log('estimation', data);
  //   })

	return api;
}
