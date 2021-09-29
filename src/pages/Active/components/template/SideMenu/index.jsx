import React, { useEffect, useState, useContext } from 'react';
import { Button, Space, Row, Col, Modal, Popover, Spin, message } from 'antd';
import { uuid } from '@/utils/utils';
import QRCode from 'qrcode.react';
import init from '../CreateHtml';

/**
 * 顶部显示区域
 */
const SideMenu = (props) => {
  const { onClose, context, dispatch, loading } = props;

  const { dispatchData, moduleData, info = {} } = useContext(context);

  const { activityName, type, jumpUrl, handle, activityTemplateId } = info;

  const [previewerUrl, setPreviewerUrl] = useState(); // 预览连接

  // 获取activeUrl 文件名 覆盖原文件
  const getHtmlDocName = () => {
    let str = jumpUrl;
    str = str.substring(str.lastIndexOf('/') + 1);
    str = str.substring(0, str.lastIndexOf('.'));
    return str;
  };

  // 获取html生成文件上传oss previewer 预览 active 创建
  const fetchSaveModuleData = (show) => {
    message.loading({ content: '文件创建中...' });
    if (show === 'previewer') setPreviewerUrl('');
    let fileName = uuid();
    if (handle === 'edit') fileName = getHtmlDocName();
    const newData = moduleData.dataList.filter((item) => item.data); // 空数据不进入
    const blob = new Blob(
      [
        init({
          ...moduleData,
          dataList: newData,
          activityName,
        }),
      ],
      { type: 'text/html' },
    );
    dispatch({
      type: 'activeTemplate/fetchGetOss',
      payload: { file: blob, fileName, show },
      callback: (jumpUrl) => {
        // 预览显示
        if (show === 'previewer') {
          setPreviewerUrl(jumpUrl);
          message.destroy();
          return;
        }
        const { share } = moduleData;
        dispatch({
          type:
            handle === 'edit' ? 'activeTemplate/fetchActiveEdit' : 'activeTemplate/fetchActiveAdd',
          payload: {
            activityTemplateId,
            jumpUrl,
            activityName: activityName,
            templateType: type,
            shareFlag: Number(share.open),
            params: JSON.stringify({
              ...moduleData,
              dataList: newData, // 空数据不进入
            }),
          },
          callback: () => {
            message.destroy();
            onClose();
          },
        });
      },
    });
  };

  useEffect(() => {
    return () => {
      dispatchData({ type: 'initialize' });
    };
  }, []);

  return (
    <Row align="middle">
      <Col flex="auto">使用模版 - {activityName}</Col>
      <Col>
        <Space>
          <Popover
            placement="bottom"
            onVisibleChange={(v) => {
              if (v) fetchSaveModuleData('previewer');
            }}
            content={
              <Spin spinning={!previewerUrl}>
                <QRCode
                  value={`${previewerUrl}?timestamp=${new Date().getTime()}`} //value参数为生成二维码的链接
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
          <Button type="primary" loading={loading} onClick={() => fetchSaveModuleData('active')}>
            保存
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default SideMenu;
