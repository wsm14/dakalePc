const ActiveTemplateNameSet = (props) => {
  const { callback, initialValues = {} } = props;

  // 提交表单
  const fetchGetFormData = (values) => {
    callback(values.activeName || values);
  };

  return {
    type: 'Modal',
    showType: 'form',
    title: '活动名称设置',
    initialValues: initialValues.activeName ? initialValues : { activeName: '' },
    formItems: [
      {
        label: '活动名称',
        name: 'activeName',
        onPressEnter: (e) => fetchGetFormData(e.target.value),
      },
    ],
    onFinish: fetchGetFormData,
  };
};

export default ActiveTemplateNameSet;
