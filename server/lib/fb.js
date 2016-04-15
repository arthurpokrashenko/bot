import request from 'request';
import Promise from 'promise';
import settings from '../settings/base.json';
// https://developers.facebook.com/docs/messenger-platform/send-api-reference#guidelines
class FaceMess {
  constructor() {
    this.token = settings.facebook_page_access_token;
  }

  sendMessage(sender, messageData) {
    return new Promise((resolve, reject) => {
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: this.token },
        method: 'POST',
        json: {
          recipient: { id: sender },
          message: messageData,
        }
      }, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        return resolve(body);
      });
    });
  }

  sendReceipt(sender, data) {
    return this.sendMessage(sender, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'receipt',
          ...data
        }
      }
    })
  }

  sendGeneric(sender, elements) {
    return this.sendMessage(sender, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements
        }
      }
    })
  }

  sendButtons(sender, text, buttons) {
    return this.sendMessage(sender, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons
        }
      }
    })
  }

  sendText(sender, text) {
    return this.sendMessage(sender, { text });
  }

  sendImage(sender, url) {
    return this.sendMessage(sender, {
      attachment: {
        type: 'image',
        payload: { url }
      }
    })
  }
}

let fm = new FaceMess();

export default fm;
