import React, { useState, useEffect } from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Modal } from 'antd';

export default ({ pForm }) => {
  const [form] = Form.useForm();
  const jumpUrl = Form.useWatch('jumpUrl', pForm) || '';

  const [visible, setVisible] = useState(false); // 打开弹窗

  useEffect(() => {
    if (visible) {
      // 参数还原
      const oldPrams = getRequest(jumpUrl);
      const oldData = Object.keys(oldPrams).map((i) => ({ key: i, data: oldPrams[i] }));
      form.setFieldsValue({ urlParams: oldData });
    }
  }, [visible]);

  // 确认
  const handleOnSumbit = () => {
    form.validateFields().then((values) => {
      const { urlParams = [] } = values;
      // 数组转化为对象
      let obj = {};
      urlParams.forEach(({ key, data }) => {
        if (key && data) obj[key] = data;
      });
      const oldUrl = jumpUrl.split('?')[0];
      // 新URL
      const newUrl = queryParams(oldUrl, obj);
      // 设置新的URL
      pForm.setFieldsValue({ jumpUrl: `${decodeURIComponent(oldUrl)}${newUrl}` });
      setVisible(false);
    });
  };

  /**
   * 获取URL中的参数名及参数值的集合
   * URL:http://www.getrequest.html?uid=admin&rid=1&fid=2&name=小明
   * @param {[string]} urlStr 当该参数不为空的时候，则解析该url中的参数集合
   * @return {[string]}       [参数集合]
   */
  function getRequest(urlStr) {
    const url = '?' + urlStr.split('?')[1];
    const theRequest = new Object();
    if (urlStr.indexOf('?') != -1) {
      let str = url.substring(1);
      const strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
      }
    }
    return theRequest;
  }

  /**
   * 对象转url参数
   * @param {*} data
   */
  const queryParams = (url, data) => {
    if (!data) return '';
    let _result = [];
    for (let key in data) {
      let value = data[key];
      // 去掉为空的参数
      if (['', undefined, null, 'undefined', 'null'].includes(value)) {
        continue;
      }
      if (Array.isArray(value)) {
        value = value.toString();
      }
      _result.push(`${key}=${value}`);
    }
    return _result.length && url ? `${url.includes('?') ? '' : '?'}` + _result.join('&') : '';
  };

  return (
    <>
      <Form.Item label={`参数`}>
        <Button
          type="dashed"
          disabled={!jumpUrl}
          onClick={() => setVisible(true)}
          style={{ width: '60%' }}
          icon={<PlusOutlined />}
        >
          添加参数
        </Button>
      </Form.Item>
      <Modal
        title={`添加参数 - ${jumpUrl}`}
        destroyOnClose
        zIndex={1010}
        visible={visible}
        afterClose={() => form.resetFields()}
        onCancel={() => setVisible(false)}
        onOk={handleOnSumbit}
      >
        <Form form={form}>
          <Form.Item label={`参数`}>
            <Form.List name={'urlParams'}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: '60%', marginBottom: 16 }}
                      icon={<PlusOutlined />}
                    >
                      添加
                    </Button>
                    {fields.map((field, name) => (
                      <Form.Item key={field.key} style={{ marginBottom: 10 }}>
                        <Input.Group compact>
                          <Form.Item name={[name, 'key']} noStyle>
                            <Input style={{ width: 120 }} placeholder="请输入key"></Input>
                          </Form.Item>
                          <Form.Item name={[name, 'data']} noStyle>
                            <Input style={{ width: 250 }} placeholder="请输入参数值"></Input>
                          </Form.Item>
                          <MinusCircleOutlined
                            style={{ fontSize: 20, marginLeft: 15, lineHeight: '32px' }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        </Input.Group>
                      </Form.Item>
                    ))}
                  </>
                );
              }}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
