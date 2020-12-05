export default (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 下架
  const fetchStatusClose = (payload) => {
    dispatch({
      type: 'goodsManage/fetchGoodsUpdataStatus',
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
    title: `下架原因 - ${initialValues.goodsName}`,
    width: 550,
    loadingModels: 'goodsManage',
    onFinish: fetchStatusClose,
    formItems: [
      {
        label: '下架原因',
        name: 'removalReason',
        type: 'textArea',
        placeholder: '请输入下架原因，以方便商家调整商品信息',
      },
    ],
  };
};
