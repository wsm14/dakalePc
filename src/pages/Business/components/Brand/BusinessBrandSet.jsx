import aliOssUpload from '@/utils/aliOssUpload';

const BusinessBrandSet = (props) => {
  const { dispatch, childRef } = props;

  // 新增活动
  const fetchMarketActivityAdd = (values) => {
    const {
      activityBanner: { fileList },
    } = values;

    aliOssUpload(fileList.map((item) => item.originFileObj)).then((res) => {
      dispatch({
        type: 'businessBrand/fetchMarketActivityAdd',
        payload: { ...payload, activityBanner: res.toString() },
        callback: () => childRef.current.fetchGetData(),
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '新增品牌',
    loadingModels: 'businessBrand',
    formItems: [
      {
        label: '品牌logo',
        type: 'upload',
        name: 'activityBanner',
        maxFile: 1,
      },
      {
        label: '品牌名',
        name: 'activityBeginTime',
      },
      {
        label: '品牌类型',
        type: 'select',
        name: 'categoryCustomId',
        select: [],
      },
    ],
    onFinish: fetchMarketActivityAdd,
    ...props,
  };
};

export default BusinessBrandSet;
