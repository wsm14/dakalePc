import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form, Tabs, Input, Modal, Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import ExtraButton from '@/components/ExtraButton';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
import { checkCityName } from '@/utils/utils';

const { TabPane } = Tabs;

const BusinessDetailShow = (props) => {
  const { dispatch, cRef, visible = null, total, getDetail, onClose, loading, sceneList } = props;

  const loadings =
    loading.effects['businessList/fetchSetStatus'] ||
    loading.effects['businessList/fetchMerchantProhibitCheck'];
  const loadingSave = loading.effects['businessList/fetchMerSetBandCode'];
  const loadingCheck = loading.effects['baseData/fetchGetPhoneComeLocation'];
  const loadingEditBd = loading.effects['businessList/fetchMerchantEdit'];

  const [mobileInfo, setMobileInfo] = useState({});
  const [editBD, setEditBD] = useState(false);

  const {
    businessLicenseObject: blobj = {},
    bankBindingInfo: bkInfo = {},
    userMerchantIdString: merchantId,
    settlementFlag,
    businessStatus,
    status,
    mobile,
    provinceName = '',
    cityName = '',
    index,
    headerContentObject = {},
  } = visible;

  const { headerType = 'image' } = headerContentObject;

  useEffect(() => {
    mobile && fetchGetPhoneComeLocation();
  }, [mobile]);

  const statusNum = Number(status);
  const businessStatusNum = Number(businessStatus);
  const statusText = !statusNum ? '启用' : '禁用';
  const businessStatusText = !businessStatusNum ? '恢复营业' : '暂停营业';

  // 修改bd
  const fetchMerEditBD = (values) => {
    dispatch({
      type: 'businessList/fetchMerchantEdit',
      payload: {
        userMerchantId: merchantId,
        ...values,
      },
      callback: () => {
        visible.bdInfo = values.bdInfo;
        setEditBD(false);
      },
    });
  };

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

  // 获取手机归属地
  const fetchGetPhoneComeLocation = () => {
    dispatch({
      type: 'baseData/fetchGetPhoneComeLocation',
      payload: {
        mobile,
      },
      callback: setMobileInfo,
    });
  };

  // 提示修改状态
  const handleTipEditMre = (title, payload) => {
    Modal.confirm({
      title,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'businessList/fetchSetStatus',
          payload: { merchantId, ...payload },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      },
    });
  };

  // 店铺禁用检查在售券
  const fetchMerchantProhibitCheck = () => {
    dispatch({
      type: 'businessList/fetchMerchantProhibitCheck',
      payload: {
        userMerchantId: merchantId,
      },
      callback: ({ msg, isWarn }) => {
        handleTipEditMre(isWarn ? msg : '确认对该店铺帐号 禁用？', { status: 0 });
      },
    });
  };

  // acc帐号状态 sale营业状态 恢复营业status 给1 只有停业用 businessStatus 0
  const handleMerStatus = (type) => {
    if (type === 'sale' && businessStatusNum === 0) type = 'hsale';
    if (type === 'acc' && statusNum) {
      fetchMerchantProhibitCheck();
      return;
    }
    const propsItem = {
      hsale: { title: '确认对该店铺 恢复营业？', payload: { businessStatus: 1 } },
      sale: { title: '确认对该店铺 停业？', payload: { businessStatus: 0 } },
      acc: { title: '确认对该店铺帐号 启用？', payload: { status: 1 } },
    }[type];
    handleTipEditMre(propsItem.title, propsItem.payload);
  };

  // 检查归属地和所在地是否相同
  const checkMobile = provinceName.includes(mobileInfo.prov) && cityName.includes(mobileInfo.city);

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
          {val}
          <Tag
            icon={loadingCheck && <SyncOutlined spin />}
            color={checkMobile ? 'success' : 'error'}
          >
            {!loadingCheck && `${mobileInfo.prov || ''}-${mobileInfo.city || ''}`}
          </Tag>
        </div>
      ),
    },
    {
      label: '店铺类型',
      name: 'type',
    },
    {
      label: '所属集团',
      name: 'groupName',
      show: visible.type === '子门店',
    },
    {
      label: '省市区',
      name: 'districtCode',
      render: (val, row) => checkCityName(row.districtCode),
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
      label: '扫码付服务费',
      name: 'scanCommissionRatio',
      render: (val) => `${val || 0}%`,
    },
    {
      label: '核销订单服务费',
      name: 'commissionRatio',
      render: (val) => `${val || 0}%`,
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
      name: ['headerContentObject', { image: 'imageUrl', video: 'mp4Url' }[headerType]],
      type: { image: 'upload', video: 'videoUpload' }[headerType],
    },
    {
      label: '店铺LOGO',
      name: 'logoImg',
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
        <>
          <div>店铺名称：{blobj.businessName}</div>
          <div>统一社会信用代码：{blobj.socialCreditCode}</div>
          <div>注册地址：{blobj.signInAddress}</div>
          <div>营业期限：{blobj.validityPeriod}</div>
          <div>经营范围：{blobj.businessScope}</div>
        </>
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
        const scenId = val ? val : [];
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
      label: '结算类型',
      name: 'settlementFlag',
      render: () => (settlementFlag == '1' ? '独立结算' : '统一结算'),
      show: visible.type === '子门店',
    },
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

  const voiceInfo = [
    {
      label: '阿里云productKey',
      name: 'iotProductKey',
    },
    {
      label: '阿里云deviceName',
      name: 'iotDeviceName',
    },
  ];

  const bdItems = [
    {
      label: '归属BD',
      name: 'bdInfo',
    },
  ];

  const modalProps = {
    title: `商家详情`,
    width: 800,
    visible,
    onClose,
    loading: loading.effects['businessList/fetchMerchantDetail'],
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size),
    },
    footer: (
      <ExtraButton
        list={[
          {
            text: businessStatusText,
            auth: 'bussinessStatus',
            onClick: () => handleMerStatus('sale'),
            loading: loadings,
          },
          {
            text: statusText,
            auth: 'status',
            disabled: visible.groupId,
            onClick: () => handleMerStatus('acc'),
            loading: loadings,
          },
        ]}
      ></ExtraButton>
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
          <Form style={{ marginTop: 24 }} preserve={false} onFinish={fetchMerSetBandCode}>
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
        <TabPane tab="语音播报信息" key="3">
          <DescriptionsCondition formItems={voiceInfo} initialValues={visible} />
        </TabPane>
        <TabPane tab="归属BD" key="4">
          {!editBD ? (
            <>
              <DescriptionsCondition formItems={bdItems} initialValues={visible} />
              <Button
                style={{ marginLeft: 60, marginTop: 24 }}
                type="primary"
                onClick={() => setEditBD(true)}
              >
                编辑
              </Button>
            </>
          ) : (
            <Form
              style={{ marginTop: 24 }}
              preserve={false}
              initialValues={visible}
              onFinish={fetchMerEditBD}
            >
              <Form.Item label="归属BD" name="bdInfo" rules={[{ required: false }]}>
                <Input placeholder="请输入归属BD"></Input>
              </Form.Item>
              <Button
                style={{ marginLeft: 60 }}
                type="primary"
                loading={loadingEditBd}
                htmlType="submit"
              >
                保存
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={() => setEditBD(false)}>
                取消
              </Button>
            </Form>
          )}
        </TabPane>
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(BusinessDetailShow);
