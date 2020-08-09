import React from 'react'
import { Upload, Modal, } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import upload from '@/utils/FileUpLoadOss'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function filterList(list) {
  let array = []
  list.forEach((item, index) => {
    let obj = {}
    obj.uid = index,
      obj.name = item,
      obj.status = 'done',
      obj.url = item
    array.push(obj)
  })
  return array
}

class PicturesWall extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
    }
  }

  handleCancel = () => this.setState({ previewVisible: false }); //关闭放大缩略图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  }; //点击查看缩略图
  uploadOss = (files) => {
    const { setStateDate } = this.props
    const { file } = files
    upload(file, res => {
      const list = [...this.props.fileList]
      list.push(res.url)
      setStateDate(list)
    })
  }
  onRemove = (file) => {
    const { setStateDate } = this.props
    let list = [...this.props.fileList]
    list = list.filter(item => {
      if (!item.includes(file.url)) {
        return item
      }
    })
    setStateDate([...list])
  }
  render() {
    const { previewVisible, previewImage, previewTitle } = this.state;
    const { fileList, style, size } = this.props
    const uploadButton = (
      <div>
        <PlusOutlined />
      </div>
    );
    return (
      <div style={style} className="clearfix">
        <Upload
          listType="picture-card"
          onPreview={this.handlePreview}
          fileList={filterList(fileList)}
          customRequest={this.uploadOss}
          onRemove={this.onRemove}
          onChange={this.onChange}
          accept="image/png,image/jpeg,image/jpg"
        >
          {fileList.length >= size ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall
