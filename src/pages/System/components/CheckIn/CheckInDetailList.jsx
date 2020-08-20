import React, { useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import NoticeImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import checkInDetailSet from './CheckInDetailSet';

const CheckInDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { type = 'text', record = '' } = visible;

  const childRef = useRef();

  // 新增 修改
  const handlePeasShareSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: checkInDetailSet({ dispatch, childRef, initialValues, CeditType: type }),
    });
  };

  // table
  const propItem = {
    text: {
      title: `文案素材`,
      rowKey: '',
      getColumns: [
        {
          title: '分享文案',
          align: 'center',
          dataIndex: 'userId',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'process',
          render: (val) => (
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  click: () => handlePeasShareSet(record),
                },
              ]}
            />
          ),
        },
      ],
    },
    img: {
      title: `图片素材`,
      rowKey: '',
      getColumns: [
        {
          title: '分享图片',
          align: 'center',
          dataIndex: 'userId',
          render: (val) => <NoticeImgShow url={val} />,
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'processs',
          render: (val, record) => (
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  click: () => handlePeasShareSet(record),
                },
              ]}
            />
          ),
        },
      ],
    },
  }[type];

  return (
    <Modal
      title={propItem.title}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <DataTableBlock
        cRef={childRef}
        CardNone={false}
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(row) => `${row[propItem.rowKey]}`}
        params={{ type }}
        dispatchType="sysCheckIn/fetchDetailList"
        componentSize="middle"
        {...detailList}
        list={[{ name: 1 }]}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ sysCheckIn, loading }) => ({
  detailList: sysCheckIn.detailList,
  loading: loading.effects['sysCheckIn/fetchDetailList'],
}))(CheckInDetailList);
