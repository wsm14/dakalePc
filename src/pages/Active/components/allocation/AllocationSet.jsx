import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Drawer, Button, Space, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import aliOssUpload from '@/utils/aliOssUpload';
import QuestionTooltip from '@/components/QuestionTooltip';
import FormCondition from '@/components/FormCondition';
import SearchData from './searchData/searchDataContent';

const AllocationSet = (props) => {
  const { loading, dispatch, childRef, records = {}, userOs, promotionId, show, onClose } = props;
  const { promotionContentJson = [] } = records;

  const intalObj = {};
  // 默认遍历数据获取数据默认值
  promotionContentJson.map((ikey) => (intalObj[ikey.key] = ikey.value));

  const [form] = Form.useForm();
  const [nativeList, setNativeList] = useState([]);
  const [visibleUrl, setVisibleUrl] = useState('');
  const [visibleSearch, setVisibleSearch] = useState({ visible: false, valueName: '', type: '' });

  // 提交表单
  const fetchDataEdit = () => {
    form.validateFields().then((values) => {
      // 图片的key
      const imgKey = [];
      // 需要上传的图片获取
      const imgArr = promotionContentJson
        .map(({ type, key }) => {
          if (type === 'image') {
            const val = values[key];
            imgKey.push(key);
            delete values[key];
            return typeof val === 'string' ? val : val.fileList[0].originFileObj;
          }
        })
        .filter((i) => i);
      delete records.promotionContentJson;
      // 上传图片
      aliOssUpload(imgArr).then((res) => {
        dispatch({
          type: 'activeAllocation/fetchAllocationSetEdit',
          payload: {
            ...records,
            ...values,
            userOs,
            promotionId,
            // 还原数据格式
            promotionContent: JSON.stringify(
              promotionContentJson.map((item) => ({
                ...item,
                value: item.type === 'image' ? res[imgKey.indexOf(item.key)] : values[item.key],
              })),
            ),
          },
          callback: () => {
            childRef.current.fetchGetData();
            onClose();
          },
        });
      });
    });
  };

  // 获取native选择项目
  const fetchAllocationNative = () => {
    dispatch({
      type: 'activeAllocation/fetchAllocationNative',
      callback: (val) => setNativeList(val.map((item) => ({ value: item.id, name: item.name }))),
    });
  };

  useEffect(() => {
    if (show) {
      fetchAllocationNative();
      setVisibleUrl(records.jumpType);
    }
  }, [show]);

  const formItems = [
    ...promotionContentJson.map((item) => ({
      label: item.desc,
      type: item.type === 'image' ? 'upload' : 'input',
      name: item.key,
      maxFile: 1,
    })),
    {
      label: '活动名称',
      name: 'promotionName',
    },
    {
      label: '跳转类型',
      name: 'jumpType',
      type: 'select',
      onChange: (val) => setVisibleUrl(val),
      select: [
        { value: 'h5', name: 'H5' },
        { value: 'native', name: 'Native' },
      ],
    },
    {
      label: '跳转页面',
      name: 'jumpUrl',
      visible: visibleUrl === 'h5',
      addonAfter: (
        <SearchOutlined
          onClick={() => setVisibleSearch({ visible: true, valueName: 'jumpUrl', type: 'url' })}
        />
      ),
    },
    {
      label: '跳转页面',
      name: 'nativeId',
      type: 'select',
      visible: visibleUrl === 'native',
      select: nativeList,
    },
  ];

  return (
    <>
      <Drawer
        title={
          <QuestionTooltip
            placement="bottom"
            title={`活动设置：${records.promotionTypeName}`}
            overlayStyle={{ maxWidth: 300 }}
            content={
              <>
                <div>展示位置：</div>
                <div style={{ textAlign: 'center' }}>
                  <img src={records.promotionImage} alt="" style={{ maxWidth: 250 }} />
                </div>
              </>
            }
          ></QuestionTooltip>
        }
        width={600}
        visible={show}
        onClose={onClose}
        destroyOnClose
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button onClick={fetchDataEdit} type="primary" loading={loading}>
                确认
              </Button>
            </Space>
          </div>
        }
      >
        <FormCondition
          formItems={formItems}
          form={form}
          initialValues={{ ...records, ...intalObj }}
        />
      </Drawer>
      <SearchData
        form={form}
        {...visibleSearch}
        onCancel={() => setVisibleSearch({ show: false })}
      ></SearchData>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.activeAllocation,
}))(AllocationSet);
