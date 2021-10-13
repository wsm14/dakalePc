import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import { BLINDBOX_PRIZE_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

/**
 * 盲盒商品选择列表
 * @param {Object} list 渲染的数组 { list:[], total:0 }
 * @returns
 */
const GroupSelect = ({
  childRef,
  blindBox = [],
  visible,
  selectList = [],
  onOk,
  onCancel,
  rowKey = 'id',
  loading,
}) => {
  const [selectGroup, setSelectGroup] = useState([]); // 选中的商品
  const [selectGroupKey, setSelectGroupKey] = useState([]);

  useEffect(() => {
    if (visible) {
      setSelectGroup(selectList);
      setSelectGroupKey(selectList.map((item) => `${item[rowKey]}`));
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '奖品类型',
      type: 'select',
      name: 'type',
      select: BLINDBOX_PRIZE_TYPE,
    },
    {
      label: '奖品名称',
      name: 'prize',
    },
  ];

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
      title: '中奖图',
      dataIndex: 'winningImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖池图',
      dataIndex: 'prizeImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品名称',
      dataIndex: 'showName',
    },
    {
      title: '是否真实奖品',
      dataIndex: 'isParticipate',
      render: (val) => ['否', '是'][val],
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectGroupKey,
    getCheckboxProps: ({ isParticipate }) => ({
      disabled: ['0'].includes(isParticipate), // 是否真实奖品 0-否 1-是 默认值1
    }),
    onChange: (val, list) => {
      setSelectGroupKey(val);
      setSelectGroup(list);
    },
  };

  return (
    <Modal
      title="新增"
      destroyOnClose
      maskClosable
      width={1000}
      visible={visible}
      confirmLoading={loading}
      okText={`确定（已选${selectGroupKey.length}项）`}
      onOk={() => {
        // isNovice 是否属于新手必中奖池 0-否 1-是 默认值0
        onOk(
          selectGroup.map((item) => ({ ...item, isNovice: 1 })),
          () => {
            onCancel();
            childRef.current.fetchGetData();
          },
        );
      }}
      onCancel={onCancel}
    >
      <TableDataBlock
        noCard={false}
        size="middle"
        tableSize="small"
        searchItems={searchItems}
        columns={getColumns}
        loading={loading}
        rowKey={(record) => `${record[rowKey]}`}
        dispatchType={'prizeConfig/fetchBlindBoxList'}
        rowSelection={rowSelection}
        list={blindBox}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ prizeConfig, loading }) => ({
  blindBox: prizeConfig.blindBox,
  loading:
    loading.effects['prizeConfig/fetchBlindBoxList'] ||
    loading.effects['prizeConfig/fetchBlindBoxConfigSet'],
}))(GroupSelect);
