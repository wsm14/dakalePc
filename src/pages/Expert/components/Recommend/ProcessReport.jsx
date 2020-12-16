export default (props) => {
  const { dispatch, childRef, initialValues = {}, fetchExpertCountReport } = props;

  // 下架
  const fetchStatusClose = (payload) => {
    dispatch({
      type: 'expertRecommend/fetchExpertProcessReport',
      payload: {
        ...initialValues,
        ...payload,
      },
      callback: () => {
        childRef.current.fetchGetData();
        fetchExpertCountReport();
      },
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `举报处理`,
    width: 550,
    loadingModels: 'expertRecommend',
    onFinish: fetchStatusClose,
    formItems: [
      {
        label: '处理说明',
        name: 'processResult',
        type: 'textArea',
      },
      {
        label: '内容处理',
        name: 'processStatus',
        type: 'radio',
        select: ['下架', '警告', '正常'],
      },
    ],
  };
};
