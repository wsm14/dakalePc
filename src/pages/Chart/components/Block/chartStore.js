import React from 'react';
import moment from 'moment';

export const ChartContext = React.createContext();

export const initialState = {
  beginDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  endDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
};

export const reducer = (state, action) => {
  return {
    ...state,
    ...action,
  };
};
