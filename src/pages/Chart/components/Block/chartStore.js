import React from 'react';
import moment from 'moment';

export const ChartContext = React.createContext();

export const initialState = {
  beginDate: moment().format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
};

export const reducer = (state, action) => {
  return {
    ...state,
    ...action,
  };
};
