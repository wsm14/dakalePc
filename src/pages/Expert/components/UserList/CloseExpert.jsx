import { EXPERT_USER_STATUS } from '@/common/constant';

export default (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 下架
  const fetchExpertStop = (payload) => {
    dispatch({
      type: 'expertUserList/fetchExpertStop',
      payload: {
        ...initialValues,
        ...payload,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Modal',
    showType: 'form',
    title: `封停 - ${initialValues.username}`,
    width: 520,
    loadingModels: 'expertUserList  ',
    onFinish: fetchExpertStop,
    formItems: [
      {
        label: '封停',
        name: 'suspendStatus',
        type: 'select',
        select: EXPERT_USER_STATUS.map((i) => {
          if (i == '正常') return false;
          return i;
        }),
      },
      {
        label: '封停原因',
        name: 'suspendReason',
        type: 'textArea',
      },
    ],
  };
};
