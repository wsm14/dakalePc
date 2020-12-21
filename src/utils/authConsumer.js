import React, { Context, createContext, useContext } from 'react';
import { history } from 'umi';

export default function validate(list = [], name) {
  return list.indexOf(name) > -1;
}

function separate(list, operations) {
  list.forEach((l) => {
    l.authKey && operations.push(l.authKey);
    if (l.children) {
      separate(l.children, operations);
    }
  });
}

export default function flatten(list) {
  let operations = [];
  list.forEach((l) => {
    let { resources } = l;
    separate(resources, operations);
  });
  return { operations };
}

const AuthContext = createContext({
  allAuth: [],
});

export const AuthConsumer = (props) => {
  const context = useContext(AuthContext);
  const { allAuth } = context;
  const all = flattenAuth([{ resources: allAuth }]).operations;
  const hasAuthResult = hasAuth(all, props.name);
  return hasAuthResult ? props.children : null;
};

export const AuthProvider = AuthContext.Provider;
