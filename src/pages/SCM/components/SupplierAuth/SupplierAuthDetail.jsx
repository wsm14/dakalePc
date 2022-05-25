import React, { useState } from 'react';
import { connect } from 'umi';
import { Tabs, Alert } from 'antd';
import { BUS_BANKACCOUNT_TYPE } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const { TabPane } = Tabs;

const SpecialGoodCheckDetail = (props) => {
  const { visible, onClose, getDetail, loading, dispatch, total, cRef } = props;
  const { show = false, mode = 'check', detail = {}, index } = visible;

  const { newDataObject = {}, ownerBankBindingInfoRecordId } = detail;

  const [visibleRefuse, setVisibleRefuse] = useState(false); // 审核拒绝 下架原因

  // 审核通过
  const handleVerifyAllow = () => {
    dispatch({
      type: 'supplierSettlement/fetchAuditBankBindingInfo',
      payload: {
        ownerBankBindingInfoRecordId,
        auditResult: '1',
      },
      callback: () => {
        onClose();
        cRef.current.fetchGetData();
      },
    });
  };

  // 审核驳回
  const fetchSpecialGoodsStatus = (values) => {
    const { specialGoodsId, ownerIdString } = visibleRefuse.detail;
    dispatch({
      type: 'supplierSettlement/fetchSpecialGoodsStatus',
      payload: {
        ...values,
        id: specialGoodsId,
        ownerId: ownerIdString,
      },
      callback: () => {
        setVisibleRefuse(false);
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
          name: ['bankBindingObject', 'bankAccountType'],
          render: (val) => BUS_BANKACCOUNT_TYPE[val],
        },
        {
          label: '供应商名称',
          name: ['businessLicenseObject', 'businessLicenseImg'],
        },
        {
          label: '供应商ID',
          name: ['bankBindingObject', 'openAccountPermit'],
        },
        {
          label: '主营类目',
          name: ['bankBindingObject', 'cardName'],
        },
        {
          label: '所属地区',
          name: ['bankBindingObject', 'cardNo'],
        },
        {
          label: '详细地址',
          name: ['bankBindingObject', 'bankBranchName'],
        },
      ],
    },
    {
      title: '联系人信息',
      formItems: [
        {
          label: '联系人姓名',
          name: 'bankAddccountType',
        },
        {
          label: '联系人手机号',
          name: 'businessssLicenseImg',
        },
      ],
    },
    {
      title: '介绍人信息',
      formItems: [
        {
          label: '有无介绍人',
          name: 'bankAddccountType',
        },
        {
          label: '介绍人账号',
          name: 'businessssLicenseImg',
        },
      ],
    },
  ];

  // 供应商资质信息
  const intelligenceFormItem = [
    {
      label: '营业执照',
      type: 'upload',
      name: ['businessLicenseObject', 'businessLicenseImg'],
    },
    {
      label: '公司名称',
      name: ['bankBindingObject', 'openAccountPermit'],
    },
    {
      label: '统一社会信用代码',
      name: ['bankBindingObject', 'cardName'],
    },
    {
      label: '注册地址',
      name: ['bankBindingObject', 'cardNo'],
    },
    {
      label: '营业期限',
      name: ['bankBindingObject', 'bankBranchName'],
    },
    {
      label: '经营范围',
      name: ['bankBindingObject', 'provName'],
    },
    {
      label: '生产/经营许可证',
      type: 'upload',
      name: ['bankBindingObject', 'provCode'],
    },
    {
      label: '体系认证',
      type: 'upload',
      name: ['bankBindingObject', 'areaCode'],
    },
    {
      label: '产品认证',
      type: 'upload',
      name: ['bankBindingObject', 'certFrontPhoto'],
    },
    {
      label: '授权证书',
      type: 'upload',
      name: ['bankBindingObject', 'legalPerson'],
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
    loading,
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: mode === 'check' && <ExtraButton list={btnList}></ExtraButton>,
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <Alert message="仅本地使用" type="error" banner style={{ marginBottom: 5 }}></Alert>
        <Tabs type="card">
          <TabPane tab="基础信息" key="1">
            {baseItemArr.map((item) => (
              <DescriptionsCondition
                title={item.title}
                formItems={item.formItems}
                initialValues={newDataObject}
              ></DescriptionsCondition>
            ))}
          </TabPane>
          <TabPane tab="供应商资质" key="2">
            <DescriptionsCondition
              formItems={intelligenceFormItem}
              initialValues={newDataObject}
            ></DescriptionsCondition>
          </TabPane>
        </Tabs>
      </DrawerCondition>
      {/* 驳回原因 */}
      <RefuseModal
        cRef={cRef}
        visible={visibleRefuse}
        handleUpData={fetchSpecialGoodsStatus}
        loading={loading}
        onClose={() => setVisibleRefuse(false)}
      ></RefuseModal>
    </>
  );
};

export default connect(({ loading, supplierSettlement }) => ({
  total: supplierSettlement.list.length,
  loading: loading.effects['supplierSettlement/fetchGetBankBindingInfoRecordById'],
}))(SpecialGoodCheckDetail);
