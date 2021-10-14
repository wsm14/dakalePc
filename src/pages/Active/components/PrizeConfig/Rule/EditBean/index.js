import React from 'react';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import TableDataBlock from '@/components/TableDataBlock';

function EditBean(props) {
  const { visible, setVisible } = props;

  // table 表头
  const getColumns = [
    {
      title: '奖品ID',
      fixed: 'left',
      dataIndex: 'id',
    },
    {
      title: '奖品类型',
      fixed: 'left',
      dataIndex: 'type',
      render: (val) => BLINDBOX_PRIZE_TYPE[val],
    },
    {
      title: '中奖图',
      dataIndex: 'winningImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖池图',
      dataIndex: 'winningImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品名称',
      dataIndex: 'prize',
      ellipsis: true,
    },
    {
      title: '盲盒展示名称',
      dataIndex: 'showName',
      ellipsis: true,
    },
    {
      title: '抽中概率',
      dataIndex: 'rate',
    },
    {
      title: '是否真实奖品',
      dataIndex: 'isParticipate',
      render: (val) => (val = 1 ? '是' : '仅展示'),
    },
  ];
  // 描述列表
  const base = [
    {
      label: '每次抽取所需卡豆',
      name: 'bean',
    },
    {
      label: '盲盒背景图',
      type: 'upload',
      name: 'backImg',
    },
    {
      label: '盲盒动效',
      type: 'otherUpload',
      name: 'backFile',
    },
    {
      label: '奖池',
      name: 'participateBlindBoxProducts',
      render: (val) => (
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.id}`}
          list={val}
        ></TableDataBlock>
      ),
    },
  ];
  return (
    <>
      <DrawerCondition title="编辑场次" visible={visible} onClose={() => setVisible(false)}>
        <DescriptionsCondition formItems={base}></DescriptionsCondition>
      </DrawerCondition>
    </>
  );
}

export default EditBean;
