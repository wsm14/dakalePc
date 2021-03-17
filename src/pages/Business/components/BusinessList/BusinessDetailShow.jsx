import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form, Tabs, Input, Modal } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';

const { TabPane } = Tabs;

const BusinessDetailShow = (props) => {
  const { dispatch, cRef, visible = null, onClose, loading, sceneList } = props;

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
  const businessStatusText = !businessStatusNum ? '恢复营业' : '暂停营业';

  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ bankSwiftCode: visible.bankBindingInfo ? bkInfo.bankSwiftCode : '' });
    }
  }, [visible]);

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
      hsale: { title: '恢复营业', payload: { businessStatus: 1 } },
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
      label: '店铺简称',
      name: 'merchantName',
    },
    {
      label: '店铺帐号',
      name: 'mobile',
      render: (val) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {val} <span style={{ padding: '5px 10px', background: '#ccc' }}>浙江-杭州</span>
        </div>
      ),
      style: { border: ' 2px solid #f00 ' },
    },
    {
      label: '店铺类型',
      name: 'type',
    },
    {
      label: '集团名称',
      name: 'groupName',
      show: visible.type === '集团',
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
      label: '所属商圈',
      name: 'businessHub',
    },
    {
      label: '店铺电话',
      name: 'telephone',
    },
    {
      label: '经营类目',
      name: 'category',
    },
    {
      label: '推广费',
      name: 'promotionFee',
      render: (val) => `${val || 0}%`,
    },
    {
      label: '平台服务费',
      name: 'commissionRatio',
      render: (val, row) =>
        `${row.businessArea ? `面积${row.businessArea}平方 - ` : ''}${val}%（赠送卡豆${
          row.bondBean
        }）`,
    },
    {
      label: '门头照',
      name: 'coverImg',
      type: 'upload',
    },
    {
      label: '店铺头图',
      name: 'headerImg',
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
          <div>店铺名称：{blobj.businessName}</div>
          <div>统一社会信用代码：{blobj.socialCreditCode}</div>
          <div>注册地址：{blobj.signInAddress}</div>
          <div>营业期限：{blobj.validityPeriod}</div>
          <div>经营范围：{blobj.businessScope}</div>
        </div>
      ),
    },
    {
      label: '人均消费',
      name: 'perCapitaConsumption',
    },
    {
      label: '营业时间',
      name: 'businessTimeObj',
    },
    {
      label: '店铺服务',
      name: ['property', 'service'],
      render: (val) => val.toString(),
    },
    {
      label: '特色服务',
      name: ['property', 'speacial'],
      render: (val) => val.toString(),
    },
    {
      label: '场景设置',
      name: 'scenesIds',
      render: (val) => {
        const scenId = val? val : [];
        let sceneName = '';
        if (sceneList && sceneList.length) {
          sceneList.forEach((item) => {
            scenId.forEach((item1) => {
              if (item.value == item1) {
                sceneName = sceneName ? sceneName + '，' + item.label : item.label;
              }
            });
          });
        }
        return <span>{sceneName.toString()}</span>;
      },
    },
    {
      label: '店铺标签',
      name: 'tags',
    },
  ];

  const accountItems = [
    {
      label: '账户类型',
      name: 'bankAccountType',
      render: (val) => (val === '1' ? '对公（企业/组织机构）' : '对私（个体工店铺）'),
    },
    {
      label: '开户许可证',
      type: 'upload',
      visible: bkInfo.bankAccountType === 1,
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
    width: 800,
    visible,
    onClose,
    footer: (
      <>
        <AuthConsumer auth="bussinessStatus">
          <Button type="primary" onClick={() => handleMerStatus('sale')} loading={loadings}>
            {businessStatusText}
          </Button>
        </AuthConsumer>
        <AuthConsumer auth="status">
          <Button type="primary" onClick={() => handleMerStatus('acc')} loading={loadings}>
            {statusText}
          </Button>
        </AuthConsumer>
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
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
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(BusinessDetailShow);
