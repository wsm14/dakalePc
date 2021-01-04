export default (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 下架
  const fetchStatusClose = (payload) => {
    dispatch({
      type: 'goodsManage/fetchUpdataStock',
      payload: {
        goodsIdString: initialValues.goodsIdString,
        ...payload,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Modal',
    showType: 'form',
    title: `库存 - ${initialValues.goodsName}`,
    width: 550,
    initialValues,
    loadingModels: 'goodsManage',
    onFinish: fetchStatusClose,
    formItems: [
      {
        label: '可用库存',
        name: 'stock',
        type: 'number',
        max: 100000,
        min: 0,
        precision: 0,
      },
    ],
  };
};
