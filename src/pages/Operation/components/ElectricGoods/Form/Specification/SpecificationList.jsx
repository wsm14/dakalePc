import React from 'react';
import { Form } from 'antd';

function SpecificationList() {
  return (
    <Form.List label="规格信息" name="skuInfoReqs">
      {/* {(fields, { add, remove, move }, { errors }) => {
        return (
          <>
            {goodsType.includes('hittingRewardActualGoodsObject') && (
              <Button type="link" onClick={() => add()}>
                +新增
              </Button>
            )}
            <Form.ErrorList errors={errors} />
            {fields.map((field) => (
              <FormListActual
                initialValues={initialValues}
                name={['hittingRewardActualGoodsObject', 'subRewardList']}
                key={field.fieldKey}
                form={form}
                fields={fields}
                field={field}
                remove={remove}
                add={add}
              ></FormListActual>
            ))}
          </>
        );
      }} */}
    </Form.List>
  );
}

export default SpecificationList;
