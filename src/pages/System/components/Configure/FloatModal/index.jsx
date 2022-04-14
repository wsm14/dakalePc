import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { TAB_INDEX_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import EditionModal from './EditionModal';
import CityModal from './CityModal';
import CityTable from './CityTable';

const Index = (props) => {
  const { dispatch, loading, editionList } = props;
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('iOS');
  const [visibleEdition, setVisibleEdition] = useState(false);
  const childRef = useRef();

  const getColumns = [
    {
      title: '最低支持版本',
      align: 'center',
      dataIndex: 'version',
    },
    {
      type: 'handle',
      // align: 'center',
      dataIndex: 'configFloatingWindowId',
      render: (val, row) => [
        {
          type: 'floatEdit',
          title: '编辑详情',
          click: () => {
            setVisible({
              show: true,
              type: 'edit',
              detail: row,
            });
          },
          auth: true,
        },
        {
          type: 'floatEditVersion',
          title: '修改版本',
          click: () => {
            setVisibleEdition({
              show: true,
              type: 'edit',
              detail: row,
            });
          },
          auth: true,
        },
        {
          type: 'del',
          title: '删除版本',
          click: () => {
            handleDelVersion(val);
          },
          auth: true,
        },
      ],
    },
  ];

  // 删除版本
  const handleDelVersion = (configFloatingWindowId) => {
    dispatch({
      type: 'marketConfigure/fetchFloatingWindowEdit',
      payload: {
        configFloatingWindowId,
        flag: 'deleteVersion',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const cardBtnList = [
    {
      auth: 'floatAddVersion',
      text: '新增版本',
      className: 'dkl_blue_btn',
      onClick: () => {
        setVisibleEdition({
          show: true,
          type: 'add',
        });
      },
    },
  ];

  const handleTabChange = (key) => {
    setTabKey(key);
    if (key !== 'weChat') {
      childRef?.current?.fetchGetData({
        userOs: key,
        area: 'all',
        windowType: 'first',
        isAutomatic: 1,
        deleteFlag: 1,
      });
    }
  };

  return (
    <>
      <Card
        title="浮窗配置"
        tabList={Object.keys(TAB_INDEX_TYPE).map((i) => ({ key: i, tab: TAB_INDEX_TYPE[i] }))}
        activeTabKey={tabKey}
        onTabChange={handleTabChange}
      >
        {tabKey !== 'weChat' ? (
          <TableDataBlock
            order
            noCard={false}
            cRef={childRef}
            loading={loading}
            columns={getColumns}
            btnExtra={cardBtnList}
            pagination={false}
            rowKey={(record) => `${record.configFloatingWindowId}`}
            params={{
              userOs: tabKey,
              area: 'all',
              windowType: 'first',
              isAutomatic: 1,
              deleteFlag: 1,
            }}
            dispatchType="marketConfigure/fetchFloatingWindowList"
            {...editionList}
          />
        ) : (
          <CityTable tabKey={tabKey} />
        )}
      </Card>
      {/* 弹窗-新增版本 */}
      <EditionModal
        childRef={childRef}
        visible={visibleEdition}
        tabKey={tabKey}
        onClose={() => setVisibleEdition(false)}
      ></EditionModal>
      {/* 编辑详情-弹窗 */}
      <CityModal
        childRef={childRef}
        visible={visible}
        tabKey={tabKey}
        onClose={() => setVisible(false)}
      ></CityModal>
    </>
  );
};

export default connect(({ loading, marketConfigure }) => ({
  editionList: marketConfigure.floatEditionList,
  loading: loading.models.marketConfigure,
}))(Index);
