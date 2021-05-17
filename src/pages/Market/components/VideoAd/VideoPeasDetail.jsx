import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const VideoPeasDetail = (props) => {
  const { detailList, loading, visible, onClose, dispatch } = props;
  const { show = false, detail = {} } = visible;

  const { guideMomentsId, merchantName, title } = detail;

  // 关闭清除数据
  const fetchCloseModal = () => {
    dispatch({
      type: 'videoAdvert/closeList',
    });
  };

  // 搜索参数
  const propItem = {
    title: `领豆明细 - ${merchantName} - ${title}`,
    dispatchType: 'videoAdvert/fetchVideoAdNoviceBean',
    rowKey: 'beanDetailNewId',
    searchItems: [
      {
        label: '领豆时间',
        type: 'rangePicker',
        name: 'createTimeStart',
        end: 'createTimeEnd',
      },
      {
        label: '领豆用户',
        name: 'verifierName',
      },
    ],
    getColumns: [
      {
        title: '领豆用户',
        align: 'center',
        dataIndex: 'mobile',
      },
      {
        title: '用户手机号',
        align: 'center',
        dataIndex: 'merchantName',
        render: (val) => val || '暂未授权',
      },
      {
        title: '用户豆号',
        align: 'center',
        dataIndex: 'cityName',
      },
      {
        title: '领取卡豆数（个）',
        align: 'right',
        dataIndex: 'address',
      },
      {
        label: '领取时间',
        align: 'center',
        name: 'businessHub',
      },
    ],
  };

  const tableProps = {
    noCard: false,
    loading,
    columns: propItem.getColumns,
    searchItems: propItem.searchItems,
    dispatchType: propItem.dispatchType,
    size: 'middle',
    params: { guideMomentsId },
    ...detailList,
  };

  return (
    <Modal
      title={propItem.title}
      width={1200}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
      afterClose={fetchCloseModal}
    >
      <TableDataBlock order {...tableProps} rowKey={(row) => `${row[propItem.rowKey]}`} />
    </Modal>
  );
};

export default connect(({ videoAdvert, loading }) => ({
  detailList: videoAdvert.detailList,
  loading: loading.effects['videoAdvert/fetchVideoAdNoviceBean'],
}))(VideoPeasDetail);
