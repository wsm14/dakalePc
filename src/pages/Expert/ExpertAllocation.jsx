import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { EXPERT_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';

const ExpertAllocation = (props) => {
  const { list, loading, dispatch } = props;

  const [visible, setVisible] = useState(false);

  const childRef = useRef();
  // table 表头
  const getColumns = [
    {
      title: '',
      children: [
        {
          title: '身份',
          dataIndex: 'type',
          width: 150,
          render: (val) => EXPERT_TYPE[val],
        },
        {
          title: '等级',
          dataIndex: 'levelName',
          align: 'center',
          width: 100,
        },
        {
          title: '图标',
          dataIndex: ['levelExtraParamObject', 'levelIcon'],
          align: 'center',
          width: 150,
          render: (val) => <PopImgShow url={val}></PopImgShow>,
        },
      ],
    },
    {
      title: '升级条件',
      children: [
        {
          title: '升级图标',
          dataIndex: ['levelExtraParamObject', 'upLevelIcon'],
          align: 'center',
        },
        {
          title: '直推用户数',
          dataIndex: ['userLevelTargetObject', 'normal'],
          align: 'right',
        },
        {
          title: '直推哒人数',
          dataIndex: ['userLevelTargetObject', 'daren'],
          align: 'right',
        },
      ],
    },
    {
      title: '升级权益',
      children: [
        {
          title: '自购/分销奖励（%）',
          dataIndex: 'shareCommission',
          align: 'right',
          render: (val) => val && `${val}%`,
        },
        {
          title: '团队奖励（%）',
          dataIndex: 'teamCommission',
          align: 'right',
          render: (val) => val && `${val}%`,
        },
        {
          title: '消费抵扣（卡豆）',
          dataIndex: 'payBeanCommission',
          align: 'right',
        },
      ],
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'levelName',
      render: (val, row) => (
        <HandleSetTable
          formItems={[
            {
              auth: 'save',
              title: '新增等级',
              visible: !!row.children,
              click: () => fetchCloseExpert({ kolUserId: val, username: record.username }),
            },
            {
              type: 'edit',
              visible: !row.children || row.type == 'normal',
              click: () => fetchExpertOpen({ kolUserId: val }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TableDataBlock
        bordered
        size="middle"
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.type || record.levelName}`}
        dispatchType="expertAllocation/fetchGetList"
        list={list}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ expertAllocation, loading }) => ({
  list: expertAllocation.list,
  loading: loading.models.expertAllocation,
}))(ExpertAllocation);
