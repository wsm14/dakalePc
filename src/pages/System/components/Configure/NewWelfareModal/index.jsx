import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import NewWelfareModalDrawerSet from './components/NewWelfareModalDrawerSet';
import { NEWUSER_STATUS_TYPE } from '@/common/constant';

const tabList = [
  {
    key: 'iOS',
    tab: 'iOS',
  },
  {
    key: 'android',
    tab: 'Android',
  },
  {
    key: 'weChat',
    tab: '小程序',
  },
];

const CityGlobalModal = (props) => {
  const { newUserPopUpList, loading, dispatch } = props;
  const childRef = useRef();
  //tab切换
  const [tabKey, setTabKey] = useState('iOS');
  const [visibleSet, setVisibleSet] = useState(false);

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ userOs: tabKey });
  }, [tabKey]);

  const changeTime = (row) => {
    let { activityBeginTime, activityEndTime } = row;
    if (activityBeginTime && activityEndTime) {
      const nowTime = new Date().getTime();
      activityBeginTime = new Date(activityBeginTime).getTime();
      activityEndTime = new Date(activityEndTime).getTime();
      if (nowTime >= activityBeginTime && nowTime <= activityEndTime) {
        return 1;
      } else if (nowTime < activityBeginTime) {
        return 0;
      } else if (nowTime > activityEndTime) {
        return 2;
      }
    }
    return '';
  };

  const getColumns = [
    {
      title: '活动名称',
      dataIndex: 'name',
    },
    {
      title: '活动时间',
      dataIndex: 'activityBeginTime',
      render: (val, row) => (val ? `${val}~${row?.activityEndTime}` : '--'),
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: (val, row) => NEWUSER_STATUS_TYPE[changeTime(row)],
    },

    {
      type: 'handle',
      dataIndex: 'configNewUserPopUpId',
      render: (val, row) => {
        const status = changeTime(row);
        return [
          {
            title:'编辑',
            type: 'newWelfareEdit',
            click: () => handleEdit(val),
          },
        ];
      },
    },
  ];

  //  新增
  const handleAdd = () => {
    setVisibleSet({
      show: true,
      detail: { userOs: tabKey, type: 'add' },
    });
  };

  //编辑
  const handleEdit = (configNewUserPopUpId) => {
    dispatch({
      type: 'marketConfigure/fetchGetConfigNewUserPopUpById',
      payload: {
        configNewUserPopUpId,
      },
      callback: (detail) => {
        setVisibleSet({
          show: true,
          type: 'edit',
          detail,
        });
      },
    });
  };

  const cardBtnList = [
    {
      text: '新增',
      auth: 'newWelfareAdd',
      className: 'dkl_blue_btn',
      onClick: handleAdd,
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          title: '新人福利弹窗',
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          tabBarExtraContent: <ExtraButton list={cardBtnList}></ExtraButton>,
        }}
        pagination={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configNewUserPopUpId}`}
        dispatchType="marketConfigure/fetchListConfigNewUserPopUp"
        params={{ userOs: tabKey }}
        {...newUserPopUpList}
      ></TableDataBlock>
      {/* 新增/编辑 */}
      <NewWelfareModalDrawerSet
        visible={visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></NewWelfareModalDrawerSet>
    </>
  );
};
export default connect(({ loading, marketConfigure }) => ({
  newUserPopUpList: marketConfigure.newUserPopUpList,
  loading:
    loading.effects['marketConfigure/fetchListConfigNewUserPopUp'] ||
    loading.effects['marketConfigure/fetchGetConfigNewUserPopUpById'],
}))(CityGlobalModal);
