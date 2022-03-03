import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import { BLINDBOX_PRIZE_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

/**
 * 盲盒商品选择列表
 * @param {Boolean} visible 开启关闭状态
 * @param {Array} selectList 已选数据原数组
 * @param {Function} onOk 确认回调 返回已选的所有数据
 * @param {Function} onCancel 取消关闭
 * @param {Object} data 可覆盖已选数据每一项的参数
 * @param {String} rowKey 数据唯一id
 * @returns
 */
const GroupSelect = ({
  childRef,
  blindBox = [],
  visible,
  selectList = [],
  onOk,
  onCancel,
  data = {},
  rowKey = 'luckPrizeIdStr',
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
      name: 'prizeType',
      select: BLINDBOX_PRIZE_TYPE,
    },
    {
      label: '奖品名称',
      name: 'prizeName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '奖品ID',
      dataIndex: 'luckPrizeIdStr',
    },
    {
      title: '奖品类型',
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
    },
    {
      title: '是否真实奖品',
      dataIndex: 'isJoinLuck',
      render: (val) => ['否', '是'][val],
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectGroupKey,
    getCheckboxProps: ({ isJoinLuck }) => ({
      disabled: ['0'].includes(isJoinLuck) && data?.isNovice === 1, // 是否真实奖品 0-否 1-是 默认值1
    }),
    onChange: (val, list) => {
      setSelectGroupKey(val);
      setSelectGroup(list);
    },
  };

  return (
    <Modal
      title="选择商品"
      destroyOnClose
      maskClosable
      width={1000}
      bodyStyle={{ maxHeight: 600, overflowY: 'auto' }}
      visible={visible}
      confirmLoading={loading}
      okText={`确定（已选${selectGroupKey.length}项）`}
      onOk={() => {
        onOk(
          selectGroup.map((item) => ({ ...item, ...data })),
          () => {
            onCancel();
            childRef && childRef.current.fetchGetData();
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
        pagination={false}
        list={blindBox}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ prizeConfig, loading }) => ({
  blindBox: prizeConfig.blindBox,
  loading:
    loading.effects['prizeConfig/fetchBlindBoxList'] ||
    loading.effects['prizeConfig/fetchSetLuckDrawConfig'],
}))(GroupSelect);
