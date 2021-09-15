import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Button, Form, Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import './index.less';

const FeedBackDetail = ({ loading, visible, dispatch, onClose, cRef }) => {
  const { show = false } = visible;
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState('-1');
  const [editInputValue, setEditInputValue] = useState('');

  const saveEditInputRef = useRef();
  const saveInputRef = useRef();

  const handleClose = (removedTag) => {
    console.log(removedTag, 'removedTag');
    const tagsNew = tags.filter((tag) => tag !== removedTag);
    setTags(tagsNew);
  };

  const showInput = () => {
    setInputVisible(true);
    console.log(saveInputRef, 'saveInputRef');
    saveInputRef.current?.focus();
    // this.setState({ inputVisible: true }, () => this.input.focus());
  };

  const handleInputChange = (e) => {
    console.log(e, 'handleInputChange');
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    console.log(inputValue, tags, 'handleInputConfirm');
    let newTag = [];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTag = [...tags, inputValue];
    }
    setTags(newTag);
    setInputValue('');
    setInputVisible(false);
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex('-1');
    setEditInputValue('');
  };

  const formItems = [
    {
      type: 'select',
      label: '反馈内容',
      name: 'content',
    },
    {
      label: '反馈标签',
      type: 'formItem',
      name:'tags',
      rules: [{ required: true }],
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
              <Tag className="edit-tag" key={tag} closable onClose={() => handleClose(tag)}>
                <span
                  onDoubleClick={(e) => {
                   
                    setEditInputIndex(index);
                    setEditInputValue(tag);
                    saveEditInputRef.current?.focus();
                    // this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                    //   this.editInput.focus();
                    // });
                    e.preventDefault();
               
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
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

  const handleFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'serviceFeedBack/',
        payload: {
          ...values,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    title: '类型配置',
    visible: show,
    onClose,
    footer: (
      <Button onClick={handleFinish} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} />
    </DrawerCondition>
  );
};
export default connect(({ loading }) => ({
  loading: loading.models.serviceFeedBack,
}))(FeedBackDetail);
