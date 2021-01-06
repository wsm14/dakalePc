import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { SHARE_STATUS } from '@/common/constant';
import exportExcel from '@/utils/exportExcel';
import AuthConsumer from '@/layouts/AuthConsumer';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import SubsidyDrawer from './components/subsidy/SubsidyDrawer';

const SubsidyManage = (props) => {
  const { shareManage, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 时间选择器限制选择参数比较
  const [dates, setDates] = useState([]);
  // 时间限制选择一年
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 365;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 365;
    return tooEarly || tooLate;
  };

  // 下架
  const fetchAuditRefuse = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: closeRefuse({ dispatch, childRef, initialValues }),
    });
  };

  // 获取详情
  const fetchShareDetail = (val, type) => {
    dispatch({
      type: 'shareManage/fetchShareDetail',
      payload: {
        userMomentIdString: val,
      },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '任务名称',
      name: 'title',
    },
    {
      label: '补贴类型',
      type: 'select',
      name: 'contentType',
      select: { list: ['平台直充'] },
    },
    {
      label: '补贴角色',
      type: 'select',
      name: 'status',
      select: { list: SHARE_STATUS },
    },
    {
      label: '时间',
      type: 'rangePicker',
      name: 'activationTimeStart',
      end: 'activationTimeEnd',
      onCalendarChange: setDates,
      onOpenChange: () => setDates([]),
      disabledDate,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val, row, index) => index + 1,
    },
    {
      title: '任务名称',
      fixed: 'left',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '补贴类型',
      dataIndex: 'merchantName',
      render: (val) => val,
    },
    {
      title: '补贴角色',
      align: 'center',
      dataIndex: 'contentType',
      render: (val) => (val == 'video' ? '视频' : '图片'),
    },
    {
      title: '总参与人数',
      align: 'right',
      dataIndex: 'beanAmount',
    },
    {
      title: '已补贴卡豆数',
      align: 'right',
      dataIndex: 'length',
    },
    {
      title: '操作',
      dataIndex: 'userMomentIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        const { status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                click: () => fetchShareDetail(val, record.contentType),
              },
              {
                type: 'del',
                visible: status == 1 || status == 5,
                click: () => fetchAuditRefuse(record),
              },
              {
                type: 'own',
                auth: 'end',
                title: '结束',
              },
            ]}
          />
        );
      },
    },
  ];

  // 导出excel 数据
  const fetchGetExcel = (payload) => {
    const header = getColumns.slice(1);
    dispatch({
      type: 'businessSettled/fetchMerchantGetExcel',
      payload,
      callback: (data) => exportExcel({ header, data }),
    });
  };

  return (
    <>
      <DataTableBlock
        btnExtra={({ get }) => (
          <>
            <AuthConsumer auth="exportList">
              <Button className="dkl_green_btn" onClick={() => fetchGetExcel(get())}>
                导出
              </Button>
            </AuthConsumer>
            <AuthConsumer auth="save">
              <Button
                className="dkl_green_btn"
                onClick={() => setVisible({ type: 'add', show: true })}
              >
                新增
              </Button>
            </AuthConsumer>
          </>
        )}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userMomentIdString}`}
        dispatchType="shareManage/fetchGetList"
        {...shareManage}
      ></DataTableBlock>
      <SubsidyDrawer visible={visible} setVisible={setVisible}></SubsidyDrawer>
    </>
  );
};

export default connect(({ shareManage, loading }) => ({
  shareManage,
  loading: loading.models.shareManage,
}))(SubsidyManage);
