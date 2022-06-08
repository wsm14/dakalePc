import React, { useState, useEffect } from 'react';
import update from 'immutability-helper';
import { Form, Card, Button } from 'antd';
import { UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
import aliOssUpload from '@/utils/aliOssUpload';
import Upload from '@/components/FormCondition/Upload/Img';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import { platformCouponsDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import FormCondition from '@/components/FormCondition';

const FormList = (props) => {
  const { name, form, field, remove, move, initialValues } = props;
  const [visible, setVisible] = useState(false); // 权益商品 弹窗
  const [dataObj, setDataObj] = useState({});

  useEffect(() => {
    const obj = form.getFieldValue(name)[field.name]?.platformCouponId || {};
    setDataObj(obj);
  }, []);

  const uploadImg = async (index, val) => {
    let imgUrl = await aliOssUpload(val);
    // 获取数据数组
    const dataList = form.getFieldValue(name);
    // 更新数据数组
    const newData = update(dataList, {
      $splice: [
        [
          index,
          1,
          {
            ...dataList[index],
            platformCouponImg: imgUrl.toString(),
          },
        ],
      ],
    });
    form.setFieldsValue({
      [name]: newData,
    });
  };

  const onOk = (obj) => {
    const { list = [] } = obj;
    setDataObj(list[0] || {});
    // 获取数据数组
    const dataList = form.getFieldValue(name);
    // 更新数据数组
    const newData = update(dataList, {
      $splice: [
        [
          field.name,
          1,
          {
            ...dataList[field.name],
            platformCouponId: list[0] || '',
          },
        ],
      ],
    });
    form.setFieldsValue({
      [name]: newData,
    });
  };

  return (
    <div key={field.key}>
      <Card
        title={`券${field.name + 1}`}
        size="small"
        style={{ marginBottom: '10px' }}
        bodyStyle={{ padding: '24px 12px 0' }}
        extra={
          <>
            <UpSquareOutlined
              onClick={() => {
                move(field.name, field.name - 1);
              }}
              style={{ marginRight: '5px' }}
            />
            <DownSquareOutlined
              onClick={() => {
                move(field.name, field.name + 1);
              }}
            />
            <Button type="link" onClick={() => remove(field.name)}>
              删除
            </Button>
          </>
        }
      >
        <Form.Item label="关联券" required={true} name={[field.name, 'platformCouponId']}>
          {Object.keys(dataObj).length === 0 ? (
            <Button type="link" onClick={() => setVisible(true)}>
              + 选择券
            </Button>
          ) : (
            platformCouponsDom(
              dataObj,
              '',
              () => {},
              () => {
                onOk({});
              },
            )
          )}
        </Form.Item>
        <Form.Item
          label="上传券商品图片"
          name={[field.name, 'platformCouponImg']}
          rules={[{ required: true, message: '请上传券商品图片' }]}
        >
          <Upload
            name={[name, field.name, 'platformCouponImg']}
            maxFile={3}
            drop={false}
            initialvalues={initialValues}
            onChange={(val) => uploadImg(field.name, val)}
            onRemove={() => uploadImg(field.name, undefined)}
          ></Upload>
        </Form.Item>
      </Card>
      <GoodsSelectModal
        selectType="radio"
        hiddenTag={['reduceCoupon', 'specialGoods', 'commerceGoods']}
        visible={visible}
        onSumbit={onOk}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </div>
  );
};

export default FormList;
