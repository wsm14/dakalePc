import aliOssUpload from '@/utils/aliOssUpload';

const MarketCardNoticeSet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;
  const { configAnnounceIdString: configAnnounceId } = initialValues;
  // 公告新增
  const fetchMarketNoticeAdd = (values) => {
    const { image } = values;

    const defineSet = {
      type: {
        true: 'marketCardNotice/fetchMarketNoticeAdd',
        false: 'marketCardNotice/fetchNoticeEdit',
      }[!Object.keys(initialValues).length],
      callback: () => childRef.current.fetchGetData(),
    };

    aliOssUpload(image).then((res) => {
      dispatch({
        ...defineSet,
        payload: { configAnnounceId, ...values, image: res.toString() },
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `公告${!Object.keys(initialValues).length ? '新增' : '修改'}`,
    loadingModels: 'marketCardNotice',
    formItems: [
      {
        label: '上传公告图',
        type: 'upload',
        name: 'image',
        maxFile: 1,
      },
      {
        label: '公告说明',
        name: 'description',
        type: 'textArea',
        maxLength: 20,
      },
    ],
    onFinish: fetchMarketNoticeAdd,
    ...props,
  };
};

export default MarketCardNoticeSet;
