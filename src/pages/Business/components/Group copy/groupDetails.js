import React, { useState } from 'react';
import { Button, Card, Alert, message } from 'antd';
import Title from './title';
import { connect } from 'umi';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
import {
  base,
  user,
  userDetails,
  shopDetails,
  active,
  legal,
  management,
  activeByOne,
  activeByBank,
  activeByLegal,
} from './details/detailsIndex';

const groupsDetails = (props) => {
  const {
    visible2,
    onClose,
    dispatch,
    groupDetails,
    saveVisible,
    loading,
    list,
    merchantGroupIdIndex,
  } = props;

  const fetchGrounpDetails = (size) => {
    dispatch({
      type: 'groupSetCopy/save',
      payload: {
        merchantGroupIdIndex: size,
      },
    });
    setTabKey('tab1');
    const { merchantGroupIdString: merchantGroupId } = list.list[size];
    if (merchantGroupId) {
      dispatch({
        type: 'groupSetCopy/fetchGrounpDetails',
        payload: {
          merchantGroupId,
        },
      });
    } else {
      message.error({
        content: '参数错误',
      });
    }
  };

  let tabList = [
    {
      key: 'tab1',
      tab: '集团信息',
    },
  ];
  if (groupDetails?.merchantGroupDTO?.bankStatus !== '0') {
    tabList = [
      {
        key: 'tab1',
        tab: '集团信息',
      },
      {
        key: 'tab2',
        tab: '账户信息',
      },
    ];
  }
  const { businessLicense = {}, bankBindingInfo = {}, merchantGroupDTO = {} } = groupDetails;
  const [tabKey, setTabKey] = useState('tab1');
  const btnShow = () => {
    if (
      tabKey === 'tab2' &&
      (groupDetails?.merchantGroupDTO?.bankStatus === '3' ||
        groupDetails?.merchantGroupDTO?.bankStatus === '1')
    ) {
      return false;
    }
    return true;
  };
  const toastShow = () => {
    if (
      tabKey === 'tab2' &&
      groupDetails?.merchantGroupDTO?.bankStatus === '2' &&
      groupDetails?.merchantGroupDTO?.bankRejectReason
    ) {
      return true;
    }

    return false;
  };
  const fetchGrounpGoBtn = () => {
    if (tabKey === 'tab1') {
      saveVisible({
        visible2: false,
        visible: true,
      });
    } else {
      saveVisible({
        visible2: false,
        visible1: true,
      });
    }
  };
  const panelList = {
    tab1: [
      {
        title: '基础信息',
        form: (
          <DescriptionsCondition
            formItems={base}
            initialValues={{ ...merchantGroupDTO }}
          ></DescriptionsCondition>
        ),
        showArrow: false,
        disabled: true,
      },
      {
        title: '品牌信息',
        form: (
          <DescriptionsCondition
            formItems={management}
            initialValues={{ ...merchantGroupDTO }}
          ></DescriptionsCondition>
        ),
      },
      {
        title: '登录信息',
        form: (
          <DescriptionsCondition
            formItems={user}
            initialValues={{ ...merchantGroupDTO }}
          ></DescriptionsCondition>
        ),
        showArrow: false,
        disabled: true,
      },
      {
        title: '联系人信息',
        form: (
          <DescriptionsCondition
            formItems={userDetails}
            initialValues={{ ...merchantGroupDTO }}
          ></DescriptionsCondition>
        ),
        showArrow: false,
        disabled: true,
      },
      {
        title: '店铺信息',
        form: (
          <DescriptionsCondition
            formItems={shopDetails}
            initialValues={{ ...merchantGroupDTO }}
          ></DescriptionsCondition>
        ),
      },
    ],
    tab2: {
      1: [
        {
          title: '对公账户信息',
          form: (
            <DescriptionsCondition
              formItems={active}
              initialValues={{
                ...businessLicense,
                ...bankBindingInfo,
              }}
            ></DescriptionsCondition>
          ),
          showArrow: false,
          disabled: true,
        },
        {
          title: '法人信息',
          form: (
            <DescriptionsCondition
              formItems={legal}
              initialValues={{
                ...businessLicense,
                ...bankBindingInfo,
                activeBeginDate:
                  ((bankBindingInfo && bankBindingInfo.startDate) || '') +
                  '-' +
                  ((bankBindingInfo && bankBindingInfo.legalCertIdExpires) || ''),
              }}
            ></DescriptionsCondition>
          ),
          showArrow: false,
          disabled: true,
        },
      ],
      2: [
        {
          title: '对私账户信息',
          form: (
            <DescriptionsCondition
              formItems={activeByOne}
              initialValues={{
                ...businessLicense,
                ...bankBindingInfo,
                activeValidity:
                  ((businessLicense && businessLicense.validityPeriod) || '') +
                  '-' +
                  ((businessLicense && businessLicense.establishDate) || ''),
              }}
            ></DescriptionsCondition>
          ),
          showArrow: false,
          disabled: true,
        },
        {
          title: '银行卡信息',
          form: (
            <DescriptionsCondition
              formItems={activeByBank}
              initialValues={{
                ...businessLicense,
                ...bankBindingInfo,
              }}
            ></DescriptionsCondition>
          ),
          showArrow: false,
          disabled: true,
        },
        {
          title: '结算人身份信息',
          form: (
            <DescriptionsCondition
              formItems={activeByLegal}
              initialValues={{
                ...businessLicense,
                ...bankBindingInfo,
                activeBeginDate:
                  ((bankBindingInfo && bankBindingInfo.startDate) || '') +
                  '-' +
                  ((bankBindingInfo && bankBindingInfo.legalCertIdExpires) || ''),
              }}
            ></DescriptionsCondition>
          ),
          showArrow: false,
          disabled: true,
        },
      ],
    }[merchantGroupDTO.bankAccountType],
  }[tabKey];

  const modalProps = {
    title: `集团详情`,
    visible: visible2,
    onClose,
    bodyStyle: { padding: loading ? 24 : 0 },
    loading: loading,
    dataPage: {
      current: merchantGroupIdIndex,
      total: list.list.length,
      onChange: (size) => fetchGrounpDetails(size),
    },
    afterCallBack: () => fetchGrounpDetails(merchantGroupIdIndex),
    footer: btnShow() && (
      <Button onClick={() => fetchGrounpGoBtn()} type="primary">
        去修改
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <Card
        bordered={false}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={(key) => setTabKey(key)}
      >
        {toastShow() && (
          <Alert
            style={{ marginBottom: '12px' }}
            message={`失败原因：${merchantGroupDTO.bankRejectReason || ''}`}
            type="error"
            showIcon
          />
        )}
        <Title panelList={panelList}></Title>
      </Card>
    </DrawerCondition>
  );
};

export default connect(({ groupSetCopy, loading }) => ({
  ...groupSetCopy,
  loading: loading.effects['groupSetCopy/fetchGrounpDetails'],
}))(groupsDetails);
