export default (props) => {
  const { dispatch, cRef, initialValues = {}, onClose } = props;

  // 审核驳回
  const fetchMerSaleAudit = (payload) => {
    dispatch({
      type: 'businessAudit/fetchMerSaleAudit',
      payload: {
        merchantVerifyId: initialValues.merchantVerifyIdString,
        verifyStatus: 2,
        ...payload,
      },
      callback: () => {
        cRef.current.fetchGetData();
        onClose();
      },
    });
  };

  return {
    type: 'Modal',
    showType: 'form',
    title: '审核驳回',
    width: 520,
    loadingModels: 'businessAudit',
    onFinish: fetchMerSaleAudit,
    formItems: [
      {
        label: '驳回原因',
        name: 'reject_reason',
        type: 'textArea',
      },
    ],
  };
};
