import React, { useRef } from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import NoticeImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import checkInDetailSet from './CheckInDetailSet';

const CheckInDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { type = 'text', styleType = 'share', record = '' } = visible;

  const childRef = useRef();

  // 新增 修改
  const handleCheckInDetailSet = (initialValues = {}) => {
    const { idString } = initialValues;
    dispatch({
      type: 'drawerForm/show',
      payload: checkInDetailSet({
        dispatch,
        childRef,
        initialValues,
        CeditType: type,
        record: { styleType, ...record, contentType: type },
        id: idString,
      }),
    });
  };

  // table
  const propItem = {
    text: {
      title: `${{ share: '分享文案', mark: '打卡文案' }[styleType]} - ${record.subIdentifyValue}`,
      getColumns: [
        {
          title: '文案',
          align: 'center',
          dataIndex: 'content',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'idString',
          render: (val, row) => (
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  auth: 'markImgEdit',
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
          dataIndex: 'idString',
          render: (val, row) => (
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  auth: 'shareTextEdit',
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
        btnExtra={
          {
            text: (
              <AuthConsumer auth="markTextAdd" show={detailList.list.length < 6}>
                <Button className="dkl_green_btn" onClick={() => handleCheckInDetailSet()}>
                  新增
                </Button>
              </AuthConsumer>
            ),
            image: (
              <AuthConsumer auth="shareImgAdd" show={detailList.list.length < 3}>
                <Button className="dkl_green_btn" onClick={() => handleCheckInDetailSet()}>
                  新增
                </Button>
              </AuthConsumer>
            ),
          }[type]
        }
        cRef={childRef}
        noCard={false}
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(row) => `${row.idString}`}
        params={{
          contentType: type,
          styleType,
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
