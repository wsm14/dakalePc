import React, { useRef, useState, useEffect } from 'react';
import { Modal, Alert } from 'antd';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';

const MreSelect = ({
  type = 'select',
  maxLength = 9999999,
  visible,
  keys = [],
  onOk,
  onCancel,
  userList = [],
  tableList = [],
  dispatch,
  dispatchType = 'userList/fetchGetList',
  params = {},
  loading,
  experLevel,
}) => {
  const childRef = useRef(); // 表格ref
  const [selectUser, setSelectUser] = useState([]); // 选中的店铺
  const [selectKey, setSelectKey] = useState([]);

  useEffect(() => {
    fetchGetExpertLevel();
  }, []);

  useEffect(() => {
    visible && type === 'select' && setSelectKey(keys);
  }, [visible]);

  // 获取哒人等级映射
  const fetchGetExpertLevel = () => {
    dispatch({
      type: 'baseData/fetchGetExpertLevel',
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '用户豆号',
      name: 'beanCode',
    },
    {
      label: '用户手机号',
      name: 'mobile',
    },
    {
      label: '用户ID',
      name: 'userIdString',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '昵称',
      dataIndex: 'username',
      ellipsis: true,
    },
    {
      title: '级别',
      dataIndex: 'level',
      render: (val) => experLevel[val],
    },
    {
      title: '豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      render: (val) => val || '小程序用户',
    },
    {
      title: 'ID',
      dataIndex: 'userIdString',
    },
    {
      title: '注册地',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectKey,
    onChange: (val, list) => {
      // 先去重处理 排除重复已选数据
      // 再对 已选的数据mreList和最新数据进行去重处理 获得去重后结果
      const obj = {};
      const newSelectList = [...userList, ...list]
        .reduce((item, next) => {
          next && obj[next.userIdString]
            ? ''
            : next && (obj[next.userIdString] = true && item.push(next));
          return item;
        }, [])
        .filter((item) => item && val.includes(item.userIdString));

      setSelectKey(val);
      setSelectUser(newSelectList);
    },
  };

  return (
    <Modal
      title={`${type === 'select' ? '选择用户' : '查看用户'}`}
      destroyOnClose
      maskClosable
      width={1000}
      visible={visible}
      footer={type === 'select' ? undefined : false}
      okText={`确定（已选${selectKey.length}项）`}
      okButtonProps={{ disabled: selectKey.length > maxLength }}
      onOk={() => {
        onOk({ keys: selectKey, list: selectUser, resultList: selectUser });
        onCancel();
      }}
      onCancel={onCancel}
    >
      <TableDataBlock
        order
        noCard={false}
        size="middle"
        tableSize="small"
        cRef={childRef}
        searchItems={searchItems}
        columns={getColumns}
        loading={loading.effects['userList/fetchGetList']}
        rowKey={(record) => `${record.userIdString}`}
        dispatchType={dispatchType}
        params={{ ...params }}
        rowSelection={type === 'select' ? rowSelection : undefined}
        {...tableList}
      ></TableDataBlock>
      {selectKey.length > maxLength && (
        <Alert
          type="error"
          message={`最多可选 ${maxLength} 项，当前已选 ${selectKey.length} 项，请检查`}
        ></Alert>
      )}
    </Modal>
  );
};

export default connect(({ userList, baseData, loading }) => ({
  tableList: userList.list,
  experLevel: baseData.experLevel,
  loading,
}))(MreSelect);
