import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Button, Popover } from 'antd';
import QRCode from 'qrcode.react';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import ActiveTemplateEdit from './components/template/ActiveTemplateEdit';
import activeTemplateNameSet from './components/template/ActiveTemplateNameSet';

const ActiveListComponent = (props) => {
  const { activeList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({ show: false, info: {} });

  // 设置活动名称
  const handleSetActiveName = (initialValues) => {
    const callback = (activeName) => {
      setVisible({ show: true, info: { ...initialValues, activeName } });
      dispatch({ type: 'drawerForm/close' });
    };
    dispatch({
      type: 'drawerForm/show',
      payload: activeTemplateNameSet({ initialValues, callback: (values) => callback(values) }),
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '活动标题',
      fixed: 'left',
      dataIndex: 'activityTitle',
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
      title: '操作',
      dataIndex: 'promotionActivityIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              title: '修改',
              click: () =>
                handleSetActiveName({
                  promotionActivityId: val,
                  activeName: record.activityTitle,
                  templateUrl: `${record.jumpUrl}?demo=1&times=${new Date().getTime()}`,
                }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.promotionActivityIdString}`}
        dispatchType="activeList/fetchGetList"
        {...activeList}
      ></DataTableBlock>
      <ActiveTemplateEdit
        key="templateEdit"
        visible={visible}
        onClose={() => {
          childRef.current.fetchGetData();
          setVisible(false);
        }}
      ></ActiveTemplateEdit>
    </>
  );
};

export default connect(({ activeList, loading }) => ({
  activeList,
  loading: loading.models.activeList,
}))(ActiveListComponent);
