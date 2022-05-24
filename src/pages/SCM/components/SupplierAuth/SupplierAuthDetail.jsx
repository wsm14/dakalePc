import React, { useState } from 'react';
import { connect } from 'umi';
import { BUS_BANKACCOUNT_TYPE } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import DrawerCondition from '@/components/DrawerCondition';
import PopImgShow from '@/components/PopImgShow';
import ExtraButton from '@/components/ExtraButton';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SpecialGoodCheckDetail = (props) => {
  const { visible, onClose, loading, dispatch, cRef } = props;
  const { show = false, type = 'check', detail = {} } = visible;
  const {
    newDataObject = {},
    originalDataObject = {},
    operationType,
    ownerBankBindingInfoRecordId,
  } = detail;

  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因

  // 审核通过
  const handleVerifyAllow = () => {
    dispatch({
      type: 'bankChangeCheck/fetchAuditBankBindingInfo',
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
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload: {
        ...values,
        id: specialGoodsId,
        ownerId: ownerIdString,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  const formItemsNew = [
    {
      label: '账户类型',
      name: ['bankBindingObject', 'bankAccountType'],
      render: (val) => BUS_BANKACCOUNT_TYPE[val],
    },
    {
      label: '营业执照',
      name: ['businessLicenseObject', 'businessLicenseImg'],
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      label: '开户许可证',
      name: ['bankBindingObject', 'openAccountPermit'],
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      label: '开户名',
      name: ['bankBindingObject', 'cardName'],
    },
    {
      label: '银行卡号',
      name: ['bankBindingObject', 'cardNo'],
    },
    {
      label: '开户银行',
      name: ['bankBindingObject', 'bankBranchName'],
    },
    {
      label: '开户城市',
      name: ['bankBindingObject', 'provName'],
      render: (val, record) => `${val}-${record?.bankBindingObject?.areaName}`,
    },
    {
      label: '省份编码',
      name: ['bankBindingObject', 'provCode'],
    },
    {
      label: '地区编码',
      name: ['bankBindingObject', 'areaCode'],
    },
    {
      label: '法人身份证',
      name: ['bankBindingObject', 'certFrontPhoto'],
      render: (val, record) => (
        <>
          <PopImgShow url={val}></PopImgShow>
          <PopImgShow url={record?.bankBindingObject?.certReversePhoto}></PopImgShow>
        </>
      ),
    },
    {
      label: '法人姓名',
      name: ['bankBindingObject', 'legalPerson'],
    },
    {
      label: '法人身份证号',
      name: ['bankBindingObject', 'legalCertId'],
    },
    {
      label: '法人身份证有效期',
      name: ['bankBindingObject', 'legalCertIdExpires'],
    },
    {
      label: '法人手机号',
      name: ['bankBindingObject', 'legalMp'],
    },
    {
      label: '凭证',
      name: ['bankBindingObject', 'additionalVoucher'],
      render: (val, record) => (
        <>
          <PopImgShow url={val}></PopImgShow>
          {record?.bankBindingObject?.additionalDesc || ''}
        </>
      ),
    },
    {
      label: '申请人姓名',
      name: 'applicantName',
    },
    {
      label: '申请人手机号',
      name: 'applicantMobile',
    },
    {
      label: '申请人账号',
      name: 'applicantAccount',
    },
  ];

  const btnList = [
    {
      auth: 'check',
      onClick: handleVerifyAllow,
      text: '审核通过',
      show: type === 'check',
    },
    {
      auth: 'check',
      onClick: handleVerifyAllow,
      typeBtn: 'default',
      text: '审核驳回',
      show: type === 'check',
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: type === 'check' ? '审核' : '详情',
    visible: show,
    loading,
    onClose,
    footer: <ExtraButton list={btnList}></ExtraButton>,
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <DescriptionsCondition
          title="修改后"
          formItems={formItemsNew}
          initialValues={newDataObject}
        ></DescriptionsCondition>
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

export default connect(({ loading }) => ({
  loading: loading.effects['bankChangeCheck/fetchGetBankBindingInfoRecordById'],
}))(SpecialGoodCheckDetail);
