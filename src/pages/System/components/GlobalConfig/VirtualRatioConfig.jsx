import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { VIRTUAL_CONFIG_TYPE, VIR_OPEN_STATE } from '@/common/constant';
import { getCityName } from '@/utils/utils';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import VirtualConfigSet from './Form/VirtualConfigSet';
import VirtualConfigDefaultSet from './Form/VirtualConfigDefaultSet';

const TabConfigure = (props) => {
  const { dispatch, loading, virList } = props;
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('default');

  const childRef = useRef();

  const getColumns = [
    {
      title: '下单方式名称',
      align: 'center',
      dataIndex: 'activityName',
      show: ['default'].includes(tabKey),
    },
    {
      title: '地区',
      dataIndex: 'cityCode',
      render: (val) => getCityName(val) || '--',
      ellipsis: true,
      show: ['scanPay'].includes(tabKey),
    },
    {
      title: '优惠活动名称',
      align: 'center',
      dataIndex: 'activityName',
      show: ['phoneBill', 'memberRecharge', 'assembly'].includes(tabKey),
    },
    {
      title: '最高抵扣比例',
      align: 'center',
      dataIndex: ['preferentialActivityRuleObject', 'maxBeanAndCoupon'],
      render: (val) => `${(Number(val) * 100).toFixed(0)}%`,
    },
    {
      title: '限优惠次数',
      align: 'center',
      dataIndex: ['preferentialActivityRuleObject', 'buyLimit'],
      render: (val) => (val === 0 ? '不限' : `每人${val}次`),
      show: ['phoneBill', 'memberRecharge'].includes(tabKey),
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'startDate',
      render: (val, row) => `${val}~${row.endDate}`,
      show: ['phoneBill', 'memberRecharge'].includes(tabKey),
    },
    {
      title: '更新人',
      align: 'center',
      dataIndex: 'updater',
    },
    {
      title: '最后更新时间',
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: '启用状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => VIR_OPEN_STATE[val],
      show: ['phoneBill', 'memberRecharge'].includes(tabKey),
    },
    {
      type: 'handle',
      align: 'center',
      fixed: 'right',
      dataIndex: 'preferentialActivityId',
      render: (val, row) => [
        {
          type: 'edit',
          visible: row.status !== '2',
          click: () => {
            handleDetail(val, 'edit');
          },
        },
        {
          type: 'info',
          click: () => {
            handleDetail(val, 'info');
          },
        },
      ],
    },
  ];

  // 获取详情
  const handleDetail = (preferentialActivityId, type) => {
    dispatch({
      type: 'globalConfig/fetchGetPreferentialActivityById',
      payload: {
        preferentialActivityId,
      },
      callback: (detail) => {
        setVisible({
          show: true,
          type,
          initialValues: detail,
        });
      },
    });
  };

  const cardBtnList = [
    {
      type: 'save',
      text: '新增',
      onClick: () => {
        setVisible({
          show: true,
          type: 'add',
          initialValues: { type: tabKey, ruleType: '0', status: 0 },
        });
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        content={
          <div style={{ color: '#ccc' }}>
            {
              '说明：如话费充值卡豆最高可抵比例为8%，则用户卡豆充足时，购买100元的话费，最多可用卡豆或优惠券抵扣8元，剩余92元须使用现金。'
            }
          </div>
        }
        cardProps={{
          title: '虚拟商品优惠比例配置',
          tabList: Object.keys(VIRTUAL_CONFIG_TYPE['default']).map((i) => ({
            key: i,
            tab: VIRTUAL_CONFIG_TYPE['default'][i],
          })),
          activeTabKey: tabKey,
          onTabChange: (key) => {
            setTabKey(key);
            childRef?.current?.fetchGetData({ type: key, page: 1, limit: 10 });
          },
          extra: tabKey !== 'default' && <ExtraButton list={cardBtnList}></ExtraButton>,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        pagination={!['default'].includes(tabKey)}
        rowKey={(record) => `${record.preferentialActivityId}`}
        params={{ type: tabKey }}
        dispatchType={
          ['default'].includes(tabKey)
            ? 'globalConfig/fetchGetDefaultPreferentialActivity'
            : 'globalConfig/fetchPagePreferentialActivity'
        }
        {...virList}
      />
      {!['default'].includes(tabKey) && (
        <VirtualConfigSet
          visible={visible}
          childRef={childRef}
          tabKey={tabKey}
          onClose={() => setVisible(false)}
        />
      )}
      {['default'].includes(tabKey) && (
        <VirtualConfigDefaultSet
          visible={visible}
          childRef={childRef}
          onClose={() => setVisible(false)}
        />
      )}
    </>
  );
};

export default connect(({ loading, globalConfig }) => ({
  virList: globalConfig.virList,
  loading: loading.models.globalConfig,
}))(TabConfigure);
