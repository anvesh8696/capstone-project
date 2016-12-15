import { now, random, find, findIndex } from 'lodash';

const LOCAL_KEY = 'cards';

// RFC 4122 version 4 uuid
export const uuid = function () {
  let d = now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + random(16)) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

const persistedStore = function () {
  let d = localStorage.getItem(LOCAL_KEY);
  return d ? JSON.parse(d) : { users:[] };
};

export const createUser = function (username='sarahconnor', avatar=0) {
  return {
    id: uuid(),
    name: username,
    avatar: avatar
  };
};

export const setMe = function (userinfo){
  let persisted = persistedStore();
  persisted.me = userinfo;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(persisted));
  return persisted.me;
};

export const findMe = function () {
  let persisted = persistedStore();
  return persisted.me;
};

export const findUser = function (username) {
  let persisted = persistedStore();
  let user = find(persisted.users, { name: username});
  console.log('findUser', persisted, user);
  //username ? find(persisted.users, { name: username}) : persisted.users[0];
  // if(!user){
  //   user = setUser({
  //     name: username || 'sarahconnor',
  //     id: uuid(),
  //     avatar: 5
  //   });
  // }
  return user;
};

export const setUser = function (userinfo) {
  let persisted = persistedStore();
  let index = findIndex(persisted.users, { id: userinfo.id});
  if(index == -1){
    persisted.users.push(userinfo);
  } else {
    persisted.users[index] = userinfo;
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(persisted));
  return userinfo;
};

const guys = [0,2,4,6];
const girls = [1,3,5];
const guyNames = ['Plant', 'Mercury', 'Hendrix', 'Bono', 'Presley', 'Tyler', 'Jagger', 'Morrison'];
const girlNames = ['Kat', 'Hanna', 'Grace', 'Joni', 'Nicks', 'Joplin'];
  
export const createBot = function (ignore) {
  let bot = {id:uuid(), bot:true};
  if(random(0, 1) === 0){
    return {
      name: uniqueName(ignore, girlNames),
      avatar: girls[random(0, girls.length-1)],
      ...bot
    };
  }
  return {
    name: uniqueName(ignore, guyNames),
    avatar: guys[random(0, guys.length-1)],
    ...bot
  };
};

const uniqueName = function (ignore, list) {
  let name = list[random(0, list.length-1)];
  let safe = 10;
  while(findIndex(ignore, { name: name }) != -1){
    name = list[random(0, list.length-1)];
    if(safe-- <= 0){
      break;
    }
  }
  return name;
};
