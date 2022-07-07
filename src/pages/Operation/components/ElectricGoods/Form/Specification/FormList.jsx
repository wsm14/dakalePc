import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import update from 'immutability-helper';
import Upload from '@/components/FormCondition/Upload/Img';
import aliOssUpload from '@/utils/aliOssUpload';
import TieredPricing from './TieredPricing';
import styles from './style.less';

function FormList(props) {
  const {
    field,
    fields,
    form,
    initialValues,
    sellType, //售卖类型
    priceType, // 售卖价格类型
    editDisabled,
  } = props;
  const [tieredModal, setTieredModal] = useState(false); // 设置阶梯价model

  const list = form.getFieldValue('skuInfoReqs')[field.name]['batchLadderObjects'] || [];

  // 获取规格对象
  const specificationType = form
    .getFieldValue('skuInfoReqs')
    [field.name]['attributes'].map((item) => item.value)
    .join('/');

  // 上传图片
  const uploadImg = async (index, val) => {
    let imgUrl = await aliOssUpload(val);
    // 获取数据数组
    const dataList = form.getFieldValue('skuInfoReqs');
    // 更新数据数组
    const newData = update(dataList, {
      $splice: [
        [
          index,
          1,
          {
            ...dataList[index],
            image: imgUrl.toString(),
          },
        ],
      ],
    });
    form.setFieldsValue({
      skuInfoReqs: newData,
    });
  };

  const styleObj = {
    width: 100,
  };

  return (
    <div key={field.key} style={{ display: 'flex' }}>
      {/* sku码 */}
      <div className={styles.table_row_cell}>
        <Form.Item
          name={[field.name, 'skuCode']}
          rules={[{ required: false, message: '' }]}
          noStyle
        >
          <Input style={styleObj}></Input>
        </Form.Item>
      </div>
      {/* 规格 */}
      <div className={styles.table_row_cell}>{specificationType}</div>
      {/* 图片 */}
      <div className={`${styles.table_row_cell} ${styles.upload_box}`}>
        <Form.Item
          name={[field.name, 'image']}
          rules={[{ required: false, message: '请上传图片' }]}
          noStyle
        >
          <Upload
            name={['skuInfoReqs', field.name, 'image']}
            maxFile={1}
            isCut={false}
            initialvalues={initialValues}
            onChange={(val) => uploadImg(field.name, val)}
            onRemove={() => uploadImg(field.name, undefined)}
          >
            上传
          </Upload>
        </Form.Item>
      </div>
      {/* 原价 */}
      <div className={styles.table_row_cell}>
        <Form.Item
          name={[field.name, 'oriPrice']}
          rules={[{ required: true, message: '请输入原价' }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            disabled={editDisabled}
            addonBefore="￥"
            precision={2}
            min={0}
            style={styleObj}
          ></InputNumber>
        </Form.Item>
      </div>
      {/* 成本价 */}
      {sellType === 'single' && (
        <div className={styles.table_row_cell}>
          <Form.Item name={[field.name, 'costPrice']} rules={[{ required: false }]} noStyle>
            <InputNumber addonBefore="￥" precision={2} min={0} style={styleObj}></InputNumber>
          </Form.Item>
        </div>
      )}
      {/* 结算价 */}
      {/* // 零售时存在，批采时不存在 */}
      {sellType === 'single' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'settlePrice']}
            rules={[{ required: true, message: '请输入结算价' }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              disabled={editDisabled}
              addonBefore="￥"
              precision={2}
              min={0}
              style={styleObj}
            ></InputNumber>
          </Form.Item>
        </div>
      )}
      {/* 零售价 */}
      {/* // 零售时存在，批采时不存在 */}
      {sellType === 'single' && priceType !== 'free' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'sellPrice']}
            rules={[{ required: true, message: '请输入零售价' }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              disabled={editDisabled}
              addonBefore="￥"
              precision={2}
              min={0}
              style={styleObj}
            ></InputNumber>
          </Form.Item>
        </div>
      )}
      {/* 卡豆 */}
      {/* // 零售 且 支付方式为 卡豆+现金 时存在，批采时不存在 */}
      {sellType === 'single' && priceType === 'self' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'sellBean']}
            rules={[{ required: true, message: '请输入卡豆' }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              disabled={editDisabled}
              addonAfter="卡豆"
              precision={0}
              min={0}
              style={styleObj}
            ></InputNumber>
          </Form.Item>
        </div>
      )}
      {/* 最小起订量 */}
      {/* // 批采时存在，零售时不存在 */}
      {sellType === 'batch' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'minPurchaseNum']}
            rules={[{ required: true, message: '请输入最小起订量' }]}
            style={{ marginBottom: 0 }}
          >
            <Input style={styleObj}></Input>
          </Form.Item>
        </div>
      )}
      {/* 批采价 */}
      {/* // 批采时存在，零售时不存在 */}
      {sellType === 'batch' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'batchLadderObjects']}
            rules={[{ required: true, message: '请输入批采价' }]}
            style={{ marginBottom: 0 }}
          >
            <Button type="link" onClick={() => setTieredModal(true)}>
              {list.length > 0 ? '已设置' : '设置'}
            </Button>
          </Form.Item>
        </div>
      )}
      {/* 初始库存 */}
      <div className={styles.table_row_cell}>
        <Form.Item
          name={[field.name, 'initStock']}
          rules={[{ required: true, message: '请输入商品库存' }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            disabled={editDisabled}
            precision={0}
            min={0}
            max={100000000}
            style={styleObj}
          ></InputNumber>
        </Form.Item>
      </div>
      <TieredPricing
        form={form}
        visible={tieredModal}
        onClose={() => setTieredModal(false)}
        specificationDisabled={true}
        name={field.name}
      ></TieredPricing>
    </div>
  );
}

export default FormList;
