import { fetchimportExcel } from '@/services/ChartServices';
import { notification } from 'antd';
export default {
  namespace: 'dataExportExcel',
  state: {},
  reducers: {},
  effects: {
    *fetchimportExcel({ payload, callback }, { call, put }) {
      const response = yield call(fetchimportExcel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '导出成功',
      });
      callback && callback();
    },
  },
};
