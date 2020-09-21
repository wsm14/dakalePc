const ActiveTemplateNameSet = (props) => {
  const { callback } = props;

  // 提交表单
  const fetchGetFormData = (values) => {
    callback(values.activeName);
  };

  return {
    type: 'Modal',
    showType: 'form',
    title: '活动名称设置',
    formItems: [
      {
        label: '活动名称',
        name: 'activeName',
      },
    ],
    onFinish: fetchGetFormData,
    ...props,
  };
};

export default ActiveTemplateNameSet;
