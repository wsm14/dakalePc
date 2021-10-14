import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { BLINDBOX_PRIZE_TYPE, DAREN_TEMP_FLAG } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import ConfigureFrawerSet from './Form/ConfigureFrawerSet';
const Jackpot = (props) => {
  const { blindBox, loading, dispatch } = props;

  const tableRef = useRef();
  const [visible, setVisible] = useState(false);

  // table 表头
  const getColumns = [
    {
      title: '奖品ID',
      dataIndex: 'id',
    },
    {
      title: '奖品类型',
      dataIndex: 'type',
      render: (val) => BLINDBOX_PRIZE_TYPE[val],
    },
    {
      title: '奖品',
      dataIndex: 'prize',
      ellipsis: true,
    },
    {
      title: '盲盒展示名称',
      dataIndex: 'showName',
      ellipsis: true,
    },
    {
      title: '中奖图',
      dataIndex: 'winningImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品图',
      dataIndex: 'prizeImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '是否真实奖品',
      dataIndex: 'isParticipate',
      render: (val) => DAREN_TEMP_FLAG[val],
    },
    {
      type: 'handle',
      dataIndex: 'id',
      render: (val, row) => [
        {
          type: 'edit',
          auth: 'true',
          click: () =>
            setVisible({
              show: true,
              type: 'edit',
              detail: { ...row, isParticipate: Boolean(Number(row?.isParticipate)) },
            }),
        },
        {
          type: 'del',
          auth: 'true',
          click: () => fetchBlindBoxDelete({ id: val }),
        },
      ],
    },
  ];
  // 删除
  const fetchBlindBoxDelete = (payload) => {
    dispatch({
      type: 'prizeConfig/fetchBlindBoxDelete',
      payload,
      callback: tableRef.current.fetchGetData,
    });
  };
  return (
    <>
      <TableDataBlock
        cardProps={{
          title: '盲盒奖池配置',
          bordered: false,
          extra: (
            <Button type="primary" onClick={() => setVisible({ show: true })}>
              新增
            </Button>
          ),
        }}
        cRef={tableRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.id}`}
        dispatchType="prizeConfig/fetchBlindBoxList"
        pagination={false}
        list={blindBox}
      ></TableDataBlock>
      {/* 奖池配置 */}
      <ConfigureFrawerSet visible={visible} childRef={tableRef} onClose={() => setVisible(false)} />
    </>
  );
};

export default connect(({ prizeConfig, loading }) => ({
  blindBox: prizeConfig.blindBox,
  loading: loading.effects['prizeConfig/fetchBlindBoxList'],
}))(Jackpot);
