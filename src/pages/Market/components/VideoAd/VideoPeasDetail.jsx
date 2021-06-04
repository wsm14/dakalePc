import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import debounce from 'lodash/debounce';
import TableDataBlock from '@/components/TableDataBlock';

const VideoPeasDetail = (props) => {
  const { detailList, userList, loading, loadingUser, visible, onClose, dispatch } = props;
  const { show = false, detail = {} } = visible;

  const { guideMomentsId, merchantName, title } = detail;

  // 关闭清除数据
  const fetchCloseModal = () => {
    dispatch({
      type: 'videoAdvert/closeList',
    });
  };

  // 获取用户搜索
  const fetchGetUser = debounce((content) => {
    if (!content) return;
    dispatch({
      type: 'baseData/fetchGetUsersSearch',
      payload: {
        content,
      },
    });
  }, 500);

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
        name: 'userId',
        type: 'select',
        loading: loadingUser,
        placeholder: '请输入搜索用户昵称',
        select: userList,
        onSearch: (val) => fetchGetUser(val),
        fieldNames: { label: 'username', value: 'userIdString' },
      },
    ],
    getColumns: [
      {
        title: '领豆用户',
        align: 'center',
        dataIndex: 'userName',
      },
      {
        title: '用户手机号',
        align: 'center',
        dataIndex: 'userMobile',
        render: (val) => val || '暂未授权',
      },
      {
        title: '用户豆号',
        align: 'center',
        dataIndex: 'userBeanCode',
      },
      {
        title: '领取卡豆数（个）',
        align: 'right',
        dataIndex: 'beanAmount',
      },
      {
        title: '领豆时间',
        align: 'center',
        dataIndex: 'createTime',
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

export default connect(({ videoAdvert, baseData, loading }) => ({
  detailList: videoAdvert.detailList,
  userList: baseData.userList,
  loading: loading.effects['videoAdvert/fetchVideoAdNoviceBean'],
  loadingUser: loading.effects['baseData/fetchGetUsersSearch'],
}))(VideoPeasDetail);
