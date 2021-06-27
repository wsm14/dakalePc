import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Tag, Modal } from 'antd';
import GoodsItemSet from '../GoodsItemSet';
const { CheckableTag } = Tag;

const tagsData = ['中餐', '西餐', '娱乐', '套餐'];
const PlatformProductTag = (props) => {
  const { key } = props;
  const [visible, setsVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([])
  const [list, setList] = useState([])

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags)
  }

  const handleClose = removedTag => {
    const newtags = list.filter(tag => tag !== removedTag);
    console.log(newtags);
    setList(newtags)
    setSelectedTags(newtags)
  };

  const handleOk = () => {
    setList(selectedTags)
    setsVisible(false)
  }

  return (
    <Form.Item label="平台商品标签" name={key} key={key} rules={[{ required: true, message: '请添加平台商品标签!' }]}>
      {list.map(item => <Tag
        closable
        key={item}
        onClose={() => handleClose(item)}
      >
        {item}
        </Tag>)}
      <Modal title="选择商品标签" visible={visible} onOk={() => handleOk()} onCancel={() => setsVisible(false)}>
        <Form.Item label="选择标签" rules={[{ required: true }]}> {tagsData.map(tag => (
          <CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={checked => handleChange(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
        </Form.Item>
      </Modal>
      <Button size="small" onClick={() => setsVisible(true)}> + </Button>
    </Form.Item>
  );
};

export default PlatformProductTag;
