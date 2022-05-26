import React, { useState } from 'react';
import { connect } from 'umi';
import { Tabs, Alert } from 'antd';
import { SUPPLIER_AUTH_TYPE } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import { checkCityName } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const { TabPane } = Tabs;

const SpecialGoodCheckDetail = (props) => {
  const { visible, onClose, getDetail, loading, dispatch, total, cRef } = props;
  const { show = false, mode = 'check', detail = {}, index } = visible;

  const { supplierVerifyId } = detail;

  const [visibleRefuse, setVisibleRefuse] = useState(false); // 审核拒绝 下架原因

  // 审核通过
  const handleVerifyAllow = () => {
    dispatch({
      type: 'supplierAuth/fetchSupplierVerifyAllow',
      payload: { supplierVerifyId },
      callback: () => {
        cRef.current.fetchGetData();
        onClose();
      },
    });
  };

  // 审核驳回
  const fetchVerifyReject = (values) => {
    dispatch({
      type: 'supplierAuth/fetchSupplierVerifyReject',
      payload: {
        ...values,
        supplierVerifyId,
      },
      callback: () => {
        setVisibleRefuse(false);
        onClose();
        childRef.current.fetchGetData();
      },
    });
  };

  // 基础信息
  const baseItemArr = [
    {
      title: '基础信息',
      formItems: [
        {
          label: '供应商类型',
          name: ['supplierObject', 'type'],
          render: (val) => SUPPLIER_AUTH_TYPE[val],
        },
        {
          label: '供应商名称',
          name: 'supplierName',
        },
        {
          label: '供应商ID',
          name: 'identifyId',
          show: mode === 'info',
        },
        {
          label: '主营类目',
          name: ['supplierObject', 'classifyNames'],
        },
        {
          label: '所属地区',
          name: ['supplierObject', 'districtCode'],
          render: (val) => checkCityName(val),
        },
        {
          label: '申请时间',
          name: 'createTime',
        },
      ],
    },
    {
      title: '联系人信息',
      formItems: [
        {
          label: '联系人姓名',
          name: ['supplierObject', 'contactName'],
        },
        {
          label: '联系人手机号',
          name: ['supplierObject', 'contactPhone'],
        },
      ],
    },
    {
      title: '介绍人信息',
      formItems: [
        {
          label: '有无介绍人',
          name: ['supplierObject', 'anyInducer'],
          render: (val) => ['无', '有'][val],
        },
        {
          label: '介绍人账号',
          name: ['supplierObject', 'inducer'],
          show: detail.supplierObject.anyInducer == 1,
          render: (val) => `${val.inducerName} ${val.inducerMobile} ${val.inducerBeanCode}`,
        },
      ],
    },
  ];

  // 供应商资质信息
  const intelligenceFormItem = [
    {
      label: '营业执照',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'businessLicenseImg'],
    },
    {
      label: '公司名称',
      name: ['supplierObject', 'proofInfoObject', 'businessName'],
    },
    {
      label: '统一社会信用代码',
      name: ['supplierObject', 'proofInfoObject', 'socialCreditCode'],
    },
    {
      label: '注册地址',
      name: ['supplierObject', 'proofInfoObject', 'signInAddress'],
    },
    {
      label: '营业期限',
      name: ['supplierObject', 'proofInfoObject', 'establishDate'],
    },
    {
      label: '经营范围',
      name: ['supplierObject', 'proofInfoObject', 'businessScope'],
    },
    {
      label: '生产/经营许可证',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'productLicense'],
    },
    {
      label: '体系认证',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'systemApprove'],
    },
    {
      label: '产品认证',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'productApprove'],
    },
    {
      label: '授权证书',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'authorizeImg'],
    },
  ];

  const btnList = [
    {
      auth: 'check',
      onClick: handleVerifyAllow,
      text: '审核通过',
    },
    {
      auth: 'check',
      onClick: () => setVisibleRefuse(true),
      danger: true,
      text: '审核驳回',
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: mode === 'check' ? '审核' : '详情',
    visible: show,
    loading: loading.effects['supplierAuth/fetchGetSupplierSettlementDetail'],
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size),
    },
    footer: mode === 'check' && (
      <ExtraButton
        list={btnList}
        loading={
          loading.effects['supplierAuth/fetchGetSupplierVerifyAllow'] ||
          loading.effects['supplierAuth/fetchGetSupplierVerifyReject']
        }
      ></ExtraButton>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        {detail.rejectReason && (
          <Alert
            message={detail.rejectReason}
            type="error"
            banner
            style={{ marginBottom: 5 }}
          ></Alert>
        )}
        <Tabs type="card">
          <TabPane tab="基础信息" key="1">
            {baseItemArr.map((item) => (
              <DescriptionsCondition
                title={item.title}
                formItems={item.formItems}
                initialValues={detail}
              ></DescriptionsCondition>
            ))}
          </TabPane>
          <TabPane tab="供应商资质" key="2">
            <DescriptionsCondition
              formItems={intelligenceFormItem}
              initialValues={detail}
            ></DescriptionsCondition>
          </TabPane>
        </Tabs>
      </DrawerCondition>
      {/* 驳回原因 */}
      <RefuseModal
        cRef={cRef}
        visible={visibleRefuse}
        handleUpData={fetchVerifyReject}
        loading={loading}
        onClose={() => setVisibleRefuse(false)}
      ></RefuseModal>
    </>
  );
};

export default connect(({ loading, supplierAuth }) => ({
  total: supplierAuth.list.length,
  loading,
}))(SpecialGoodCheckDetail);
