'use strict'
import resource from 'resource-router-middleware';
import { EventEmitter } from 'events';
import request from 'request';

class Bot extends EventEmitter {
  constructor(opts) {
    super()

    opts = opts || {}
    if (!opts.token) {
      throw new Error('Missing page token. See FB documentation for details: https://developers.facebook.com/docs/messenger-platform/quickstart')
    }
    this.token = opts.token
    this.verify_token = opts.verify || false
  }

  getProfile(id, cb) {
    if (!cb) cb = Function.prototype

    request({
      method: 'GET',
      uri: `https://graph.facebook.com/v2.6/${id}`,
      qs: {
        fields: 'first_name,last_name,profile_pic',
        access_token: this.token
      },
      json: true
    }, (err, res, body) => {
      if (err) return cb(err)
      if (body.error) return cb(body.error)

      cb(null, body)
    })
  }

  sendRichMessage(recipient, type, payload, cb) {
    payload = { text: payload };
    
    switch (type) {
      case 'buttons':
        payload = this.prepareButtons(payload);
        break;
    }
    this.sendMessage(recipient, payload, cb);
  }

  /**
   * data = {
   *  text: 'What do you want to do next?',
   *  buttons: [
   *    {
   *       type: 'web_url',
   *       title: 'Show Website'
   *       url: 'https://petersapparel.parseapp.com',
   *
   *    },
   *    {
   *       type: 'postback',
   *       title: 'Show Website'
   *       url: 'https://petersapparel.parseapp.com',
   *
   *    }
   *  ]
   * }
   */

  prepareButtons(data) {
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: data.text,
          buttons: data.buttons
        }
      }
    }
  }

  prepareImage(data) {
    return {
      attachment: {
        type: 'image',
        payload: {
          url: data.url
        }
      }
    }
  }

  sendMessage(recipient, payload, cb) {
    if (!cb) cb = Function.prototype

    request({
      method: 'POST',
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: this.token
      },
      json: {
        recipient: { id: recipient },
        message: payload
      }
    }, (err, res, body) => {
      if (err) return cb(err)
      if (body.error) return cb(body.error)

      cb(null, body)
    })
  }

  middleware() {
    let self = this;
    
    return resource({
      id: 'webhook',

      index({ query }, res) {
        if (query['hub.verify_token'] === self.verify_token) {
          res.send(query['hub.challenge']);
        }
        res.send('Error, wrong validation token');
      },
      
      create({ body }, res) {
        let messaging_events = body.entry[0].messaging;
        for (let i = 0; i < messaging_events.length; i++) {
          let event = body.entry[0].messaging[i];
          let sender = event.sender.id;

          if (event.message) {
            self._handleEvent('message', event)
          }

          if (event.postback) {
            self._handleEvent('postback', event)
          }

          if (event.delivery) {
            self._handleEvent('delivery', event)
          }
        }
        res.sendStatus(200);
      }
    });
  }
  
  _handleEvent(type, event) {
    this.emit(type, event, this.sendRichMessage.bind(this, event.sender.id))
  }
}

export default Bot;