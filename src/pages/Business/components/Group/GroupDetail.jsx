import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Alert, Tabs } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import {
  base,
  brand,
  businessLicense,
  login,
  message,
  shop,
  legal,
  activeByOne,
  activeByBank,
  activeByLegal,
} from './Details/detailsIndex';

const { TabPane } = Tabs;

const GroupsDetails = (props) => {
  const { visible, onClose, list, fetchGrounpDetails, loading } = props;

  const { show, index, detail = {} } = visible;

  const [tabKey, setTabKey] = useState('group');
  const [info, setDetail] = useState({}); // 详情保存
  /**
   * bankAccountType 账户类型
   * bankStatus 激活状态
   * bankRejectReason 激活失败原因
   */
  const { bankAccountType = 0, bankStatus, bankRejectReason } = info;

  const modalProps = {
    title: `集团详情`,
    visible: show,
    onClose,
    loading,
    dataPage: {
      current: index,
      total: list.length,
      onChange: (size) =>
        fetchGrounpDetails(size, (res) => {
          setTabKey('group');
          setDetail(res);
        }),
    },
    afterCallBack: () => setDetail(detail),
    footer: tabKey === 'group' && (
      <Button onClick={() => {}} type="primary">
        去修改
      </Button>
    ),
  };

  const showDome = {
    group: [
      { title: '基础信息', formItems: base },
      { title: '营业执照信息', formItems: businessLicense },
      { title: '登录信息', formItems: login },
      { title: '联系人信息', formItems: message },
      { title: '品牌信息', formItems: brand },
      { title: '店铺信息', formItems: shop },
    ],
    account: {
      1: [
        { title: '对公账户信息', formItems: activeByOne },
        { title: '法人信息', formItems: legal },
      ], // 对公
      2: [
        { title: '银行卡信息', formItems: activeByBank },
        { title: '结算人身份信息', formItems: activeByLegal },
      ], // 对私
    }[bankAccountType],
  };

  return (
    <DrawerCondition {...modalProps}>
      {bankStatus === '2' && bankRejectReason && (
        <Alert
          style={{ marginBottom: '12px' }}
          message={`失败原因：${bankRejectReason}`}
          type="error"
          showIcon
        />
      )}
      <Tabs onChange={setTabKey} type="card">
        <TabPane tab="集团信息" key="group">
          {showDome['group'].map((item, index) => (
            <DescriptionsCondition
              key={`group${index}`}
              {...item}
              initialValues={info}
            ></DescriptionsCondition>
          ))}
        </TabPane>
        {bankStatus && bankStatus !== '0' && (
          <TabPane tab="账户信息" key="account">
            {showDome['account']?.map((item, index) => (
              <DescriptionsCondition
                key={`account${index}`}
                {...item}
                initialValues={info}
              ></DescriptionsCondition>
            ))}
          </TabPane>
        )}
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ groupSet, loading }) => ({
  list: groupSet.list.list,
  loading: loading.effects['groupSet/fetchGrounpDetails'],
}))(GroupsDetails);
