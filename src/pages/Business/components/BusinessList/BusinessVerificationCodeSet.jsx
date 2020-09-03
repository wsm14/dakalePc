import { PHONE_PATTERN } from '@/common/regExp';
const BusinessVerificationCodeSet = (props) => {
  const { dispatch } = props;

  // 新增
  const fetchMerBrandAdd = (values) => {
    dispatch({
      type: 'businessList/fetchMerVerificationCodeSet',
      payload: values,
      callback: () => dispatch({ type: 'drawerForm/close' }),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '设置商家验证码',
    loadingModels: 'businessList',
    formItems: [
      {
        label: '商家手机号',
        name: 'mobile',
        addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
      },
      {
        label: '验证码',
        name: 'smsCode',
        extra: '验证码为四位数字',
        addRules: [{ pattern: /^\d{4}$/, message: '验证码为四位数字' }],
      },
    ],
    onFinish: fetchMerBrandAdd,
    ...props,
  };
};

export default BusinessVerificationCodeSet;
