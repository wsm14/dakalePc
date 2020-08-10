const MarketCardActivitySetStore = (props) => {
  const { dispatch, childRef } = props;

  const fetchRuningSet = (values) => {
    dispatch({
      type: 'marketCardActivity/fetchMarketMatchRuningSet',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '新增商家',
    loadingModels: 'marketCardActivity',
    formItems: [
      {
        label: '商家名称',
        name: 'walkSignBeanAmount',
      },
      {
        label: '活动商品',
        name: 'walkSignBea1nAmount',
      },
      {
        label: '商品分类',
        type: 'select',
        name: 'walkSignBea1nAmount',
        select: [],
      },
      {
        label: '活动图',
        type: 'upload',
        maxFile: 1,
        name: 'walkSignBea2nAmou2nt',
      },
      {
        label: '商品图',
        type: 'upload',
        maxFile: 1,
        name: 'walkSignBea2nAmsou2nt',
      },
      {
        label: '活动数量',
        type: 'number',
        name: 'walkStepCount',
      },
      {
        label: '活动价',
        type: 'number',
        name: 'walkStepCsount',
      },
      {
        label: '原价',
        type: 'number',
        name: 'walkStepCousnt',
      },
      {
        type: 'textArea',
        label: '购买须知',
        name: 'walkStepCounst',
      },
    ],
    onFinish: fetchRuningSet,
    ...props,
  };
};

export default MarketCardActivitySetStore;
