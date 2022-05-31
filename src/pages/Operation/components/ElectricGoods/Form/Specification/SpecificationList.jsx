import React from 'react';
import { Form } from 'antd';
import FormList from './FormList';
import styles from './style.less';

function SpecificationList(props) {
  const { specificationTypeData, form, initialValues, sellType } = props;
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
              <div>原价</div>

              {sellType === 'single' ? (
                <>
                  <div>结算价</div>
                  <div>零售价</div>
                </>
              ) : (
                <>
                  <div>最小起订量</div>
                  <div>批采价</div>
                </>
              )}
              <div>商品库存</div>
            </div>
            {fields.map((field) => (
              <FormList
                sellType={sellType}
                initialValues={initialValues}
                // name={['skuInfoReqs', 'subRewardList']}
                key={field.fieldKey}
                form={form}
                fields={fields}
                field={field}
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
