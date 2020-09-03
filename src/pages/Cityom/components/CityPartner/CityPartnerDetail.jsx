import { Button } from 'antd';
import CITYJSON from '@/common/city';
import { PHONE_PATTERN } from '@/common/regExp';
import aliOssUpload from '@/utils/aliOssUpload';

const CityPartnerDetail = (props) => {
  const {
    dispatch,
    childRef,
    payload: { initialValues = '' },
  } = props;

  // 提交表单
  const fetchGetFormData = (values) => {
    const {
      businessLicense: { fileList: bfile },
      identityPicture: { fileList: ifile },
      joinTime: time,
      CascaderdistrictCode: city,
      bankAreaCode,
    } = values;
    aliOssUpload({ fileList: [...bfile, ...ifile] }).then((res) => {
      delete values.CascaderdistrictCode;
      dispatch({
        type: 'cityPartner/fetchCityPartnerAdd',
        payload: {
          ...values,
          businessLicense: res.slice(0, bfile.length).toString(),
          identityPicture: res.slice(ifile.length).toString(),
          joinTime: time[0].format('YYYY-MM-DD'),
          joinEndTime: time[0].format('YYYY-MM-DD'),
          bankAreaCode: bankAreaCode.toString(),
          province_code: city[0].value,
          province_name: city[0].label,
          cityCode: city[1].value,
          cityName: city[1].label,
          districtCode: city[2].value,
          districtName: city[2].label,
        },
        callback: () => childRef.current.fetchGetData(),
      });
    });
  };

  // 修改状态
  const fetchEditStatus = (partnerStatus) => {
    dispatch({
      type: 'cityPartner/fetchCityPartnerStatus',
      payload: {
        partnerId: initialValues.partnerIdString,
        partnerStatus,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 默认值参数 则显示info详情，否则添加表单
  const drawerType = {
    true: { showType: 'info', title: '合伙人详情', footerShow: true },
    false: { showType: 'form', title: '新增合伙人', footerShow: true },
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
        name: 'partnerName',
      },
      {
        label: '手机号',
        name: 'partnerMobile',
        addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
      },
      {
        label: '身份证号',
        type: 'number',
        name: 'identityCard',
      },
      {
        label: '企业名称',
        name: 'companyName',
      },
      {
        label: '企业地址',
        name: 'address',
      },
      {
        label: '营业执照',
        type: 'upload',
        name: 'businessLicense',
        maxFile: 3,
      },
      {
        label: '身份证',
        type: 'upload',
        name: 'identityPicture',
        maxFile: 2,
        show: false,
      },
      {
        label: '代理区域',
        type: 'cascader',
        name: 'districtCode',
        render: (val, row) => `${row.provinceName} - ${row.cityName} - ${row.districtName}`,
      },
      {
        label: '代理区域收集字段',
        hidden: true,
        show: false,
        name: 'CascaderdistrictCode',
      },
      {
        label: '加盟日期',
        type: 'rangePicker',
        name: 'joinTime',
        render: (val, row) => `${row.joinTime} ~ ${row.joinEndTime}`,
      },
      {
        label: '签约金额',
        type: 'number',
        name: 'bond',
      },
      {
        title: '银行账号',
        label: '银行',
        name: 'bankName',
        render: (val, row) => row.bankType,
      },
      {
        label: '银行卡号',
        name: 'bankNumber',
      },
      {
        label: '开户省',
        type: 'cascader',
        select: CITYJSON.map((item) => {
          if (item.level === '1') return { ...item, children: false };
        }),
        name: 'bankAreaCode',
      },
      {
        label: '行号',
        name: 'bankSwiftCode',
      },
      {
        label: '开户姓名',
        name: 'bankAccountName',
      },
      {
        label: '账号性质',
        type: 'radio',
        name: 'bankAccountType',
        select: ['对私', '对公'],
        render: (val, row) => ['对私', '对公'][val],
      },
      {
        title: '帐号密码',
        label: '登录帐号',
        name: 'account',
      },
      {
        label: '登录密码',
        name: 'password',
        show: false,
      },
    ],
    onFinish: fetchGetFormData,
    footerBtn: (loadings) =>
      ({
        false: [
          {
            btn: (
              <Button key="1" loadings={loadings} type="primary" onClick={() => fetchEditStatus(1)}>
                冻结
              </Button>
            ),
            visible: initialValues.partnerStatus === '0',
          },
          {
            btn: (
              <Button key="2" loadings={loadings} type="primary" onClick={() => fetchEditStatus(0)}>
                解冻
              </Button>
            ),
            visible: initialValues.partnerStatus === '1',
          },
          {
            btn: (
              <Button key="3" loadings={loadings} type="primary" onClick={() => fetchEditStatus(2)}>
                解约
              </Button>
            ),
            visible: initialValues.partnerStatus !== '2',
          },
        ],
        true: [],
      }[drawerType.showType !== 'info']),
    ...props,
  };
};

export default CityPartnerDetail;
