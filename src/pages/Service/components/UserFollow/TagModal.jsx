import React, { useState, useEffect, useRef } from 'react';
import { Tag, Input, Tooltip, Modal, Form, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormCondition from '@/components/FormCondition';
import './index.less';

const { CheckableTag } = Tag;

const TagModal = (props) => {
  const { visible, onClose } = props;
  const { show = false, tagArr = [], setTagList = null, oldTag = [] } = visible;
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState('-1');
  const [editInputValue, setEditInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  useEffect(() => {
    if (show) {
      setTags(tagArr);
    }
  }, [show]);

  const saveEditInputRef = useRef();
  const saveInputRef = useRef();

  const handleFinish = () => {
    form.validateFields().then((values) => {
      const { extraParam = [] } = values;
      const newTags = Array.from(new Set([...oldTag, ...extraParam]));
      setTagList(newTags);
      onClose();
    });
  };

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
    form.setFieldsValue({
      extraParam: nextSelectedTags,
    });
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      saveInputRef.current?.focus();
    }, 100);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    console.log(inputValue, tags, 'handleInputConfirm');
    let newTag = [...tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTag = [...tags, inputValue];
    }
    setTags(newTag);
    setInputValue('');
    setInputVisible(false);
    // form.setFieldsValue({ extraParam: newTag });
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    // form.setFieldsValue({ extraParam: newTags });
    setEditInputIndex('-1');
    setEditInputValue('');
  };

  const modalProps = {
    zIndex: 1002,
    title: '选择标签',
    visible: show,
    onCancel: onClose,
    afterCallBack: () => {
      setTags([]);
    },
    footer: (
      <Button onClick={handleFinish} type="primary">
        确认
      </Button>
    ),
  };

  const formItems = [
    {
      label: '标签',
      type: 'formItem',
      name: 'extraParam',
      rules: [{ required: false }],
      formItem: (
        <>
          {tags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={saveEditInputRef}
                  key={tag}
                  size="small"
                  className="tag-input"
                  value={editInputValue}
                  onChange={handleEditInputChange}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }
            const isLongTag = tag.length > 20;
            const tagElem = (
              <CheckableTag
                className="edit-tag"
                key={tag}
                checked={selectedTags.indexOf(tag) > -1}
                onChange={(checked) => handleChange(tag, checked)}
              >
                <span
                  onDoubleClick={(e) => {
                    setEditInputIndex(index);
                    setEditInputValue(tag);
                    setTimeout(() => {
                      saveEditInputRef.current?.focus();
                    }, 100);
                    e.preventDefault();
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </CheckableTag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible && (
            <Input
              ref={saveInputRef}
              type="text"
              size="small"
              className="tag-input"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag className="site-tag-plus" onClick={showInput}>
              <PlusOutlined /> New Tag
            </Tag>
          )}
        </>
      ),
    },
  ];
  return (
    <Modal {...modalProps}>
      <FormCondition formItems={formItems} form={form} />
    </Modal>
  );
};
export default TagModal;
