import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Tag, Input, Tooltip, Modal, Form, Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import FormCondition from '@/components/FormCondition';
import './index.less';

const { CheckableTag } = Tag;

const TagModal = (props) => {
  const { visible, onClose, dispatch } = props;
  const { show = false, setTagList = null, oldTag = [] } = visible;

  const [form] = Form.useForm();
  const [tags, setTags] = useState([]); // 所有标签
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState('-1');
  const [editInputValue, setEditInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // 已选中tag

  useEffect(() => {
    if (show) {
      // setTags(tagArr);
      handleGetTags();
      setSelectedTags(oldTag);
    }
  }, [show]);

  const saveEditInputRef = useRef();
  const saveInputRef = useRef();

  // 获取标签列表
  const handleGetTags = () => {
    dispatch({
      type: 'userFollow/fetchGetDictionaryAdmin',
      payload: {
        parent: 'userFollowUp',
        child: 'tags',
      },
      callback: (tag) => {
        const { extraParam = '' } = tag;
        const tagArr = extraParam ? extraParam.split(',') : [];
        setTags(tagArr);
      },
    });
  };

  // 新增标签列表
  const handleSetTags = (val) => {
    dispatch({
      type: 'userFollow/fetchSetUserFollowUpTags',
      payload: {
        dictionaryId: '1417829187663585300',
        extraParam: val,
      },
      callback: () => {
        handleGetTags();
      },
    });
  };

  //  确定
  const handleFinish = () => {
    form.validateFields().then((values) => {
      const { extraParam = [] } = values;
      // const newTags = Array.from(new Set([...oldTag, ...extraParam]));
      // setTagList(newTags);
      setTagList(extraParam);
      onClose();
    });
  };

  // 点击选择标签
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

  // 脱标时新增标签
  const handleInputConfirm = () => {
    setInputVisible(false);
    if (inputValue === '') return;
    console.log(inputValue, tags, 'handleInputConfirm');
    let newTag = [...tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTag = [...tags, inputValue];
    }
    // setTags(newTag);
    handleSetTags(newTag.join(','));
    // handleSetTags('品类问题,视频问题,商家问题');
    // handleGetTags();
    setInputValue('');
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
                className="edit-tag-modal"
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
            <AuthConsumer auth="addTags">
              <Tag color="#108ee9" className="site-tag-plus" onClick={showInput}>
                {/* <PlusOutlined /> New Tag */}
                新增
              </Tag>
            </AuthConsumer>
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

export default connect(({ loading }) => ({
  loading: loading.models.userFollow,
}))(TagModal);
