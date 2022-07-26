import React from 'react';
import { connect } from 'umi';
import { Button, Form, Card } from 'antd';
import FormCondition from '@/components/FormCondition';
import { EXPORT_TYPE } from '@/common/constant';

const DataGatherExport = (props) => {
  const { loading, dispatch } = props;
  const [form] = Form.useForm();

  const formItems = [
    {
      label: '数据选择',
      type: 'select',
      name: 'type',
      select: EXPORT_TYPE,
    },
    {
      label: '时间范围',
      type: 'rangePicker',
      name: 'startTime',
      end: 'endTime',
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
    },
    {
      name: 'check',
      type: 'checkbox',
      select: [{ label: '一种数据类型一天只允许导出一次', value: '1' }],
      rules: [{ required: true, message: '请勾选一种数据类型一天只允许导出一次' }],
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
        type: 'baseData/fetchImportExcel',
        payload,
      });
    });
  };

  return (
    <Card>
      <div style={{ width: '600px' }}>
        <FormCondition formItems={formItems} form={form}></FormCondition>
        <Button
          type="primary"
          style={{ margin: '0 150px 50px' }}
          onClick={exportData}
          loading={loading}
        >
          导出Excel
        </Button>
      </div>
    </Card>
  );
};
export default connect(({ baseData, loading }) => ({
  baseData,
  loading: loading.effects['baseData/fetchImportExcel'],
}))(DataGatherExport);
