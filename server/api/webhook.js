import resource from 'resource-router-middleware';
import config from '../settings/base.json';
import FaceMess from '../lib/fb';


export default resource({

  /** Property name to store preloaded entity on `request`. */
  id : 'webhook',
  /** GET / - List all entities */
  index({ query }, res) {
    if (query['hub.verify_token'] === config.facebook_webhook_token) {
      res.send(query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
  },

  /** POST / - Create a new entity */
  create({ body }, res) {
    let messaging_events = body.entry[0].messaging;
    console.log('create', body);
    for (let i = 0; i < messaging_events.length; i++) {
      let event = body.entry[0].messaging[i];
      let sender = event.sender.id;
      if (event.message && event.message.text) {
        let text = event.message.text.toLowerCase();

        FaceMess.sendButtons(sender, 'Какая у вас квартира?', [
          {
            "type": "postback",
            "payload": '1',
            "title": "Однокомнатная"
          },
          {
            "type": "postback",
            "payload": '2',
            "title": "Двухкомнатная"
          },
          {
            "type": "postback",
            "payload": '3',
            "title": "Трехкомнатная"
          }
        ])
        .then(function (data) {
          console.log('buttons', data);
        });
      }
      if (event.postback) {
        let postback = event.postback;
        console.log('postback', postback);
      }
    }
    res.sendStatus(200);
  }

  // /** PUT /:id - Update a given entity */
  // update({ facet, body }, res) {
  // 	for (let key in body) {
  // 		if (key!=='id') {
  // 			facet[key] = body[key];
  // 		}
  // 	}
  // 	res.sendStatus(204);
  // },

  // /** DELETE /:id - Delete a given entity */
  // delete({ facet }, res) {
  // 	facets.splice(facets.indexOf(facet), 1);
  // 	res.sendStatus(204);
  // }
});
