import React, { useRef } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import NoticeImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import checkInDetailSet from './CheckInDetailSet';

const CheckInDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { type = 'text', record = '' } = visible;

  const childRef = useRef();

  // 新增 修改
  const handleCheckInDetailSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: checkInDetailSet({
        dispatch,
        childRef,
        initialValues,
        CeditType: type,
        configMarkId: record.markConfigIdString,
      }),
    });
  };

  // table
  const propItem = {
    text: {
      title: `文案素材 - ${record.subIdentifyValue}`,
      getColumns: [
        {
          title: '分享文案',
          align: 'center',
          dataIndex: 'content',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'identify',
          render: (val, row) => (
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  click: () => handleCheckInDetailSet(row),
                },
              ]}
            />
          ),
        },
      ],
    },
    image: {
      title: `图片素材 - ${record.subIdentifyValue}`,
      getColumns: [
        {
          title: '分享图片',
          align: 'center',
          dataIndex: 'content',
          render: (val) => <NoticeImgShow url={val} />,
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'identify',
          render: (val, row) => (
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  click: () => handleCheckInDetailSet(row),
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
        rowKey={(row) => `${row.content}`}
        params={{
          contentType: type,
          identify: record.identify,
          subIdentify: record.subIdentify,
        }}
        dispatchType="sysCheckIn/fetchDetailList"
        componentSize="middle"
        {...detailList}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ sysCheckIn, loading }) => ({
  detailList: sysCheckIn.detailList,
  loading: loading.effects['sysCheckIn/fetchDetailList'],
}))(CheckInDetailList);
