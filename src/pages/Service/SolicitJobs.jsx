import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { JSOBS_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import JobsClass from './components/Jobs/JobsClass';
import JobsSet from './components/Jobs/JobsSet';

const SolicitJobs = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 职位信息管理
  const [visibleSet, setVisibleSet] = useState(false); // 招聘信息

  // 搜索参数
  const searchItems = [
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: JSOBS_STATUS,
    },
    {
      label: '职位名称',
      name: 'jobName',
    },
    {
      label: '更新人',
      name: 'updater',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '职位名称',
      dataIndex: 'jobName',
    },
    {
      title: '职位类别',
      dataIndex: 'jobType',
    },
    {
      title: '学历要求',
      align: 'center',
      dataIndex: 'education',
    },
    {
      title: '经验要求',
      align: 'center',
      dataIndex: 'experience',
    },
    {
      title: '职位描述',
      dataIndex: 'jobDescription',
      width: 300,
      render: (val) => (
        <Ellipsis length={50} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '更新人',
      align: 'center',
      dataIndex: 'updater',
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => JSOBS_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'talentRecruitmentId',
      fixed: 'right',
      align: 'right',
      render: (talentRecruitmentId, row) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => setVisibleSet({ type: 'edit', show: true, detail: row }),
            },
            {
              type: 'down',
              visible: row.status === '1',
              click: () => fetchJobsSet({ talentRecruitmentId, status: 2 }),
            },
          ]}
        />
      ),
    },
  ];

  // 新增/编辑/下架
  const fetchJobsSet = (payload) => {
    dispatch({
      type: 'solicitJobs/fetchJobsSet',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <TableDataBlock
        order
        btnExtra={
          <>
            <AuthConsumer auth="jobClass">
              <Button className="dkl_green_btn" onClick={() => setVisible(true)}>
                职位类别
              </Button>
            </AuthConsumer>
            <AuthConsumer auth="save">
              <Button
                className="dkl_green_btn"
                onClick={() => setVisibleSet({ type: 'add', show: true, detail: '' })}
              >
                新增
              </Button>
            </AuthConsumer>
          </>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.talentRecruitmentId}`}
        dispatchType="solicitJobs/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 职位信息管理 */}
      <JobsClass visible={visible} onClose={() => setVisible(false)}></JobsClass>
      {/* 招聘信息管理 */}
      <JobsSet
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
      ></JobsSet>
    </>
  );
};

export default connect(({ solicitJobs, loading }) => ({
  list: solicitJobs.list,
  loading: loading.effects['solicitJobs/fetchGetList'],
}))(SolicitJobs);
