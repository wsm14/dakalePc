import { NUM_INT } from '@/common/regExp';

const PeasShareSet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  const fetchPeasShareAdd = (values) => {
    const payload = {
      true: { type: 'sysPeasShare/fetchPeasShareAdd' },
      false: { type: 'sysPeasShare/fetchPeasShareEdit' },
    }[!Object.keys(initialValues).length];

    dispatch({
      type: payload.type,
      payload: { configMomentId: initialValues.configMomentIdString, ...initialValues, ...values },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '卡豆分享设置',
    loadingModels: 'sysPeasShare',
    formItems: [
      {
        label: '观看时长',
        name: 'watchTime',
        suffix: '秒',
        addRules: [{ pattern: NUM_INT, message: '观看时长应为整数' }],
      },
      {
        label: '最低卡豆数',
        name: 'limitBean',
        suffix: '个',
        addRules: [{ pattern: NUM_INT, message: '最低卡豆数应为整数' }],
      },
    ],
    onFinish: fetchPeasShareAdd,
    ...props,
  };
};

export default PeasShareSet;
