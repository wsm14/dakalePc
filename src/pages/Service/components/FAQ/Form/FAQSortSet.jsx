import aliOssUpload from '@/utils/aliOssUpload';
const FAQSortSet = (props) => {
  const { dispatch, childRef, qRef, initialValues = {}, setType } = props;

  // 提交表单
  const fetchDataEdit = (payload) => {
    const { image } = payload;
    aliOssUpload(image).then((res) => {
      dispatch({
        type: { add: 'serviceFAQ/fetchFAQSortAdd', edit: 'serviceFAQ/fetchFAQSortEdit' }[setType],
        payload: { id: initialValues.questionCategoryIdString, ...payload, image: res.toString() },
        callback: () => {
          childRef.current.fetchGetData();
          qRef.current.fetchGetData();
        },
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `${setType === 'add' ? '新增分类' : '修改分类'}`,
    loadingModels: 'serviceFAQ',
    initialValues,
    formItems: [
      {
        label: 'FAQ分类名称',
        name: 'questionCategoryName',
        maxLength: 10,
      },
      {
        label: '分类图',
        type: 'upload',
        name: 'image',
        maxFile: 1,
        isCut: true,
        imgRatio: 108 / 108,
        rules: [{ required: false }],
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default FAQSortSet;
