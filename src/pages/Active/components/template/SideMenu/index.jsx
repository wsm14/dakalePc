import React, { useEffect, useContext } from 'react';
import { Button, Space, Row, Col, Modal, Popover, Spin } from 'antd';
import QRCode from 'qrcode.react';
import init from '../CreateHtml';

/**
 * 顶部显示区域
 */
const SideMenu = (props) => {
  const { onClose, context, dispatch, loading } = props;

  const { dispatchData, moduleData, activeName } = useContext(context);

  // 获取activeUrl 文件名 覆盖原文件
  const getHtmlDocName = () => {
    let str = activeUrl;
    str = str.substring(str.lastIndexOf('/') + 1);
    str = str.substring(0, str.lastIndexOf('.'));
    return str;
  };

  // 获取html生成文件上传oss
  const fetchSaveModuleData = () => {
    let fileUrl = '';
    // if (activeUrl) fileUrl = getHtmlDocName();
    const blob = new Blob([init({ ...moduleData, activeName })], { type: 'text/html' });
    dispatch({
      type: 'activeTemplate/fetchGetOss',
      payload: { file: blob },
      callback: (data) => console.log(data),
    });
  };

  useEffect(() => {
    return () => {
      dispatchData({ type: 'initialize' });
    };
  }, []);

  return (
    <Row align="middle">
      <Col flex="auto">使用模版 - {activeName}</Col>
      <Col>
        <Space>
          <Popover
            placement="bottom"
            onVisibleChange={(v) => {
              if (v) fetchSaveModuleData();
            }}
            content={
              <Spin spinning={true}>
                <QRCode
                  value={`${'activeUrl'}?timestamp=${new Date().getTime()}`} //value参数为生成二维码的链接
                  size={150} //二维码的宽高尺寸
                  fgColor="#000000" //二维码的颜色
                />
                <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                  请使用手机扫一扫预览
                </div>
              </Spin>
            }
            trigger="click"
          >
            <Button>预览</Button>
          </Popover>
          <Button
            onClick={() => {
              Modal.confirm({
                title: '已编辑数据不会保存，确认关闭？',
                onOk() {
                  // let fileUrl = '';
                  // if (activeUrl) fileUrl = getHtmlDocName();
                  // // 取消编辑删除文件
                  // aliOssUpload('', '', 'active', fileUrl, 'delete');
                  onClose();
                },
                onCancel() {},
              });
            }}
          >
            关闭
          </Button>
          <Button type="primary" loading={loading} onClick={fetchSaveModuleData}>
            保存
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default SideMenu;
