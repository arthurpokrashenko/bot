import request from 'request';
import settings from '../settings/base.json';

class FaceMess {
  constructor() {
    this.token = settings.facebook_page_access_token;
  }

  static sendMessage(sender, messageData) {
    console.log(messageData);
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: this.token },
      method: 'POST',
      json: {
        recipient: { id: sender },
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  }   

  sendText(sender, text) {
    console.log('sendText');
    super.sendMessage(sender, { text });
  }
 
}

let fm = new FaceMess();

export default fm;
