import React, { useState } from 'react';
import { connect } from 'umi';
import { HddOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal, Alert } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const ExcelWrite = (props) => {
  const { detailList, loading } = props;
  const [visible, setVisible] = useState(false);

  const getColumns = [
    {
      title: '文件名',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'detailTitle',
    },
    {
      title: '导出人',
      align: 'center',
      dataIndex: 'detailContent',
      render: (val) => val || '--',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'beanAmount',
      render: (val, row) => `${row.detailType === 'add' ? '+' : '-'}${val}`,
    },
    {
      title: '导出状态',
      align: 'center',
      dataIndex: 'detailType',
      render: (val) => (val === 'add' ? '收入' : '支出'),
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'identification',
      render: () => <a>下载</a>,
    },
  ];

  return (
    <div>
      <Tooltip placement="bottom" title={'导出记录'}>
        <Button
          type="primary"
          icon={<HddOutlined></HddOutlined>}
          onClick={() => setVisible(true)}
          size={'small'}
        />
      </Tooltip>
      <Modal
        title={'导出记录'}
        width={1150}
        destroyOnClose
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Alert message="您导出的文件生成后会暂存在阿里云上，三天后会自动删除" type="info" banner />
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          rowKey={(row, i) => `${row.createTime}${i}`}
          params={{ type: 'peas', userType: 'user' }}
          dispatchType=""
          size="middle"
          {...detailList}
        ></TableDataBlock>
      </Modal>
    </div>
  );
};

export default connect(({ accountUser, loading }) => ({
  detailList: accountUser.detailList,
  loading: loading.effects['accountUser/fetchDetailList'],
}))(ExcelWrite);
