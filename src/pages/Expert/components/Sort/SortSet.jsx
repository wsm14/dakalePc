import { EXPERT_SORT_TYPE } from '@/common/constant';
const SortSet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 提交表单
  const fetchDataEdit = (values) => {
    dispatch({
      type: 'expertSort/fetchExpertSortSet',
      payload: {
        ...initialValues,
        ...values,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Modal',
    showType: 'form',
    title: `设置数值 - ${EXPERT_SORT_TYPE[initialValues.key]}`,
    loadingModels: 'expertSort',
    initialValues,
    formItems: [
      {
        label: '设置数值',
        name: 'value',
        type: 'number',
      },
    ],
    onFinish: fetchDataEdit,
  };
};

export default SortSet;
