import { Button, Modal } from 'antd';
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
    if (!Number(hasPartner))
      Modal.info({
        title: '审核提示',
        content: '该商家所在的城市区域未设置城市合伙人，请先设置该城市的城市合伙人',
        okText: '确认',
        cancelText: '取消',
      });
    else {
      Modal.success({
        title: `审核通过 - ${merchantName}`,
        content: '是否确认审核通过？',
        okText: '确认',
        cancelText: '取消',
        confirmLoading: loading,
        onOk: () => {},
      });
    }
  };

  // 审核驳回
  const handleMerAuditRefuse = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: {
        title: `审核驳回 - ${merchantName}`,
        ...BusinessAuditRefuse(),
        onFinish: (val) => fetchMerSaleAudit({ ...val, verifyStatus: 2 }),
      },
    });
  };

  // 审核
  const fetchMerSaleAudit = (val) => {
    dispatch({
      type: 'businessAudit/fetchMerSaleAudit',
      payload: { ...val, id },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'info',
    width: 600,
    title: '商户详情',
    loadingModels: 'businessAudit',
    formItems: [
      { label: '所在城市', name: 'profisle' },
      { label: '门店名称', name: 'merchantName' },
      { label: '门店电话', name: 'telephone' },
      { label: '所在商圈', name: 'businessHub' },
      { label: '门店地址', name: 'address' },
      { label: '经营品类', name: 'categoryName' },
      { label: '平台服务费', name: 'categosryName' },
      { label: '品牌名称', name: 'topCategoryName' },
      { label: '联系人信息', name: 'mobilse' },
      { label: '店铺门头照', name: 'coverImg', type: 'upload' },
      {
        label: '店铺内景照',
        name: 'interiorImg',
        type: 'upload',
        initialValue: interiorImg && interiorImg.split(','),
      },
      {
        label: '营业执照',
        name: 'businessLicenseImg',
        type: 'upload',
        initialValue: limg && JSON.parse(limg).businessLicenseImg,
        children: `aasdas`,
      },
      {
        label: '经营许可证',
        name: 'businessLicense',
        type: 'upload',
        initialValue: pimg && JSON.parse(pimg).businessPermitImg,
        children: `aasdas`,
      },
      {
        label: '其他证明',
        name: 'businesssLiscense',
        type: 'upload',
        initialValue: pimg && JSON.parse(pimg).businessPermitImg,
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
