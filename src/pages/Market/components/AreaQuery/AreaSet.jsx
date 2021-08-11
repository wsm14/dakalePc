import React from 'react';
import { connect } from 'umi';
import { Form, Modal } from 'antd';
import cityJson from '@/common/cityJson';
import TableDataBlock from '@/components/TableDataBlock';

const filterCity = () => {
  return cityJson
    .filter((i) => i.level === '1')
    .map((i) => ({
      ...i,
      value: i.id,
      label: i.name,
      children: cityJson
        .filter((c) => c.pid === i.id)
        .map((d) => ({
          ...d,
          value: d.id,
          label: d.name,
          children: cityJson
            .filter((g) => g.pid === d.id)
            .map((f) => ({
              ...f,
              label: f.name,
              value: f.id,
            })),
        })),
    }));
};

const AreaSet = (props) => {
  const { dispatch, visible, onClose, loading } = props;

  const [form] = Form.useForm();

  // table 表头
  const getColumns = [
    {
      title: '省/市/区',
      dataIndex: 'label',
    },
    {
      title: '签约价格',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: 'GDP',
      align: 'center',
      dataIndex: 'businessHub',
    },
    {
      title: '人口',
      align: 'center',
      dataIndex: 'topCategoryName',
    },
  ];

  return (
    <Modal
      title={`选择发布店铺`}
      destroyOnClose
      maskClosable
      width={1000}
      visible={visible}
      okText={`确定`}
      onOk={() => {}}
      onCancel={onClose}
      bodyStyle={{ height: 500, overflowY: 'auto' }}
    >
      <TableDataBlock
        noCard={false}
        pagination={false}
        size="middle"
        tableSize="small"
        columns={getColumns}
        loading={loading}
        rowKey={(record) => `${record.value}`}
        // dispatchType={dispatchType}
        list={filterCity()}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.manageCity,
}))(AreaSet);
