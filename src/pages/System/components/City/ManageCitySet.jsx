import CITYJSON from '@/common/city';
import aliOssUpload from '@/utils/aliOssUpload';

const ManageCitySet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;
  const cityList = CITYJSON.filter((item) => item.value === initialValues.provinceCode)[0].children;
  // 新增
  const fetchCityManageSet = (values) => {
    const { backgroundImg, cityCode } = values;

    aliOssUpload(backgroundImg).then((res) => {
      dispatch({
        type: 'manageCity/fetchCityManageSet',
        payload: {
          ...initialValues,
          ...values,
          cityName: cityList.filter((i) => i.value === cityCode)[0].label,
          backgroundImg: res.toString(),
        },
        callback: () => childRef.current.fetchGetData(),
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `城市设置 - ${initialValues.provinceName}`,
    loadingModels: 'manageCity',
    formItems: [
      {
        label: '城市',
        type: 'select',
        name: 'cityCode',
        select: cityList.map(({ value, label }) => ({ value, name: label })),
      },
      {
        label: '背景图',
        type: 'upload',
        name: 'backgroundImg',
        maxFile: 1,
      },
      {
        label: '城市文案',
        name: 'cityDesc',
        type: 'textArea',
        maxLength: 20,
      },
    ],
    onFinish: fetchCityManageSet,
    ...props,
  };
};

export default ManageCitySet;
