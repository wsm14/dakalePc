import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Tabs, Button } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { BLINDBOX_PRIZE_TYPE, DAREN_TEMP_FLAG } from '@/common/constant';

import EditBean from './EditBean';

const Rule = (props) => {
  const { blindBoxRule, loading, dispatch } = props;

  const [visible, setVisible] = useState(false); // 设置 修改 详情
  const [keyType, setKeyType] = useState('bean');

  const { TabPane } = Tabs;

  useEffect(() => {
    callback(keyType);
  }, []);

  // 切换tab
  const callback = (key) => {
    dispatch({
      type: 'prizeConfig/fetchGetList',
      payload: {
        ruleType: key,
      },
    });
    setKeyType(key);
  };
  // 编辑规则按钮
  const operations = (
    <Button
      type="link"
      onClick={() => {
        editRule();
      }}
    >
      编辑规则
    </Button>
  );
  const editRule = () => {
    setVisible(true);
  };

  // table 表头
  const getColumns = [
    {
      title: '奖品ID',
      fixed: 'left',
      dataIndex: 'luckPrizeIdStr',
    },
    {
      title: '奖品类型',
      fixed: 'left',
      dataIndex: 'prizeType',
      render: (val) => BLINDBOX_PRIZE_TYPE[val],
    },
    {
      title: '中奖图',
      dataIndex: 'winPrizeImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖池图',
      dataIndex: 'prizeImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品名称',
      dataIndex: 'prizeName',
      ellipsis: true,
    },
    {
      title: '盲盒展示名称',
      dataIndex: 'prizeName',
      ellipsis: true,
    },
    {
      title: '抽中概率',
      dataIndex: 'probability',
      render: (val) => `${val*100}%`,
    },
    {
      title: '是否真实奖品',
      dataIndex: 'isJoinLuck',
      render: (val) => DAREN_TEMP_FLAG[val],
    },
  ];

  // 卡豆专场
  const base = [
    {
      label: '每次抽取所需卡豆',
      name: 'needBean',
    },
    {
      label: '盲盒背景图',
      type: 'upload',
      name: 'backGroundImg',
    },
    {
      label: '盲盒动效',
      type: 'otherUpload',
      name: 'dynamicEffect',
    },
    {
      label: '奖池',
      name: 'showPrizePoolList',
      render: (val) => (
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.luckPrizeIdStr}`}
          list={val}
          pagination={false}
        ></TableDataBlock>
      ),
    },
  ];

  // 邀请专场
  const baseInvitation = [
    {
      label: '助力获得免费次数',
      // name: { num, times },
      render: (val, record) => (
        <>
          每邀请 <b>{record?.num || 0}</b> 个新用户助力获得
          <b> {record?.times || 0}</b> 次。
        </>
      ),
    },
    {
      label: '奖池',
      name: 'showPrizePoolList',
      render: (val) => (
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.luckPrizeIdStr}`}
          list={val}
          pagination={false}
        ></TableDataBlock>
      ),
    },
  ];

  return (
    <>
      <Card size="small" title="APP盲盒规则配置" bordered={false}>
        <Tabs defaultActiveKey="bean" onChange={callback} tabBarExtraContent={operations}>
          <TabPane tab="卡豆专场" key="bean">
            <DescriptionsCondition
              formItems={base}
              initialValues={blindBoxRule}
            ></DescriptionsCondition>
          </TabPane>
          <TabPane tab="邀请专场" key="invitation">
            {/* 助力获得免费次数：每邀请 <b>{blindBoxRule?.num || 0}</b> 个新用户助力获得
            <b> {blindBoxRule?.times || 0}</b> 次。 */}
            <DescriptionsCondition
              formItems={baseInvitation}
              initialValues={blindBoxRule}
            ></DescriptionsCondition>
          </TabPane>
        </Tabs>
      </Card>
      {/* 规则编辑 */}
      <EditBean
        keyType={keyType}
        visible={visible}
        blindBoxRule={blindBoxRule}
        onClose={() => {
          setVisible(false);
        }}
        callBack={callback}
      ></EditBean>
    </>
  );
};

export default connect(({ prizeConfig, loading }) => ({
  blindBoxRule: prizeConfig.blindBoxRule,
  loading: loading.models.assistanceList,
}))(Rule);
