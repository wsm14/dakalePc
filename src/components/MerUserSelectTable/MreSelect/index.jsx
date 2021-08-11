import React, { useRef, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import Search from './Search';

/**
 *
 * @param {Object} list 渲染的数组 { list:[], total:0 }
 * @returns
 */
const MreSelect = ({
  type = 'select',
  visible,
  keys = [],
  mreList = [],
  onOk,
  onCancel,
  searchShow = true,
  columns = null,
  subsidyList = [],
  dispatchType = 'businessList/fetchGetList',
  params = {},
  list = null,
  rowKey = 'userMerchantIdString',
  loading,
}) => {
  const childRef = useRef(); // 表格ref
  const [selectMre, setSelectMre] = useState([]); // 选中的店铺
  const [selectMreKey, setSelectMreKey] = useState([]);
  useEffect(() => {
    visible && type === 'select' && setSelectMreKey(keys);
  }, [visible]);

  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      ellipsis: true,
    },
    {
      title: '店铺账号',
      dataIndex: 'mobile',
    },
    {
      title: '所属商圈',
      dataIndex: 'businessHub',
    },
    {
      title: '经营类目',
      dataIndex: 'topCategoryName',
    },
    {
      title: '地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      ellipsis: true,
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectMreKey,
    getCheckboxProps: ({ bankStatus }) => ({
      disabled: !['3'].includes(bankStatus) , // 非激活状态
    }),
    onChange: (val, list) => {
      // 先去重处理 排除重复已选数据
      // 再对 已选的数据mreList和最新数据进行去重处理 获得去重后结果
      const obj = {};
      const newSelectList = [...mreList, ...list]
        .reduce((item, next) => {
          next && obj[next[rowKey]] ? '' : next && (obj[next[rowKey]] = true && item.push(next));
          return item;
        }, [])
        .filter((item) => item && val.includes(item[rowKey]));
      setSelectMreKey(val);
      setSelectMre(newSelectList);
    },
  };

  return (
    <Modal
      title={`${type === 'select' ? '选择发布店铺' : '查看店铺'}`}
      destroyOnClose
      maskClosable
      width={1000}
      visible={visible}
      footer={type === 'select' ? undefined : false}
      okText={`确定（已选${selectMreKey.length}项）`}
      onOk={() => {
        console.log(selectMreKey, selectMre, 'selectMre');
        onOk({ keys: selectMreKey, list: selectMre });
        onCancel();
      }}
      onCancel={onCancel}
    >
      {searchShow && <Search cRef={childRef}></Search>}
      <TableDataBlock
        order
        noCard={false}
        size="middle"
        tableSize="small"
        cRef={childRef}
        columns={columns ? columns : getColumns}
        loading={loading.effects[dispatchType]}
        rowKey={(record) => `${record[rowKey]}`}
        dispatchType={dispatchType}
        params={{ ...params, bankStatus: 3, businessStatus: 1 }}
        rowSelection={type === 'select' ? rowSelection : undefined}
        {...(list ? list : subsidyList)}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ businessList, loading }) => ({
  subsidyList: businessList.subsidyList,
  loading,
}))(MreSelect);
