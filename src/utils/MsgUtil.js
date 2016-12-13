import PubNub from 'pubnub';
import ListenerUtil from './ListenerUtil';

export default class MsgUtil extends ListenerUtil {
  constructor(){
    super();
    
    this.pubnub = null;
    this.room = null;
    this.loggedIn = false;
    this.online = navigator.onLine;
    window.addEventListener('online',  ()=>this.onlineStatusChange(true));
    window.addEventListener('offline', ()=>this.onlineStatusChange(false));
  }
  
  onlineStatusChange = (status) => {
    this.online = status;
    this.callEvent('online', status);
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
      status: this.onStatus,
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
    
    return new Promise((resolve, reject) => {
      let maxWait = 2000;
      // check when logged in and fail if it takes to long
      let joinTimer = setInterval(()=>{
        maxWait -= 250;
        if(this.loggedIn){
          clearInterval(joinTimer);
          resolve();
        } else if(maxWait <= joinTimer){
          clearInterval(joinTimer);
          reject();
        }
      }, 250);
    });
  }
  
  leave = () => {
    this.pubnub.unsubscribe({ channel: this.room });
    this.room = null;
  }
  
  send = (message) => {
    this.pubnub.publish(
      {
        message: message, 
        channel: this.room,
        sendByPost: false, // send via POST 
        storeInHistory: false, // override default storage options
        //meta: {'so': 'meta'}, // publish extra meta data
      },
      this.onSend
    );
  }
  
  users = (callback) => {
    return new Promise((resolve, reject) => {
      // let maxWait = 2000;
      // // check when logged in and fail if it takes to long
      // let joinTimer = setInterval(()=>{
      //   maxWait -= 250;
      //   if(this.loggedIn){
      //     clearInterval(joinTimer);
      //     resolve();
      //   } else if(maxWait <= joinTimer){
      //     clearInterval(joinTimer);
      //     reject();
      //   }
      // }, 250);
      this.pubnub.hereNow(
        {
          channels: [this.room], 
          // channelGroups : ["cg1"],
          includeUUIDs: true,
          includeState: true
        },
        (message) => resolve(message)
      );
    });
  }
  
  onSend = (message) => {
    console.log('onSend', message);
    this.callEvent('onSend', message);
  }
  
  onStatus = (message) => {
    console.log('onStatus', message);
    const { category, operation } = message;
    this.callEvent('onStatus', message);
    
    // connected to the room
    if(category === 'PNConnectedCategory' && operation === 'PNSubscribeOperation'){
      this.loggedIn = true;
      this.callEvent('onLoggedIn', true);
    }
  }
  
  onMessage = (message) => {
    console.log('onMessage', message);
    this.callEvent('onMessage', message);
  }
  
  onPresence = (message) => {
    console.log('onPresence', message);
    //message.action Can be join, leave, state-change or timeout.
    this.callEvent('onPresence', message);
  }
}
