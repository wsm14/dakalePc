const DrawerForm = {
  namespace: 'drawerForm',

  state: {
    type: 'Drawer', // Modal
    showType: 'form', // info
    title: '标题',
    formItems: [],
    initialValues: {},
    visible: false,
    okText: '确认',
    cancelText: '取消',
    maskClosable: true,
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
        visible: true,
      };
    },
    close(state, { payload }) {
      return {
        ...payload,
        type: state.type,
        showType: state.showType,
        title: state.title,
        formItems: state.formItems,
        initialValues: {},
        maskClosable: true,
        visible: false,
      };
    },
  },

  effects: {
    *fetchClose({ payload, callback }, { call, put }) {
      yield put({
        type: 'close',
      });
      if (callback) callback();
    },
  },
};
export default DrawerForm;
