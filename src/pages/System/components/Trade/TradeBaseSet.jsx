const TradeCategorySet = (props) => {
  const { dispatch, childRef, initialValues = {}, detailList, categoryId, CeditType } = props;

  const listData = detailList.list.map((item) => item.name);

  const propItem = {
    base: {
      title: `基础设施`,
      name: 'infrastructures',
      url: 'sysTradeList/fetchTradeBaseSet',
    },
    special: {
      title: `特色服务`,
      name: 'specialService',
      url: 'sysTradeList/fetchTradeSpecialSet',
    },
  }[CeditType];

  // 提交表单
  const fetchDataEdit = (values) => {
    const payload = !Object.keys(initialValues).length
      ? [...listData, values.name]
      : listData.map((item) => {
          if (item === initialValues.name) {
            return values.name;
          }
          return item;
        });
    dispatch({
      type: propItem.url,
      payload: {
        [propItem.name]: payload,
        categoryId,
        configMerchantSettleId: initialValues.configMerchantSettleIdString,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `设置 - ${propItem.title}`,
    loadingModels: 'sysTradeList',
    initialValues,
    formItems: [
      {
        label: `${propItem.title}名称`,
        name: 'name',
        maxLength: 10,
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default TradeCategorySet;
