import React, { useRef } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import NoticeImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import checkInDetailSet from './CheckInDetailSet';

const CheckInDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { type = 'words', record = '' } = visible;

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
    words: {
      title: `文案素材 - ${record.markDesc}`,
      getColumns: [
        {
          title: '分享文案',
          align: 'center',
          dataIndex: 'content',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'configMarkContentIdString',
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
      title: `图片素材 - ${record.markDesc}`,
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
          dataIndex: 'configMarkContentIdString',
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
        btnExtra={
          {
            words: detailList.list.length < 6 && (
              <Button className="dkl_green_btn" onClick={() => handleCheckInDetailSet()}>
                新增
              </Button>
            ),
            image: detailList.list.length < 3 && (
              <Button className="dkl_green_btn" onClick={() => handleCheckInDetailSet()}>
                新增
              </Button>
            ),
          }[type]
        }
        CardNone={false}
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(row) => `${row.configMarkContentIdString}`}
        params={{ type, configMarkId: record.markConfigIdString }}
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
