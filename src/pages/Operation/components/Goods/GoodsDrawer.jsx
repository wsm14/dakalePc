import React from 'react';
import { connect } from 'umi';
import { Button, Form, notification } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import GoodsDetail from './Detail/GoodsDetail';
import GoodsSet from './Form/GoodsSet';
import DrawerCondition from '@/components/DrawerCondition';

const GoodsDrawer = (props) => {
  const { dispatch, visible, childRef, total, getDetail, onClose, loading, loadingDetail } = props;

  const { type = '', index, detail = [] } = visible;
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
    visible: type == 'showDetail' || type == 'addGoods',
    onClose,
    loading: loadingDetail,
    dataPage: type === 'showDetail' && {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: {
      addGoods: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
      // showDetail: status == 1 && (checkStatus == 2 || checkStatus == 0) && (
      //   <Button onClick={() => fetchAuditRefuse(detail)} type="primary">
      //     下架
      //   </Button>
      // ),
    }[type],
  };

  return (
    <DrawerCondition {...modalProps}>
      {type == 'showDetail' && <GoodsDetail detail={detail}></GoodsDetail>}
      {type == 'addGoods' && <GoodsSet form={form}></GoodsSet>}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['goodsManage/fetchGoodsAdd'],
  loadingDetail: loading.effects['goodsManage/fetchGoodsGetDetail'],
}))(GoodsDrawer);
