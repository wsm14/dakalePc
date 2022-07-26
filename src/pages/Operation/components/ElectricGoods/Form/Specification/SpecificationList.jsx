import React from 'react';
import { Form } from 'antd';
import FormList from './FormList';
import BulkEditing from './BulkEditing';
import styles from './style.less';

function SpecificationList(props) {
  const {
    specificationTypeData,
    form,
    initialValues,
    sellType, // 售卖类型
    priceType, // 售卖价格类型
    editDisabled,
  } = props;
  return (
    <Form.List label="规格信息" name="skuInfoReqs">
      {(fields, { add, remove, move }, { errors }) => {
        return (
          <div className={styles.table_box}>
            <div className={styles.table_head}>
              <div>SKU码</div>
              {specificationTypeData.length > 0 ? (
                <div>{specificationTypeData.map((item) => item.name).join('/')}</div>
              ) : null}
              <div>图片</div>
              <div>
                <span style={{ color: 'red' }}>*</span>原价
                <BulkEditing form={form} editKey="oriPrice"></BulkEditing>
              </div>
              {sellType === 'single' && (
                <div>
                  <span>成本价</span>
                  <BulkEditing form={form} editKey="costPrice"></BulkEditing>
                </div>
              )}

              {sellType === 'single' && (
                <div>
                  <span style={{ color: 'red' }}>*</span>结算价
                  <BulkEditing form={form} editKey="settlePrice"></BulkEditing>
                </div>
              )}
              {sellType === 'single' && priceType !== 'free' && (
                <div>
                  <span style={{ color: 'red' }}>*</span>零售价
                  <BulkEditing form={form} editKey="sellPrice"></BulkEditing>
                </div>
              )}
              {sellType === 'single' && priceType === 'self' && (
                <div>
                  <span style={{ color: 'red' }}>*</span>卡豆
                  <BulkEditing form={form} editKey="sellBean"></BulkEditing>
                </div>
              )}
              {sellType === 'batch' && (
                <>
                  <div>
                    <span style={{ color: 'red' }}>*</span>最小起订量
                    <BulkEditing form={form} editKey="minPurchaseNum"></BulkEditing>
                  </div>
                  <div>
                    <span style={{ color: 'red' }}>*</span>批采价
                    <BulkEditing form={form} editKey="batchLadderObjects"></BulkEditing>
                  </div>
                </>
              )}
              <div>
                <span style={{ color: 'red' }}>*</span>商品库存
                <BulkEditing form={form} editKey="initStock"></BulkEditing>
              </div>
            </div>
            {fields.map((field) => (
              <FormList
                initialValues={initialValues}
                key={field.fieldKey}
                form={form}
                fields={fields}
                field={field}
                sellType={sellType}
                priceType={priceType}
                editDisabled={editDisabled}
              ></FormList>
            ))}
            <Form.ErrorList errors={errors} />
          </div>
        );
      }}
    </Form.List>
  );
}

export default SpecificationList;
