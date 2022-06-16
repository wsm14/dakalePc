import React, { useState } from 'react';
import update from 'immutability-helper';
import { Form, Button, Space, Input } from 'antd';
import { EnvironmentOutlined, DeleteOutlined } from '@ant-design/icons';
import { Cascader } from '@/components/FormCondition/formModule';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import MapSearchModal from '../MapSearchModal';

const FormItemHidden = ({ name }) => {
  return (
    <Form.Item name={name} hidden={true}>
      <Input />
    </Form.Item>
  );
};

/**
 * 仓库信息
 */
const WarehouseFormList = ({ form }) => {
  const [visible, setVisible] = useState(false); // 弹窗显示

  // 更新数据
  const updateData = (index, val) => {
    const logisticList = form.getFieldValue('logisticList') || [];
    form.setFieldsValue({
      logisticList: update(logisticList, {
        $splice: [[index, 1, { ...(logisticList[index] || {}), ...val }]],
      }),
    });
  };

  const formItems = (field) => [
    {
      label: '收货人',
      children: (
        <Form.Item
          name={[field.name, 'addressName']}
          rules={[{ required: true, message: '请输入收货人姓名' }]}
          noStyle
        >
          <Input placeholder="请输入收货人姓名" />
        </Form.Item>
      ),
    },
    {
      label: '手机号码',
      children: (
        <Form.Item
          name={[field.name, 'mobile']}
          rules={[{ required: true, message: '请输入手机号码' }]}
          noStyle
        >
          <Input placeholder="请输入手机号码" />
        </Form.Item>
      ),
    },
    {
      label: '所在地区',
      children: (
        <>
          <Form.Item
            name={[field.name, 'cityList']}
            rules={[{ required: true, message: '请选择所在地区' }]}
            noStyle
          >
            <Cascader
              label="所在地区"
              allowClear
              style={{ width: '100%' }}
              onChange={(city) =>
                updateData(field.name, {
                  provinceCode: city[0],
                  cityCode: city[1],
                  districtCode: city[2],
                })
              }
            />
          </Form.Item>
          <FormItemHidden name={[field.name, 'provinceCode']} />
          <FormItemHidden name={[field.name, 'cityCode']} />
          <FormItemHidden name={[field.name, 'districtCode']} />
        </>
      ),
    },
    {
      label: '详细地址',
      children: (
        <>
          <Form.Item
            name={[field.name, 'address']}
            rules={[{ required: true, message: '请查询地址' }]}
            noStyle
          >
            <Input
              placeholder="请查询地址"
              readOnly
              addonAfter={
                <EnvironmentOutlined
                  onClick={() => setVisible({ index: field.name, show: true })}
                />
              }
            />
          </Form.Item>
          {/* 经纬度 */}
          <FormItemHidden name={[field.name, 'lnt']} />
          <FormItemHidden name={[field.name, 'lat']} />
        </>
      ),
    },
  ];

  return (
    <>
      <Form.List name={'logisticList'}>
        {(fields, { add, remove }, { errors }) => (
          <div style={{ paddingLeft: 40 }}>
            <Space direction={'vertical'} style={{ width: '100%' }}>
              <div style={{ color: '#00000073', lineHeight: 1.5715 }}>
                用户退款寄回商品时使用的地址信息
              </div>
              <Button type="dashed" onClick={() => add()} style={{ width: 250 }}>
                新增
              </Button>
              <Form.ErrorList errors={errors} />
              {fields.map((field, index) => (
                <DescriptionsCondition
                  key={`field${field.key}`}
                  title={
                    <span>
                      地址{index + 1}
                      <DeleteOutlined
                        style={{ cursor: 'pointer', marginLeft: 10 }}
                        onClick={() => remove(field.name)}
                      />
                    </span>
                  }
                  formItems={formItems(field)}
                ></DescriptionsCondition>
              ))}
            </Space>
          </div>
        )}
      </Form.List>
      {/* 地图搜索地址 */}
      <MapSearchModal
        visible={visible.show}
        onOk={(val) => updateData(visible.index, val)}
        onClose={() => setVisible(false)}
      ></MapSearchModal>
    </>
  );
};

export default WarehouseFormList;
