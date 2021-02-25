import aliOssUpload from '@/utils/aliOssUpload';

const BusinessBankSet = (props) => {
  const { dispatch, childRef, tradeList, initialValues = {} } = props;

  // 新增
  const fetchMerBrandSet = (values) => {
    const { brandLogo, categoryId } = values;
    aliOssUpload(brandLogo).then((res) => {
      // initialValues.configBrandIdString 存在为修改 false 为新增
      dispatch({
        type: { false: 'businessBrand/fetchMerBrandAdd', true: 'businessBrand/fetchMerBrandEdit' }[
          !!initialValues.configBrandIdString
        ],
        payload: {
          ...values,
          configBrandIdString: initialValues.configBrandIdString,
          categoryName: tradeList.filter((item) => item.id === categoryId)[0].categoryName,
          brandLogo: res.toString(),
        },
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
        name: 'brandLogo',
        maxFile: 1,
        isCut: true,
        imgRatio: 50 / 50,
      },
      {
        label: '品牌名',
        name: 'brandName',
        maxLength: 20,
      },
      {
        label: '品牌类型',
        type: 'select',
        name: 'categoryId',
        select: tradeList,
        fieldNames: { label: 'categoryName', value: 'id' },
      },
    ],
    onFinish: fetchMerBrandSet,
    ...props,
  };
};

export default BusinessBankSet;
