import React, { useRef, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import Search from './Search';

const MreSelect = ({
  type = 'select',
  visible,
  keys = [],
  mreList = [],
  onOk,
  onCancel,
  subsidyList = [],
  dispatchType = 'businessList/fetchGetList',
  params = {},
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
      dataIndex: 'account',
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
      dataIndex: 'provinceName',
      render: (val, record) => `${val}-${record.cityName}-${record.districtName}`,
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
    onChange: (val, list) => {
      // 先去重处理 排除重复已选数据
      // 再对 已选的数据mreList和最新数据进行去重处理 获得去重后结果
      const obj = {};
      const newSelectList = [...mreList, ...list]
        .reduce((item, next) => {
          next && obj[next.userMerchantIdString]
            ? ''
            : next && (obj[next.userMerchantIdString] = true && item.push(next));
          return item;
        }, [])
        .filter((item) => item && val.includes(item.userMerchantIdString));
      setSelectMreKey(val);
      setSelectMre(newSelectList);
    },
  };

  return (
    <Modal
      title={`${type === 'select' ? '选择发布店铺' : '查看店铺'}`}
      destroyOnClose
      maskClosable
      width={900}
      visible={visible}
      footer={type === 'select' ? undefined : false}
      okText={`确定（已选${selectMreKey.length}项）`}
      onOk={() => {
        onOk({ keys: selectMreKey, list: selectMre });
        onCancel();
      }}
      onCancel={onCancel}
    >
      <Search cRef={childRef}></Search>
      <TableDataBlock
        order
        noCard={false}
        size="middle"
        tableSize="small"
        cRef={childRef}
        columns={getColumns}
        loading={loading.effects['businessList/fetchGetList']}
        rowKey={(record) => `${record.userMerchantIdString}`}
        dispatchType={dispatchType}
        params={{ ...params, bankStatus: 3, businessStatus: 1 }}
        rowSelection={type === 'select' ? rowSelection : undefined}
        {...subsidyList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ businessList, loading }) => ({
  subsidyList: businessList.subsidyList,
  loading,
}))(MreSelect);
