import React, { useState, useEffect } from 'react';
import { Button, Drawer, Space, Card, Alert } from 'antd';
import Title from './title';
import { connect } from 'umi';
import DescriptionsCondition from '@/components/DescriptionsCondition';
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
import city from '@/common/city';

const filterCity = (proCode, areCode) => {
  if (proCode && areCode) {
    const proList = city.filter((item) => {
      return item.value == Number(proCode);
    })[0];
    const areList = proList['children'].filter((item) => {
      return item.value === areCode;
    })[0];
    return proList.label + '/' + areList.label;
  }
  return '';
};

const groupsDetails = (props) => {
  const { visible2, onClose, dispatch, merchantGroupId, groupDetails, saveVisible } = props;

  useEffect(() => {
    fetchGrounpDetails();
  }, []);

  const fetchGrounpDetails = () => {
    if (merchantGroupId) {
      dispatch({
        type: 'groupSet/fetchGrounpDetails',
        payload: {
          merchantGroupId,
        },
      });
    } else
      message.error({
        content: '参数错误',
      });
  };

  let tabList = [
    {
      key: 'tab1',
      tab: '集团信息',
    },
  ];
  if (groupDetails.merchantGroupDTO && groupDetails.merchantGroupDTO.bankStatus !== '0') {
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
      groupDetails.merchantGroupDTO &&
      (groupDetails.merchantGroupDTO.bankStatus === '3' ||
        groupDetails.merchantGroupDTO.bankStatus === '1')
    ) {
      return false;
    }
    return true;
  };
  const toastShow = () => {
    if (
      tabKey === 'tab2' &&
      groupDetails.merchantGroupDTO.bankStatus === '2' &&
      groupDetails.merchantGroupDTO.bankRejectReason
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
                  ((businessLicense && businessLicense.establishDate) || '') +
                  '-' +
                  ((businessLicense && businessLicense.validityPeriod) || ''),
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
                city: filterCity(bankBindingInfo.provCode, bankBindingInfo.areaCode),
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
  return (
    <>
      <Drawer
        title={`集团详情`}
        width={660}
        visible={visible2}
        destroyOnClose={true}
        onClose={onClose}
        bodyStyle={{ padding: 0 }}
        footer={
          btnShow() && (
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button
                  onClick={() => {
                    onClose();
                  }}
                >
                  取消
                </Button>
                <Button onClick={() => fetchGrounpGoBtn()} type="primary">
                  去修改
                </Button>
              </Space>
            </div>
          )
        }
      >
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
      </Drawer>
    </>
  );
};

export default connect(({ groupSet, loading }) => ({
  ...groupSet,
}))(groupsDetails);
