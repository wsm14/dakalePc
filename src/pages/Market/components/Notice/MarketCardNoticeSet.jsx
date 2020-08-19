import aliOssUpload from '@/utils/aliOssUpload';

const MarketCardNoticeSet = (props) => {
  const { dispatch, childRef } = props;

  // 公告新增
  const fetchMarketNoticeAdd = (values) => {
    const {
      activityBanner: { fileList },
    } = values;

    aliOssUpload(fileList.map((item) => item.originFileObj)).then((res) => {
      dispatch({
        type: 'marketCardNotice/fetchMarketNoticeAdd',
        payload: { ...payload, activityBanner: res.toString() },
        callback: () => childRef.current.fetchGetData(),
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '公告新增',
    loadingModels: 'marketCardNotice',
    formItems: [
      {
        label: '上传公告图',
        type: 'upload',
        name: 'activityBanner',
        maxFile: 1,
      },
      {
        label: '公告说明',
        name: 'activityBeginTime',
        type: 'textArea',
        maxLength: 20,
      },
    ],
    onFinish: fetchMarketNoticeAdd,
    ...props,
  };
};

export default MarketCardNoticeSet;
