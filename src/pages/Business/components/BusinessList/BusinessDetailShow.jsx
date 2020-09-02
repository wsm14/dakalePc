import React from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, Tabs, Input, Modal } from 'antd';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const { TabPane } = Tabs;

const BusinessDetailShow = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const loadings = loading.effects['businessList/fetchSetStatus'];
  const loadingSave = loading.effects['businessList/fetchMerSetBandCode'];

  const {
    businessLicenseObject: blobj = {},
    bankBindingInfo: bkInfo = {},
    userMerchantIdString: merchantId,
    businessStatus,
    status,
  } = visible;

  const statusNum = Number(status);
  const businessStatusNum = Number(businessStatus);
  const statusText = !statusNum ? '启用' : '禁用';
  const businessStatusText = !businessStatusNum ? '恢复营业' : '停业';

  const [form] = Form.useForm();

  // 设置开户行号
  const fetchMerSetBandCode = (values) => {
    dispatch({
      type: 'businessList/fetchMerSetBandCode',
      payload: {
        merchantId,
        ...values,
      },
    });
  };

  // acc帐号状态 sale营业状态 恢复营业status 给1 只有停业用 businessStatus 0
  const handleMerStatus = (type) => {
    if (type === 'sale' && businessStatusNum === 0) type = 'hsale';
    const propsItem = {
      hsale: { title: '恢复营业', payload: { status: 1 } },
      sale: { title: '停业', payload: { businessStatus: 0 } },
      acc: { title: statusText, payload: { status: Number(!statusNum) } },
    }[type];

    Modal.confirm({
      title: `确认对该店铺 ${propsItem.title}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'businessList/fetchSetStatus',
          payload: { merchantId, ...propsItem.payload },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      },
    });
  };

  const storeItems = [
    {
      label: '品牌名称',
      name: 'brandName',
    },
    {
      label: '商户简称',
      name: 'merchantName',
    },
    {
      label: '省市区',
      name: 'provinceName',
      render: (val, row) => `${val} - ${row.cityName} - ${row.districtName}`,
    },
    {
      label: '详细地址',
      name: 'address',
    },
    {
      label: '商户电话',
      name: 'telephone',
    },
    {
      label: '经营类目',
      name: 'topCategoryName',
      render: (val, row) => `${val} - ${row.categoryName}`,
    },
    {
      label: '平台服务费',
      name: 'commissionRatio',
      render: (val, row) => `${val}%`,
    },
    {
      label: '门头照',
      name: 'coverImg',
      type: 'upload',
    },
    {
      label: '店铺内景照',
      name: 'interiorImg',
      type: 'upload',
      initialValue: visible && visible.interiorImg.split(','),
    },
    {
      label: '营业执照',
      name: 'businessLicenseImg',
      type: 'upload',
      initialValue: blobj.businessLicenseImg,
      children: (
        <div style={{ maxWidth: 363 }}>
          <div>商户名称：{blobj.businessName}</div>
          <div>统一社会信用代码：{blobj.socialCreditCode}</div>
          <div>注册地址：{blobj.signInAddress}</div>
          <div>营业期限：{blobj.validityPeriod}</div>
          <div>经营范围：{blobj.businessScope}</div>
        </div>
      ),
    },
  ];

  const accountItems = [
    {
      label: '账户类型',
      name: 'bankAccountType',
      render: (val) => (val === 1 ? '对公（企业/组织机构）' : '对私（个体工商户）'),
    },
    {
      label: '开户许可证',
      type: 'upload',
      show: bkInfo.bankAccountType === 1,
      name: 'openAccountPermit',
    },
    {
      label: '开户名',
      name: 'cardName',
    },
    {
      label: '银行卡号',
      name: 'cardNo',
    },
    {
      label: '开户银行',
      name: 'bankBranchName',
    },
    {
      label: '省份编码',
      name: 'provCode',
    },
    {
      label: '地区编码',
      name: 'areaCode',
    },
    {
      label: '法人身份证',
      type: 'upload',
      name: 'certFrontPhoto',
      initialValue: [bkInfo.certFrontPhoto, bkInfo.certReversePhoto],
    },
    {
      label: '法人姓名',
      name: 'legalPerson',
    },
    {
      label: '法人身份证号',
      name: 'legalCertId',
    },
    {
      label: '法人身份证有效期',
      name: 'legalCertIdExpires',
    },
    {
      label: '法人手机号',
      name: 'legalMp',
    },
  ];

  const modalProps = {
    title: `商家详情`,
    width: 600,
    visible,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={() => handleMerStatus('sale')} loading={loadings}>
              {businessStatusText}
            </Button>
            <Button type="primary" onClick={() => handleMerStatus('acc')} loading={loadings}>
              {statusText}
            </Button>
          </Space>
        </div>
      }
    >
      <Tabs type="card">
        <TabPane tab="店铺信息" key="1">
          <DescriptionsCondition formItems={storeItems} initialValues={visible} />
        </TabPane>
        <TabPane tab="账号信息" key="2">
          <DescriptionsCondition formItems={accountItems} initialValues={bkInfo} />
          <Form
            style={{ marginTop: 24 }}
            form={form}
            preserve={false}
            onFinish={fetchMerSetBandCode}
            initialValues={{
              bankSwiftCode: visible.bankBindingInfo ? bkInfo.bankSwiftCode : '',
            }}
          >
            <Form.Item
              name="bankSwiftCode"
              label="开户行号"
              rules={[{ required: true, message: '请输入开户行号' }]}
            >
              <Input placeholder="请输入开户行号"></Input>
            </Form.Item>
            <Button
              style={{ marginLeft: 80 }}
              type="primary"
              loading={loadingSave}
              htmlType="submit"
            >
              保存
            </Button>
          </Form>
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(BusinessDetailShow);
