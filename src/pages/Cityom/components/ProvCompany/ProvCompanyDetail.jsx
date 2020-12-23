import { Button } from 'antd';
import { PHONE_PATTERN } from '@/common/regExp';

const ProvCompanyDetail = (props) => {
  const {
    dispatch,
    childRef,
    payload: { initialValues = '' },
  } = props;

  // 提交表单
  const fetchGetFormData = (values) => {
    const { mark, moment } = values;
    const couponBtn = [];
    if (mark) couponBtn.push('mark');
    if (moment) couponBtn.push('moment');
    dispatch({
      type: 'provCompany/fetchProvComAdd',
      payload: { ...values, couponChannels: couponBtn.toString() },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 默认值参数 则显示info详情，否则添加表单
  const drawerType = {
    true: { showType: 'info', title: '省级代理详情', footerShow: false },
    false: { showType: 'form', title: '新增省级代理', footerShow: true },
  }[!!initialValues];

  return {
    type: 'Drawer',
    showType: drawerType.showType,
    title: `${drawerType.title}`,
    loadingModels: 'marketCardActivity',
    initialValues: initialValues || {},
    footerShow: drawerType.footerShow,
    formItems: [
      {
        label: '姓名',
        name: 'couponType',
        render: () => '抵扣券',
      },
      {
        label: '手机号',
        name: 'couponName',
        addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
      },
      {
        label: '身份证号',
        type: 'number',
        name: 'couponValue',
      },
      {
        label: '企业名称',
        name: 'activeDays',
      },
      {
        label: '营业执照',
        type: 'upload',
        name: 'mark',
      },
      {
        label: '身份证',
        type: 'upload',
        name: 'marks',
      },
      {
        label: '代理区域',
        type: 'select',
        name: 'marssks',
      },
      {
        label: '加盟日期',
        type: 'rangePicker',
        name: 'ada',
      },
      {
        label: '签约金额',
        type: 'number',
        name: 'aasdada',
      },
      {
        title: '银行账号',
        label: '银行',
        type: 'select',
        name: 'asdsks',
      },
      {
        label: '银行卡号',
        name: 'asasdas',
      },
      {
        label: '开户城市',
        name: 'as',
      },
      {
        label: '开户支行',
        name: 'asssdda',
      },
      {
        label: '开户姓名',
        name: 'assda',
      },
      {
        label: '绑定手机号',
        name: 'assasdada',
      },
    ],
    onFinish: fetchGetFormData,
    footerBtn: () =>
      ({
        false: [
          <Button key="1" type="primary" visible={true}>
            冻结
          </Button>,
          <Button key="2" type="primary" visible={true}>
            解约
          </Button>,
        ],
        true: [],
      }[drawerType.footerShow]),
    ...props,
  };
};

export default ProvCompanyDetail;
