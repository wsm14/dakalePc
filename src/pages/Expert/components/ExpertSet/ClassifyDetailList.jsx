import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal, Button, Switch } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import ClassifyDetailSet from './ClassifyDetailSet';

const ClassifyDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { record = '' } = visible;

  const [visibleSet,setVisibleSet] = useState(false)

  const childRef = useRef();

  const getColumns = [
    {
      title: '图片',
      dataIndex: 'image',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '话题',
      dataIndex: 'topicName',
    },
    {
      title: '说明',
      dataIndex: 'topicDesc',
    },
    {
      title: '显示状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, record) => (
        <Switch
          checked={val == '1'}
          onClick={() =>
            fetchClassifyDetailSet({ topicId: record.topicIdString, status: 1 ^ Number(val) })
          }
        />
      ),
    },
    {
      title: '推荐',
      align: 'center',
      dataIndex: 'recommendFlag',
      render: (val) => (val == '1' ? '推荐' : '不推荐'),
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'topicIdString',
      render: (val, records) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '推荐',
              visible: records.recommendFlag === '0',
              click: () =>
                handleClassifyDetailSet({
                  domainId: record.domainId,
                  topicId: val,
                  recommendFlag: 1,
                  topicName: records.topicName,
                }),
            },
            {
              type: 'own',
              title: '取消推荐',
              visible: records.recommendFlag === '1',
              click: () =>
                handleClassifyDetailSet({
                  domainId: record.domainId,
                  topicId: val,
                  recommendFlag: 0,
                }),
            },
            {
              type: 'edit',
              click: () => handleDataSet('edit',{ topicId: val, ...records }),
            },
            {
              type: 'del',
              click: () => fetchClassifyDetailSet({ topicId: val, deleteFlag: 0 }),
            },
          ]}
        />
      ),
    },
  ];

  //  新增 修改
  const handleDataSet = (type,initialValues) => {
    setVisibleSet({
      show:true,
      type,
      initialValues,
      domainId: record.domainId,
    })
  };

  // 删除 设置
  const handleClassifyDetailSet = (values) => {
    if (values.recommendFlag) {
      const listObj = detailList.list.filter((item) => item.recommendFlag == 1)[0];
      if (listObj) {
        Modal.confirm({
          title: '话题推荐',
          content: `是否替换 #${listObj.topicName}，将 #${values.topicName} 为推荐话题？`,
          onOk() {
            fetchClassifyDetailSet(values);
          },
          onCancel() {},
        });
      } else fetchClassifyDetailSet(values);
    } else {
      fetchClassifyDetailSet(values);
    }
  };

  // 删除 设置 请求
  const fetchClassifyDetailSet = (values) => {
    dispatch({
      type: 'expertSet/fetchClassifyDetailSet',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return (
    <Modal
      title={`内容分类话题 - ${record.domainName}`}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <TableDataBlock
        btnExtra={
          <Button className="dkl_green_btn" onClick={() => handleDataSet('add')}>
            新增
          </Button>
        }
        cRef={childRef}
        noCard={false}
        loading={loading}
        columns={getColumns}
        rowKey={(row) => `${row.topicIdString}`}
        params={{ domainId: record.domainId }}
        dispatchType="expertSet/fetchClassifyDetailList"
        size="middle"
        {...detailList}
      ></TableDataBlock>
      <ClassifyDetailSet visible={visibleSet} childRef={childRef} onClose ={()=>setVisibleSet(false)}></ClassifyDetailSet>
    </Modal>
  );
};

export default connect(({ expertSet, loading }) => ({
  detailList: expertSet.detailList,
  loading: loading.effects['expertSet/fetchClassifyDetailList'],
}))(ClassifyDetailList);
