const BusinessBrandSet = (props) => {
  const { dispatch, childRef, initialValues } = props;

  // 新增
  const fetchMerBrandAdd = (values) => {
    const { bankBranchName } = values;
    if (bankBranchName.indexOf('银行') == -1) {
      alert('输入错误');
      return;
    }
    dispatch({
      type: { false: 'businessBankSet/fetchMerBankAdd', true: 'businessBankSet/fetchMerBankEdit' }[
        !!initialValues
      ],
      payload: {
        bankBranchId: initialValues && initialValues.bankBranchIdString,
        ...values,
        bankName: bankBranchName.substring(0, bankBranchName.indexOf('银行')) + '银行',
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '设置支行',
    loadingModels: 'businessBankSet',
    initialValues,
    formItems: [
      {
        label: '支行名称',
        name: 'bankBranchName',
        placeholder: '银行 + 城市 + 支行名称',
      },
    ],
    onFinish: fetchMerBrandAdd,
    ...props,
  };
};

export default BusinessBrandSet;
