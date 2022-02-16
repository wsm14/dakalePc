const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    pageTitle: [],
    pageBtn: [],
  },
  effects: {},
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
    saveTitle(state, { payload }) {
      return { ...state, ...payload };
    },
    closeTitle(state, { payload }) {
      return { ...state, pageTitle: [], pageBtn: [] };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
