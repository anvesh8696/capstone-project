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

export const createUser = function (username) {
  return {
    id: uuid(),
    name: username || 'sarahconnor',
    avatar: 5
  };
};

export const findUser = function (username) {
  let persisted = persistedStore();
  let user = find(persisted.users, { name: username});
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
  let index = findIndex(persisted.users, { name: userinfo.name});
  if(index == -1){
    persisted.users.push(userinfo);
  } else {
    persisted.users[index] = userinfo;
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(persisted));
  return userinfo;
};
