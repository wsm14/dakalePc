import { Button, Modal } from 'antd';
import { BUSINESS_STATUS, ACCOUNT_STATUS } from '@/common/constant';

const UserDetailShow = (props) => {
  const { dispatch, childRef, initialValues } = props;
  const {
    status,
    businessStatus,
    merchantId,
    interiorImg,
    businessLicense: limg,
    businessPermit: pimg,
  } = initialValues;

  const statusNum = Number(status);
  const businessStatusNum = Number(businessStatus);
  const statusText = !statusNum ? '启用' : '禁用';
  const businessStatusText = !businessStatusNum ? '营业' : '停业';

  const handleMerStatus = () => {
    Modal.confirm({
      title: `确认对该店铺 ${statusText}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'businessList/fetchSetStatus',
          payload: { merchantId, status: Number(!statusNum) },
          callback: () => childRef.current.fetchGetData(),
        });
      },
    });
  };

  const handleMerSaleStatus = () => {
    Modal.confirm({
      title: `确认对该店铺 ${businessStatusText}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'businessList/fetchMerSaleStatus',
          payload: { merchantId, status: Number(!businessStatusNum) },
          callback: () => childRef.current.fetchGetData(),
        });
      },
    });
  };

  return {
    type: 'Drawer',
    showType: 'info',
    width: 600,
    title: '商户详情',
    loadingModels: 'businessList',
    formItems: [
      { label: '所在城市', name: 'profisle' },
      { label: '门店名称', name: 'merchantName' },
      { label: '门店电话', name: 'telephone' },
      { label: '所在商圈', name: 'businessHub' },
      { label: '门店地址', name: 'address' },
      { label: '品牌名称', name: 'topCategoryName' },
      { label: '经营品类', name: 'categoryName' },
      { label: '平台服务费', name: 'categosryName' },
      { label: '联系人信息', name: 'mobilse' },
      {
        label: '经营状态',
        name: 'businessStatus',
        render: (val) => (val ? BUSINESS_STATUS[val] : '-'),
      },
      { label: '店铺状态', name: 'status', render: (val) => ACCOUNT_STATUS[val] },
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
    footerBtn: (loading) => [
      <Button key="1" type="primary" onClick={handleMerSaleStatus} loading={loading}>
        {businessStatusText}
      </Button>,
      <Button key="2" type="primary" onClick={handleMerStatus} loading={loading}>
        {statusText}
      </Button>,
    ],
    ...props,
  };
};

export default UserDetailShow;
