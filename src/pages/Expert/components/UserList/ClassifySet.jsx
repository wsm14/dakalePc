import aliOssUpload from '@/utils/aliOssUpload';

const ClassifySet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;
  // 提交表单
  const fetchDataEdit = (values) => {
    const { domainImage = '' } = values;
    const editType = !initialValues.domainId;
    aliOssUpload(domainImage).then((res) => {
      dispatch({
        type: { true: 'expertSet/fetchExpertAdd', false: 'expertSet/fetchClassifyEdit' }[editType],
        payload: { ...initialValues, ...values, domainImage: res.toString() },
        callback: () => childRef.current.fetchGetData(),
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `${!initialValues.domainId ? '新增' : '修改'}`,
    loadingModels: 'expertSet',
    initialValues,
    formItems: [
      {
        label: '领域名称',
        visible: initialValues.parentDomainId == 0,
        name: 'domainName',
      },
      {
        label: '领域',
        visible: initialValues.parentDomainId !== 0 && !!initialValues.parentDomainId,
        name: 'domainNameShow',
        disabled: true,
      },
      {
        label: '内容分类',
        visible: initialValues.parentDomainId !== 0,
        name: 'domainName',
      },
      {
        label: `图片`,
        type: 'upload',
        name: 'domainImage',
        maxFile: 1,
        visible: initialValues.parentDomainId !== 0,
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default ClassifySet;
