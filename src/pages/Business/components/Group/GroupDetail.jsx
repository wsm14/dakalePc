import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Input, Alert, Tabs } from 'antd';
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
  const { visible, onClose, dispatch, list, fetchGrounpDetails, loading, loadingBank } = props;

  const { show, index, detail = {} } = visible;

  const [tabKey, setTabKey] = useState('group');
  const [info, setDetail] = useState({}); // 详情保存
  /**
   * bankAccountType 账户类型
   * bankStatus 激活状态
   * bankRejectReason 激活失败原因
   */
  const { bankAccountType = 0, bankStatus, bankRejectReason } = info;

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
            {bankStatus === '3' && (
              <Form style={{ marginTop: 24 }} preserve={false} onFinish={fetchMerSetBandCode}>
                <Form.Item
                  label="开户行号"
                  name="bankSwiftCode"
                  rules={[{ required: true, message: '请输入开户行号' }]}
                >
                  <Input placeholder="请输入开户行号"></Input>
                </Form.Item>
                <Button
                  style={{ marginLeft: 80 }}
                  type="primary"
                  loading={loadingBank}
                  htmlType="submit"
                >
                  保存
                </Button>
              </Form>
            )}
          </TabPane>
        )}
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ groupSet, loading }) => ({
  list: groupSet.list.list,
  loading: loading.effects['groupSet/fetchGrounpDetails'],
  loadingBank: loading.effects['businessList/fetchMerSetBandCode'],
}))(GroupsDetails);
