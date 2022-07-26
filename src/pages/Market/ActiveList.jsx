import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Popover, message } from 'antd';
import QRCode from 'qrcode.react';
import { ACTIVE_TEMPLATE_TYPE } from '@/common/constant';
import { handleCopyInfo } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import ExtraButton from '@/components/ExtraButton';
import ActiveTemplateEdit from './components/ActiveList/template/ActiveTemplateEdit';
import ActiveTemplateNameSet from './components/ActiveList/template/ActiveTemplateNameSet';
import ShareImg from './components/ActiveList/ShareImg';
import ModalTemplate from './components/ActiveList/ModalTemplate';

const ActiveListComponent = (props) => {
  const { activeList, loading, dispatch } = props;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('active');
  const [visible, setVisible] = useState({ show: false, info: {} });
  const [visibleName, setVisibleName] = useState({ show: false, info: { activityName: '' } });
  const [visibleShare, setVisibleShare] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  // table 表头
  const getColumns = [
    {
      title: '模版名称',
      fixed: 'left',
      dataIndex: 'activityName',
    },
    {
      title: '创建时间',
      fixed: 'left',
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      fixed: 'left',
      dataIndex: 'creator',
    },
    {
      title: '模版链接',
      align: 'right',
      dataIndex: 'jumpUrl',
      render: (val) => (
        <Popover
          placement="right"
          content={
            <>
              <QRCode
                value={`${val}?timestamp=${new Date().getTime()}`} //value参数为生成二维码的链接
                size={150} //二维码的宽高尺寸
                fgColor="#000000" //二维码的颜色
              />
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                请使用手机扫一扫预览
              </div>
            </>
          }
          trigger="click"
        >
          <Button>查看</Button>
        </Popover>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'activityTemplateId',
      render: (val, row) => [
        {
          type: 'edit',
          click: () => fetchActiveDetail({ activityTemplateId: val }),
        },
        {
          title: '复制链接',
          type: 'copy',
          click: () =>
            handleCopyInfo(
              `${row.jumpUrl}?newPage=true&shareKey=${row.activityTemplateId}${
                tabKey !== 'globalModal' ? '&showTitle=true' : ''
              }`,
            ),
        },
        {
          type: 'shareImg',
          visible: row.shareFlag === '1',
          click: () => fetchActiveDetail({ activityTemplateId: val }, 'share'),
        },
        {
          type: 'del',
          click: () => handleDelActive({ activityTemplateId: val, deleteFlag: 0 }),
        },
      ],
    },
  ];

  useEffect(() => {
    if (!visible.show) {
      childRef.current.fetchGetData();
    }
  }, [visible]);

  // 修改设置活动名称
  const handleSetActiveName = (activityName) => {
    setVisibleName(false); // 关闭输入框
    setVisible({ show: true, info: { ...visibleName.info, activityName } }); // 显示模版编辑
  };

  // 获取详情
  const fetchActiveDetail = (payload, type) => {
    dispatch({
      type: 'activeList/fetchActiveDetail',
      payload,
      callback: (info) =>
        type == 'share'
          ? setVisibleShare({ show: true, info })
          : setVisibleName({ show: true, info }),
    });
  };

  // 删除活动
  const handleDelActive = (payload) => {
    dispatch({
      type: 'activeTemplate/fetchActiveEdit',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  const tabList = Object.keys(ACTIVE_TEMPLATE_TYPE).map((item) => ({
    key: item,
    tab: ACTIVE_TEMPLATE_TYPE[item],
  }));

  const btnList = [
    {
      auth: 'activeTemplate',
      onClick: () => setVisibleModal(true),
      text: '活动模板',
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: (key) => {
            setTabKey(key);
            childRef.current.fetchGetData({ templateType: key, page: 1 });
          },
          tabBarExtraContent: <ExtraButton list={btnList}></ExtraButton>,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.activityTemplateId}`}
        params={{ templateType: tabKey }}
        dispatchType="activeList/fetchGetList"
        {...activeList}
      ></TableDataBlock>
      {/* 设置活动名称 */}
      <ActiveTemplateNameSet
        visible={visibleName}
        callback={handleSetActiveName}
        onClose={() => setVisibleName(false)}
      ></ActiveTemplateNameSet>
      {/* 活动模版编辑区域 */}
      <ActiveTemplateEdit
        key="template"
        visible={visible}
        onClose={() => setVisible(false)}
      ></ActiveTemplateEdit>
      {/* 分享图 */}
      <ShareImg visible={visibleShare} onClose={() => setVisibleShare(false)}></ShareImg>
      {/* 活动模板 */}
      <ModalTemplate visible={visibleModal} onClose={() => setVisibleModal(false)}></ModalTemplate>
    </>
  );
};

export default connect(({ activeList, loading }) => ({
  activeList,
  loading: loading.models.activeList || loading.models.activeTemplate,
}))(ActiveListComponent);
