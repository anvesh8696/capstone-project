import PubNub from 'pubnub';

export default class MsgUtil {
  constructor(){
    this.pubnub = null;
    this.room = null;
  }
  
  login = (uuid) => {
    this.pubnub = new PubNub({
      publishKey: 'pub-c-a496a10f-ddd7-48b0-802c-4440c059237c',
      subscribeKey: 'sub-c-737849b0-ba72-11e6-8036-0619f8945a4f',
      ssl: (location.protocol.toLowerCase() === 'https:'),
      uuid: uuid
    });
    this.room = null;
    this.pubnub.addListener({
      message: this.onMessage,
      presence: this.onPresence
    });
  }
  
  join = (room, state = {}, presence = true) => {
    if(null == this.room){
      this.room = room;
      this.pubnub.subscribe({
        channels: [room],
        withPresence: presence,
        state: state
      });
    }
  }
  
  leave = () => {
    this.pubnub.unsubscribe({ channel: this.room });
    this.room = null;
  }
  
  send = (message, callback) => {
    this.pubnub.publish(
      {
        message: message, 
        channel: this.room,
        sendByPost: false, // send via POST 
        storeInHistory: false, // override default storage options
        //meta: {'so': 'meta'}, // publish extra meta data
      },
      callback
    );
  }
  
  users = (callback) => {
    this.pubnub.hereNow(
      {
        channels: [this.room], 
        // channelGroups : ["cg1"],
        includeUUIDs: true,
        includeState: true
      },
      callback
    );
  }
  
  onMessage = (message) => {
    console.log('onMessage', message);
  }
  
  onPresence = (message) => {
    console.log('onPresence', message);
  }
}
