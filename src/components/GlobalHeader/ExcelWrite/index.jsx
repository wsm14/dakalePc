import React, { useState } from 'react';
import { connect } from 'umi';
import { HddOutlined } from '@ant-design/icons';
import { EXPORT_TYPE } from '@/common/constant';
import { Button, Tooltip, Modal, Alert } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const ExcelWrite = (props) => {
  const { excelList, loading } = props;
  const [visible, setVisible] = useState(false);

  const getColumns = [
    {
      title: '文件名',
      align: 'center',
      dataIndex: 'fileName',
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'type',
      render: (val) => EXPORT_TYPE[val],
    },
    {
      title: '导出人',
      align: 'center',
      dataIndex: 'exporter',
      render: (val) => val || '--',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '导出状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ['导出中', '导出完成'][val],
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'url',
      render: (val) => (
        <a href={val} >
          下载
        </a>
      ),
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
          rowKey={(row) => `${row.excelImportId}`}
          dispatchType="baseData/fetchimportExcelList"
          size="middle"
          {...excelList}
        ></TableDataBlock>
      </Modal>
    </div>
  );
};

export default connect(({ baseData, loading }) => ({
  excelList: baseData.excelList,
  loading: loading.effects['baseData/fetchimportExcelList'],
}))(ExcelWrite);
