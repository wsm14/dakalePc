import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Tabs, Button } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { BLINDBOX_PRIZE_TYPE } from '@/common/constant';
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
      type: 'UpdateBlindBoxRule/fetchGetList',
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
      dataIndex: 'id',
    },
    {
      title: '奖品类型',
      fixed: 'left',
      dataIndex: 'type',
      render: (val) => BLINDBOX_PRIZE_TYPE[val],
    },
    {
      title: '中奖图',
      dataIndex: 'winningImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖池图',
      dataIndex: 'winningImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品名称',
      dataIndex: 'prize',
      ellipsis: true,
    },
    {
      title: '盲盒展示名称',
      dataIndex: 'showName',
      ellipsis: true,
    },
    {
      title: '抽中概率',
      dataIndex: 'rate',
    },
    {
      title: '是否真实奖品',
      dataIndex: 'isParticipate',
      render: (val) => (val = 1 ? '是' : '仅展示'),
    },
  ];

  const base = [
    {
      label: '每次抽取所需卡豆',
      name: 'bean',
    },
    {
      label: '盲盒背景图',
      type: 'upload',
      name: 'backImg',
    },
    {
      label: '盲盒动效',
      type: 'otherUpload',
      name: 'backFile',
    },
    {
      label: '奖池',
      name: 'participateBlindBoxProducts',
      render: (val) => (
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.id}`}
          list={val}
        ></TableDataBlock>
      ),
    },
  ];

  // useEffect(() => {}, []);

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
            助力获得免费次数：每邀请 <b>{blindBoxRule.num}</b> 个新用户助力获得
            <b> {blindBoxRule.times}</b> 次。
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
      ></EditBean>
    </>
  );
};

export default connect(({ UpdateBlindBoxRule, loading }) => ({
  blindBoxRule: UpdateBlindBoxRule.blindBoxRule,
  loading: loading.models.assistanceList,
}))(Rule);
