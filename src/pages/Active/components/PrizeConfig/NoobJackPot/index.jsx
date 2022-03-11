import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { BLINDBOX_PRIZE_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import PrizeSelectModal from './PrizeSelectModal';
import TableDataBlock from '@/components/TableDataBlock';

const NoobJackPot = (props) => {
  const { blindBoxRule, loading, dispatch } = props;

  const { showPrizePoolList: list } = blindBoxRule;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // table 表头
  const getColumns = [
    {
      title: '奖品ID',
      dataIndex: 'luckPrizeIdStr',
    },
    {
      title: '奖品类型',
      align: 'center',
      dataIndex: 'prizeType',
      render: (val) => BLINDBOX_PRIZE_TYPE[val],
    },
    {
      title: '中奖图',
      dataIndex: 'winPrizeImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品图',
      dataIndex: 'prizeImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品名称',
      align: 'center',
      dataIndex: 'prizeName',
    },
    {
      type: 'handle',
      dataIndex: 'probability',
      render: (val, row) => {
        return [
          {
            type: 'del',
            auth: true,
            click: () =>
              handleBlindConfigSet(
                list.filter((item) => item.luckPrizeIdStr !== row.luckPrizeIdStr),
                childRef.current.fetchGetData,
              ),
          },
        ];
      },
    },
  ];

  // 规则配置
  const handleBlindConfigSet = (lists, callback) => {
    dispatch({
      type: 'prizeConfig/fetchSetLuckDrawConfig',
      payload: {
        ruleType: 'novice',
        allBlindBoxProducts: lists,
      },
      callback,
    });
  };

  return (
    <>
      <TableDataBlock
        cardProps={{
          title: '新手必中奖池',
          bordered: false,
          extra: (
            <Button type="primary" onClick={() => setVisible(true)}>
              新增
            </Button>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        params={{ ruleType: 'novice' }}
        rowKey={(record) => `${record.luckPrizeIdStr}`}
        dispatchType="prizeConfig/fetchGetList"
        pagination={false}
        list={list}
      ></TableDataBlock>
      {/* 新增 */}
      <PrizeSelectModal
        childRef={childRef}
        visible={visible}
        selectList={list}
        // data={{ isNovice: 1 }} // 覆盖数据 isNovice 是否属于新手必中奖池 0-否 1-是 这里是新手奖池
        onOk={handleBlindConfigSet}
        onCancel={() => setVisible(false)}
      ></PrizeSelectModal>
    </>
  );
};

export default connect(({ prizeConfig, loading }) => ({
  blindBoxRule: prizeConfig.blindBoxRule,
  loading: loading.effects['prizeConfig/fetchGetList'],
}))(NoobJackPot);
