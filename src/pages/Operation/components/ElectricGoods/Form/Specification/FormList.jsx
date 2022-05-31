import React, { useEffect } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import update from 'immutability-helper';
import Upload from '@/components/FormCondition/Upload/Img';
import aliOssUpload from '@/utils/aliOssUpload';
import styles from './style.less';

function FormList(props) {
  const {
    field,
    fields,
    form,
    initialValues,
    sellType, //售卖类型
  } = props;

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
            goodsImg: imgUrl.toString(),
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
      <div className={styles.table_row_cell}>
        <Form.Item name={[field.name, 'SKU']} noStyle>
          <Input style={styleObj}></Input>
        </Form.Item>
      </div>
      <div className={styles.table_row_cell}>{specificationType}</div>
      <div className={`${styles.table_row_cell} ${styles.upload_box}`}>
        <Form.Item
          name={[field.name, 'goodsImg']}
          rules={[{ required: true, message: '请上传图片' }]}
          noStyle
        >
          <Upload
            name={['skuInfoReqs', field.name, 'goodsImg']}
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
      <div className={styles.table_row_cell}>
        <Form.Item name={[field.name, 'oriPrice']} noStyle>
          <InputNumber addonBefore="￥" precision={2} min={0} style={styleObj}></InputNumber>
        </Form.Item>
      </div>
      // 零售时存在，批采时不存在
      {sellType === 'single' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'settlePrice']}
            rules={[{ required: true, message: '请输入结算价' }]}
            noStyle
          >
            <InputNumber addonBefore="￥" precision={2} min={0} style={styleObj}></InputNumber>
          </Form.Item>
        </div>
      )}
      // 零售时存在，批采时不存在
      {sellType === 'single' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'sellPrice']}
            rules={[{ required: true, message: '请输入零售价' }]}
            noStyle
          >
            <InputNumber addonBefore="￥" precision={2} min={0} style={styleObj}></InputNumber>
          </Form.Item>
        </div>
      )}
      // 批采时存在，零售时不存在
      {sellType === 'batch' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'minPurchaseNum']}
            rules={[{ required: true, message: '请输入最小起订量' }]}
            noStyle
          >
            <Input style={styleObj}></Input>
          </Form.Item>
        </div>
      )}
      // 批采时存在，零售时不存在
      {sellType === 'batch' && (
        <div className={styles.table_row_cell}>
          <Form.Item
            name={[field.name, 'batchLadderObjects']}
            rules={[{ required: true, message: '请输入批采价' }]}
            noStyle
          >
            <Input style={styleObj}></Input>
          </Form.Item>
        </div>
      )}
      <div className={styles.table_row_cell}>
        <Form.Item
          name={[field.name, 'initStock']}
          rules={[{ required: true, message: '请输入商品库存' }]}
          noStyle
        >
          <InputNumber precision={0} min={0} style={styleObj}></InputNumber>
        </Form.Item>
      </div>
    </div>
  );
}

export default FormList;
