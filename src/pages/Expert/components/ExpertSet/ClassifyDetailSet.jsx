import aliOssUpload from '@/utils/aliOssUpload';

const ClassifyDetailSet = (props) => {
  const { dispatch, childRef, initialValues = {}, domainId } = props;

  // 提交表单
  const fetchDataEdit = (values) => {
    const { image } = values;
    const editType = !initialValues.topicId;
    aliOssUpload(image).then((res) => {
      dispatch({
        type: {
          true: 'expertSet/fetchClassifyDetailAdd',
          false: 'expertSet/fetchClassifyDetailSet',
        }[editType],
        payload: {
          ...initialValues,
          ...values,
          domainId,
          image: res.toString(),
        },
        callback: () => childRef.current.fetchGetData(),
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `设置 - 话题`,
    loadingModels: 'expertSet',
    initialValues,
    formItems: [
      {
        label: `图片`,
        type: 'upload',
        name: 'image',
        maxFile: 1,
      },
      {
        label: `话题名称`,
        name: 'topicName',
        maxLength: 10,
      },
      {
        label: `说明`,
        name: 'topicDesc',
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default ClassifyDetailSet;
