import React from 'react';
import { connect } from 'umi';
import { Button, Form, Card } from 'antd';
import FormCondition from '@/components/FormCondition';

const DataGatherExport = (props) => {
  const [form] = Form.useForm();

  const formItems = [
    {
      label: '数据选择',
      type: 'select',
      name: 'datatype',
    },
    {
      label: '时间范围',
      type: 'rangePicker',
      name: 'time',
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
    },
    {
      type: 'checkbox',
      name: 'check',
      select: [{ label: '一种数据类型一天只允许导出一次', value: '1' }],
      wrapperCol: { offset: 6, span: 12 },
    },
  ];

  //导出
  const exportData = () => {
    form.validateFields().then((values) => {
      delete values.check;
      console.log(values);

      const payload = {
        ...values,
        startTime: values.startTime[0].format('YYYY-MM-DD HH:mm'),
        endTime: values.startTime[1].format('YYYY-MM-DD HH:mm'),
      };
      dispatch({
        type: 'baseData/fetchimportExcel',
        payload,
      });
    });
  };

  return (
    <Card>
      <div style={{ width: '500px', minHeight: '400px' }}>
        <FormCondition formItems={formItems} form={form}></FormCondition>
        <Button
          type="primary"
          style={{ margin: '30px 125px' }}
          onClick={exportData}
          loading={loading}
        >
          导出CSV
        </Button>
      </div>
    </Card>
  );
};
export default connect(({ baseData, loading }) => ({
  baseData,
  loading: loading.effects['baseData/fetchimportExcel'],
}))(DataGatherExport);
