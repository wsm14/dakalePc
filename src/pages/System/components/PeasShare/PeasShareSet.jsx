import { NUM_INT } from '@/common/regExp';

const PeasShareSet = (props) => {
  const { dispatch, childRef } = props;

  const fetchRuningSet = (values) => {
    dispatch({
      type: 'sysPeasShare/fetchPeasShareAdd',
      payload: values,
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
        name: 'walkSignBeanAmount',
        suffix: '秒',
        addRules: [{ pattern: NUM_INT, message: '观看时长应为整数' }],
      },
      {
        label: '最低卡豆数',
        name: 'walkStepCount',
        suffix: '个',
        addRules: [{ pattern: NUM_INT, message: '最低卡豆数应为整数' }],
      },
    ],
    onFinish: fetchRuningSet,
    ...props,
  };
};

export default PeasShareSet;
