import React, { useEffect, useMemo, useState } from 'react'
import { Button, Image, Tabs, Upload, message } from 'antd'
import { Modal as ReactModal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import qs from 'qs'
import { UploadOutlined } from '@ant-design/icons'
import Table from 'components/app/table'
import getAssetsColumn from '../../../components/app/CommonTableFormatter/assetsManagementTableFormatter'
import actions from '../../../redux/assetsManagement/actions'
import style from '../../banner/style.module.scss'

const { TabPane } = Tabs

const mapStateToProps = ({ allAssets, dispatch, router }) => {
  return {
    allAssets,
    dispatch,
    router,
  }
}

const Index = ({
  allAssets: {
    allAssets: { data, loading },
  },
  dispatch,
}) => {
  const [selectedTab, setSelectedTab] = useState('web-assets')
  const [previewImage, setPreviewImage] = useState({ src: '', visible: false })
  const [openUploadModal, setOpenUploadModal] = useState(false)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (!loading && openUploadModal) {
      closeModal()
    }
    // intentionally only react to loading finishing (upload complete)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const handleTableRender = (columns, tableData, isLoading) => {
    return (
      <Table
        columns={columns}
        dataSource={tableData}
        loading={isLoading}
        pageSize={10}
        defaultPagination
      />
    )
  }

  const tabChange = e => {
    setSelectedTab(e)
    dispatch({
      type: actions.FETCH_ALL_ASSETS,
      payload: {
        queryString: qs.stringify({
          path: e,
        }),
      },
    })
  }

  useEffect(() => {
    dispatch({
      type: actions.FETCH_ALL_ASSETS,
      payload: {
        queryString: qs.stringify({
          path: selectedTab,
        }),
      },
    })
    // mount-only fetch; tab changes handled by tabChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changePreviewImage = (visible, src) => {
    if (visible) setPreviewImage({ visible: true, src })
    else setPreviewImage({ visible: false, src: '' })
  }

  const closeModal = () => {
    setOpenUploadModal(false)
    setFileList([])
  }

  const OperationsSlot = useMemo(
    () => ({
      right: (
        <Button
          type="primary"
          className="mr-4"
          onClick={() => {
            setOpenUploadModal(true)
          }}
        >
          Upload
        </Button>
      ),
    }),
    [],
  )

  const uploadFile = () => {
    if (!fileList?.length || loading) return
    const formData = new FormData()
    formData.append('image', fileList[0])
    formData.append('path', selectedTab)
    dispatch({
      type: actions.UPLOAD_ASSETS,
      payload: {
        file: formData,
        queryString: qs.stringify({
          path: selectedTab,
        }),
      },
    })
  }

  const removeFile = ({ s3Key }) => {
    if (!s3Key?.trim() || loading) return
    dispatch({
      type: actions.REMOVE_ASSETS,
      payload: {
        key: s3Key,
        queryString: qs.stringify({
          path: selectedTab,
        }),
      },
    })
  }

  const UploadProps = {
    accept: 'image/*',
    onRemove: () => {
      setFileList([])
    },
    beforeUpload: file => {
      const isImage = file.type === 'image/png' || file.type === 'image/jpeg'
      if (isImage) {
        setFileList([file])
      } else {
        message.error(`${file.name} is not a valid image file`)
      }
      return false
    },
  }

  const assetsColumn = getAssetsColumn(removeFile, changePreviewImage)

  return (
    <div>
      <Helmet title="Users: List" />
      <div className="cui__utils__heading">
        <strong>All {selectedTab === 'web-assets' ? 'Web Assets' : 'Mail Assets'}</strong>
      </div>
      <div className="card">
        <Tabs
          onChange={tabChange}
          activeKey={selectedTab.toString()}
          className={`${style.tabs} kit-tabs-bordered`}
          defaultActiveKey="1"
          tabBarExtraContent={OperationsSlot}
        >
          <TabPane tab="Web Assets" key="web-assets">
            <div className="card-body p-0">
              <div className="text-nowrap">{handleTableRender(assetsColumn, data, loading)}</div>
            </div>
          </TabPane>
          <TabPane tab="Mail Assets" key="email-assets">
            <div className="card-body p-0">
              <div className="text-nowrap">{handleTableRender(assetsColumn, data, loading)}</div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <Image
        width={200}
        style={{ display: 'none' }}
        preview={{
          visible: previewImage.visible,
          src: `${process.env.REACT_APP_CDN_URL}/${previewImage.src}`,
          onVisibleChange: () => {
            changePreviewImage(false, '')
          },
        }}
      />

      <ReactModal isOpen={openUploadModal} toggle={closeModal} size="md">
        <ModalHeader className="pt-3 pb-1" toggle={closeModal}>
          Upload Image
        </ModalHeader>
        <ModalBody>
          <div>
            <Upload {...UploadProps} fileList={fileList} disabled={loading}>
              <Button icon={<UploadOutlined />}>Upload image</Button>
            </Upload>
          </div>
        </ModalBody>
        <ModalFooter className="d-block">
          <div className="text-right mt-3 mb-3">
            <>
              <Button type="default" onClick={closeModal}>
                Cancel
              </Button>
              &nbsp;&nbsp;
              <Button
                type="primary"
                disabled={!fileList?.length || loading}
                onClick={() => uploadFile()}
              >
                Upload image
              </Button>
            </>
          </div>
        </ModalFooter>
      </ReactModal>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
