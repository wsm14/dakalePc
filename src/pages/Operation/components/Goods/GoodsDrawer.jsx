import React from 'react';
import { connect } from 'umi';
import { Drawer, Button, Space, Form, notification } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import GoodsDetail from './Detail/GoodsDetail';
import GoodsSet from './Form/GoodsSet';

const GoodsDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = '', detail = [] } = visible;
  const [form] = Form.useForm();

  // 检查文件上传格式
  const checkFileData = (fileData) => {
    let aimg = [];
    switch (typeof fileData) {
      case 'undefined':
        break;
      case 'object':
        aimg = fileData.fileList.map((item) => {
          if (item.url) return item.url;
          return item.originFileObj;
        });
        break;
      default:
        aimg = [fileData];
        break;
    }
    return aimg;
  };

  // 确认提交
  const handleUpAudit = () => {
    const goodsType = form.getFieldValue('goodsType');
    if (goodsType == 'package' && !form.getFieldValue('packageGoodsObjects')) {
      notification.info({
        message: '温馨提示',
        description: '请设置套餐商品',
      });
      return;
    }
    form.validateFields().then((values) => {
      const { allImgs, goodsDescImg, price } = values;
      const aimg = checkFileData(allImgs);
      const gimg = checkFileData(goodsDescImg);
      aliOssUpload([...aimg, ...gimg]).then((res) => {
        dispatch({
          type: 'goodsManage/fetchGoodsAdd',
          payload: {
            ...values,
            price: price.toFixed(2),
            allImgs: res.slice(0, aimg.length).toString(),
            goodsDescImg: res.slice(aimg.length).toString(),
          },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const modalProps = {
    title: `${type == 'showDetail' ? '商品详情' : '新增商品'}`,
    width: 620,
    visible: type == 'showDetail' || type == 'addGoods',
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            {type != 'showDetail' && (
              <Button onClick={handleUpAudit} type="primary" loading={loading}>
                提交
              </Button>
            )}
          </Space>
        </div>
      }
    >
      {type == 'showDetail' && <GoodsDetail detail={detail}></GoodsDetail>}
      {type == 'addGoods' && <GoodsSet form={form}></GoodsSet>}
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['goodsManage/fetchGoodsAdd'],
}))(GoodsDrawer);
