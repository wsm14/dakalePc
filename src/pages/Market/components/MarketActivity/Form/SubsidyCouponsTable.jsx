import React, { useState } from 'react';
import { Form, Button, Space, Tag } from 'antd';
import { PLATFORM_TICKET_TYPE, TAG_COLOR_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import GoodsSelectModal from '@/components/GoodsSelectModal';

// 赠送平台券 表格
const SubsidyCouponsTable = (props) => {
  const { form } = props;

  // 补贴规则
  const subsidyList = Form.useWatch(['useRuleObject', 'subsidy', 'coupons'], form) || [];
  const [visible, setVisible] = useState(false); // 弹窗

  // 选择券
  const handleSelectCoupon = (list) => {
    const oldData = form.getFieldValue(['useRuleObject', 'subsidy', 'coupons']) || [];
    form.setFieldsValue({
      useRuleObject: {
        subsidy: {
          coupons: [...oldData, ...list.map((i) => ({ ...i, couponId: i.goodsId }))],
        },
      },
    });
  };

  const getColumns = (remove) => [
    {
      title: '券类型',
      align: 'center',
      width: 100,
      dataIndex: 'classType',
      render: (val, row) => (
        <Tag color={TAG_COLOR_TYPE[row.useScenesType][val]}>
          {PLATFORM_TICKET_TYPE[row.useScenesType][val]}
        </Tag>
      ),
    },
    {
      title: '名称/ID',
      dataIndex: 'couponName',
      render: (val, row) => (
        <>
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
          <div>{row?.goodsId}</div>
        </>
      ),
    },
    {
      title: '券价值/使用门槛/券描述',
      dataIndex: 'createTime',
      dataIndex: 'couponValue',
      render: (val, row) => (
        <div>
          <div>
            ￥{val}(满{row.thresholdPrice}元可用)
          </div>
          {row.couponDesc && (
            <div>
              <Ellipsis length={10} tooltip>
                {row.couponDesc}
              </Ellipsis>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '券有效期',
      align: 'right',
      dataIndex: 'activeDate',
      render: (val, row) => {
        const {
          endDate,
          delayDays = 0, // 使用有效期-领取后-延迟生效天数
          activeDays, // 使用有效期-领取后-有效天数
        } = row;
        return val && endDate
          ? `${val}\n~${endDate}`
          : delayDays != 0
          ? `领取后 ${delayDays} 天生效\n有效期 ${activeDays} 天`
          : `领取后 ${activeDays} 天内`;
      },
    },
    {
      title: '剩余数量',
      align: 'right',
      width: 100,
      dataIndex: 'remain',
    },
    {
      type: 'handle',
      width: 60,
      dataIndex: 'platformCouponId',
      render: (val, row, index) => {
        return [
          {
            type: 'del',
            auth: true,
            click: () => remove(index),
          },
        ];
      },
    },
  ];

  return (
    <>
      <Form.List
        name={['useRuleObject', 'subsidy', 'coupons']}
        rules={[
          {
            validator: async (_, datas) => {
              if (!datas || !datas.length) return Promise.reject(new Error('请添加券'));
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <Space direction={'vertical'}>
            <Button type="dashed" onClick={() => setVisible(true)} style={{ width: 250 }}>
              添加
            </Button>
            <div style={{ color: '#00000073', whiteSpace: 'pre-line', lineHeight: 1.5715 }}>
              1. 不支持选择券规则中带有城市规则的券{`\n`}2. 仅支持选择手动领取的券
            </div>
            <Form.ErrorList errors={errors} />
            <div style={{ width: 460 }}>
              <TableDataBlock
                scroll={{ x: 831 }}
                tableSize={'small'}
                noCard={false}
                columns={getColumns(remove)}
                rowKey={(record) => `${record.couponId}`}
                list={subsidyList}
                pagination={false}
              ></TableDataBlock>
            </div>
          </Space>
        )}
      </Form.List>
      <GoodsSelectModal
        visible={visible}
        showTag={['platformCoupon']}
        disabled={(row) => subsidyList.some((i) => i.couponId === row.goodsId)}
        onClose={() => setVisible(false)}
        onSumbit={({ list }) => handleSelectCoupon(list)}
      ></GoodsSelectModal>
    </>
  );
};
export default SubsidyCouponsTable;
