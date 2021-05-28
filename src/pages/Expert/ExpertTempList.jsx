import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { EXPERT_TEMP_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import ExpertTempSet from './components/Temp/ExpertTempSet';

const ExpertTempList = (props) => {
  const { list, experLevel, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 新增弹窗

  const { 0: noneData, ...other } = experLevel; // 排除0 - 普通用户

  useEffect(() => {
    fetchGetExpertLevel();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '豆号',
      name: 'beanCode',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '实习级别',
      type: 'select',
      name: 'tempLevel',
      select: { ...other },
    },
    {
      label: '实习状态',
      type: 'select',
      name: 'status',
      select: EXPERT_TEMP_STATUS,
    },
    {
      label: '实习期',
      type: 'rangePicker',
      name: 'startTime',
      end: 'endTime',
    },
    {
      label: '实习结果',
      name: 'currentLevel',
      type: 'select',
      select: experLevel,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '昵称',
      dataIndex: 'userName',
    },

    {
      title: '实习级别',
      align: 'center',
      dataIndex: 'tempLevel',
      render: (val) => experLevel[val],
    },
    {
      title: '豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '实习期',
      dataIndex: 'beginDate',
      render: (val, row) => `${val} ~ ${row.endDate}`,
    },
    {
      title: '核销笔数',
      align: 'right',
      dataIndex: 'verificationCount',
    },
    {
      title: '分销订单流水',
      align: 'right',
      dataIndex: 'performance',
      render: (val) => `￥${val || 0}`,
    },
    {
      title: '实习状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => EXPERT_TEMP_STATUS[val],
    },
    {
      title: '实习结果',
      dataIndex: 'currentLevel',
      align: 'center',
      render: (val) => experLevel[val],
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'userTempLevelId',
      render: (userTempLevelId, row) => (
        <HandleSetTable
          formItems={[
            {
              type: 'cancelTemp',
              pop: true,
              visible: row.status !== '2',
              click: () => fetchExpertStop({ userTempLevelId }),
            },
          ]}
        />
      ),
    },
  ];

  // 获取哒人等级映射
  const fetchGetExpertLevel = () => {
    dispatch({
      type: 'baseData/fetchGetExpertLevel',
    });
  };

  // 取消实习
  const fetchExpertStop = (values) => {
    dispatch({
      type: 'expertTempList/fetchExpertTempStop',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <TableDataBlock
        order
        keepData
        btnExtra={
          <AuthConsumer auth="save">
            <Button className="dkl_green_btn" onClick={() => setVisible(true)}>
              新增
            </Button>
          </AuthConsumer>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userTempLevelId}`}
        dispatchType="expertTempList/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 新增 */}
      <ExpertTempSet
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></ExpertTempSet>
    </>
  );
};

export default connect(({ expertTempList, baseData, loading }) => ({
  list: expertTempList.list,
  experLevel: baseData.experLevel,
  loading: loading.models.expertTempList,
}))(ExpertTempList);
