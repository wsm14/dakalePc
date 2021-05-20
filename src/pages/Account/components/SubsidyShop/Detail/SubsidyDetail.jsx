import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';
import { SUBSIDY_TYPE, SUBSIDY_TASK_ROLE } from '@/common/constant';
import { Modal } from 'antd';

const SubsidyDetail = (props) => {
  const { onClose, visible } = props;

  const { show = false, info, type, titles } = visible;

  const getColumnsM = [
    {
      title: '店铺名称',
      align: 'center',
      dataIndex: 'merchantName',
      width: 280,
    },
    {
      title: '店铺账号',
      align: 'center',
      dataIndex: 'account',
    },
    {
      title: '所属商圈',
      align: 'center',
      dataIndex: 'businessHub',
    },
    {
      title: '所属行业',
      align: 'center',
      dataIndex: 'category',
    },
    {
      title: '地址',
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: '补贴/回收卡豆数',
      align: 'center',
      dataIndex: 'rechargeBeans',
    },
  ];

  const getColumns = [
    {
      title: '用户ID',
      align: 'center',
      dataIndex: 'userIdString',
    },
    {
      title: '用户昵称',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '用户手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '豆号',
      align: 'center',
      dataIndex: 'beanCode',
    },
    {
      title: '级别',
      align: 'center',
      dataIndex: 'levelName',
    },
    {
      title: '注册地',
      align: 'center',
      dataIndex: 'provinceName',
      render: (val, row) => `${val}-${row.cityName}-${row.districtName}`,
    },
    {
      title: ' 补贴/回收卡豆数',
      align: 'center',
      dataIndex: 'subsidyBean',
    },
  ];

  const modalProps = {
    title: `详情-${titles}-补贴/回收`,
    visible: show,
    width: 1000,
    onCancel: () => onClose(),
    footer: null,
  };

  return (
    <Modal {...modalProps}>
      <TableDataBlock
        order
        noCard={false}
        columns={type == 'merchant' ? getColumnsM : getColumns}
        rowKey={(record) => `${type == 'merchant' ? record.merchantId : record.userIdString}`}
        list={info}
      ></TableDataBlock>
    </Modal>
  );
};
export default SubsidyDetail;
