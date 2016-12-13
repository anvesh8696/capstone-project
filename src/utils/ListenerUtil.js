import { each, filter } from 'lodash';

export default class ListenerUtil {
  
  constructor(){
    this.listeners = {};
  }
  
  on = (event, callback) => {
    let list = this.listeners[event] || [];
    if(list.indexOf(callback) == -1){
      list.push(callback);
    }
    this.listeners[event] = list;
  }
  
  off = (event, callback) => {
    let list = this.listeners[event];
    if(list){
      list = filter(list, (f) => {return f === callback});
    }
    this.listeners[event] = list;
  }
  
  offEvent = (event) => {
    delete this.listeners[event];
  }
  
  offAll = (event) => {
    this.listeners = {};
  }
  
  callEvent = (event, data) => {
    let list = this.listeners[event];
    each(list, function (f){
      f(data);
    });
  }
  
}
