import { NUM_PATTERN } from '@/common/regExp';
const PromotionMoneySet = (props) => {
  const { dispatch, childRef, info, initialValues = {} } = props;

  // 提交表单
  const fetchDataEdit = (payload) => {
    dispatch({
      type: 'sysTradeList/fetchTradeSet',
      payload: { categoryId: info.categoryIdString, ...payload },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `推广费 - ${info.categoryName}`,
    loadingModels: 'sysTradeList',
    initialValues,
    formItems: [
      {
        label: '推广费比例',
        name: 'promotionFee',
        addRules: [{ pattern: NUM_PATTERN, message: '请输正整数' }],
        addonAfter: '%',
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default PromotionMoneySet;
