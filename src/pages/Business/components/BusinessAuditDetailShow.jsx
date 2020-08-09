import { Button, Modal } from 'antd';
import { BUSINESS_STATUS, ACCOUNT_STATUS } from '@/common/constant';
import BusinessAuditAllow from './BusinessAuditAllow';
import BusinessAuditRefuse from './BusinessAuditRefuse';

const UserDetailShow = (props) => {
  const { dispatch, childRef, initialValues, mreId: id, loading } = props;
  const {
    hasPartner, // 是否存在城市合伙人
    interiorImg, // 店铺内景照
    businessLicense: limg, // 营业执照
    businessPermit: pimg, // 资质证照
    merchantName, // 店铺名
  } = initialValues;

  // 审核通过
  const handleMerAuditAllow = () => {
    // 是否存在城市合伙人判断
    // if (!Number(hasPartner))
    //   Modal.info({
    //     title: '审核失败',
    //     content: '该商家所在的城市区域未设置城市合伙人，请先设置该城市的城市合伙人',
    //     okText: '确认',
    //     cancelText: '取消',
    //   });
    // else {
    dispatch({
      type: 'drawerForm/show',
      payload: {
        loading,
        title: `审核通过 - ${merchantName} `,
        ...BusinessAuditAllow(merchantName),
        onFinish: (val) => fetchMerSaleAudit({ ...val, verifyStatus: 3 }),
      },
    });
    // }
  };

  // 审核驳回
  const handleMerAuditRefuse = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: {
        loading,
        title: `审核驳回 - ${merchantName} `,
        ...BusinessAuditRefuse(),
        onFinish: (val) => fetchMerSaleAudit({ ...val, verifyStatus: 2 }),
      },
    });
  };

  // 审核方法
  const fetchMerSaleAudit = (val) => {
    dispatch({
      type: 'businessAuditList/fetchMerSaleAudit',
      payload: { ...val, id },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'info',
    width: 600,
    title: '商户详情',
    loadingModels: 'businessAuditList',
    formItems: [
      { label: '商户头像', name: 'profile', type: 'upload' },
      { label: '商家ID', name: 'merchantId', render: (val) => val || '-' },
      { label: '店铺名称', name: 'merchantName' },
      { label: '商家类型', name: 'topCategoryName' },
      { label: '商家账号', name: 'mobile' },
      { label: '人均消费', name: 'perCapitaConsumption', render: (val) => val || '-' },
      { label: '营业时间段', name: 'businessTime', render: (val) => val || '-' },
      { label: '商家电话', name: 'telephone' },
      { label: '经营品类', name: 'categoryName' },
      { label: '商家地址', name: 'address' },
      { label: '所在商圈', name: 'businessHub' },
      // { label: '绑定银行卡', name: 'bankName' },
      {
        label: '经营状态',
        name: 'businessStatus',
        render: (val) => (val ? BUSINESS_STATUS[val] : '-'),
      },
      { label: '店铺状态', name: 'status', render: (val) => ACCOUNT_STATUS[val] },
      {
        label: '资质证照',
        name: 'businessLicense',
        type: 'upload',
        initialValue: limg && [
          JSON.parse(limg).businessLicenseImg,
          JSON.parse(pimg).businessPermitImg,
        ],
      },
      { label: '店铺门头照', name: 'coverImg', type: 'upload' },
      {
        label: '店铺内景照',
        name: 'interiorImg',
        type: 'upload',
        initialValue: interiorImg && interiorImg.split(','),
      },
    ],
    footerBtn: () => [
      <Button key="1" type="primary" onClick={handleMerAuditAllow}>
        审核通过
      </Button>,
      <Button key="2" type="primary" onClick={handleMerAuditRefuse}>
        审核驳回
      </Button>,
    ],
    ...props,
  };
};

export default UserDetailShow;
