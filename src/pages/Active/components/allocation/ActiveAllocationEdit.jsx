import aliOssUpload from '@/utils/aliOssUpload';

export default (props) => {
  const { dispatch, cRef, initialValues = {} } = props;

  // 审核驳回
  const fetchMerSaleAudit = (payload) => {
    const { promotionImage = '' } = values;
    aliOssUpload(promotionImage).then((res) => {
      dispatch({
        type: 'activeAllocation/fetchMerSaleAudit',
        payload: {
          merchantVerifyId: initialValues.merchantVerifyIdString,
          verifyStatus: 2,
          ...payload,
        },
        callback: () => {
          cRef.current.fetchGetData();
        },
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '活动位置配置',
    loadingModels: 'activeAllocation',
    initialValues,
    onFinish: fetchMerSaleAudit,
    formItems: [
      {
        label: '名称',
        name: 'name',
      },
      {
        label: '备注',
        name: 'name1',
      },
      {
        label: `位置图片`,
        type: 'upload',
        name: 'promotionImage',
        maxFile: 1,
      },
      {
        label: '活动位置类型',
        name: 'type',
        extra: '和app端约定参数',
      },
    ],
  };
};
