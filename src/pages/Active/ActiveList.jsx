import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button, Popover, message } from 'antd';
import QRCode from 'qrcode.react';
import { ACTIVE_TEMPLATE_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import ActiveTemplateEdit from './components/template/ActiveTemplateEdit';
import ActiveTemplateNameSet from './components/template/ActiveTemplateNameSet';

const ActiveListComponent = (props) => {
  const { activeList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({ show: false, info: {} });
  const [visibleName, setVisibleName] = useState({ show: false, info: { activityName: '' } });

  // table 表头
  const getColumns = [
    {
      title: '活动名称',
      fixed: 'left',
      dataIndex: 'activityName',
    },
    {
      title: '创建时间',
      fixed: 'left',
      dataIndex: 'createTime',
    },
    {
      title: '模板类型',
      fixed: 'left',
      dataIndex: 'templateType',
      render: (val) => ACTIVE_TEMPLATE_TYPE[val],
    },
    {
      title: '创建人',
      fixed: 'left',
      dataIndex: 'creator',
    },
    {
      title: '活动链接',
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
      render: (val, record) => [
        {
          type: 'edit',
          click: () => fetchActiveDetail({ activityTemplateId: val }),
        },
        {
          title: '复制链接',
          type: 'copy',
          click: () => handleCopy(record.jumpUrl),
        },
        {
          type: 'del',
          click: () => handleDelActive({ activityTemplateId: val, deleteFlag: 0 }),
        },
      ],
    },
  ];

  // 复制链接
  const handleCopy = (jumpUrl) => {
    const copyDOMs = document.createElement('span');
    copyDOMs.innerHTML = jumpUrl;
    document.body.appendChild(copyDOMs);
    const range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(copyDOMs);
    window.getSelection().addRange(range);
    const suessUrl = document.execCommand('copy');
    if (suessUrl) {
      message.success('复制成功！');
    }
    document.body.removeChild(copyDOMs);
  };

  // 修改设置活动名称
  const handleSetActiveName = (activityName) => {
    setVisibleName(false); // 关闭输入框
    setVisible({ show: true, info: { ...visibleName.info, activityName } }); // 显示模版编辑
  };

  // 获取详情
  const fetchActiveDetail = (payload) => {
    dispatch({
      type: 'activeList/fetchActiveDetail',
      payload,
      callback: (info) => setVisibleName({ show: true, info }),
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

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.activityTemplateId}`}
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
    </>
  );
};

export default connect(({ activeList, loading }) => ({
  activeList,
  loading: loading.models.activeList || loading.models.activeTemplate,
}))(ActiveListComponent);
