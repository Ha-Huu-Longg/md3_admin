import { Button, Col, Image, Row, Space, Table, message, Input, Modal, Form, Select, Upload } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { createProduct, deleteProduct, getAllProduct, updateProduct } from '../axiosConfig/product'
import { DeleteOutlined, EditOutlined, StarOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { storage } from '../firebase/firebaseConfig'
import { ref, uploadBytes, listAll, getDownloadURL, uploadString } from 'firebase/storage'
import { v4 } from "uuid"

const { Search } = Input

const Columns = (expandedRowKeys, toggleDetail, handleConfirmDelete, handleOpenEditForm) => [
    {
        title: '#',
        dataIndex: "key",
        key: 'key',
        width: 50,
    },
    // {
    //     title: 'Id',
    //     dataIndex: 'Id',
    //     key: 'Id',
    //     width: 50,
    // },
    {
        title: 'Photo',
        dataIndex: 'HinhAnhSanPham',
        key: 'HinhAnhSanPham',
        width: 150,
        align: "center",
        render: (src) => (<Image width={100} src={src} />)
    },
    {
        title: 'Category',
        dataIndex: 'IdLoaiSanPham',
        key: 'IdLoaiSanPham',
        align: "center",
        width: 100,
        render: (category) => (<span>{category == 1 ? "Iphone" : category == 2 ? "Samsung" : category == 3 ? "Xiaomi" : "OnePlus"}</span>)
    },
    {
        title: 'Name',
        dataIndex: 'TenSanPham',
        key: 'TenSanPham',
        align: "center",
    },
    {
        title: 'Detail',
        dataIndex: 'MoTaSanPham',
        key: 'MoTaSanPham',
        align: "center",
        render: (text, record) => {
            return (
                <div>
                    {text.length > 30 ? (
                        <span>
                            {expandedRowKeys.includes(record.Id) ? text : `${text.slice(0, 30)}...`}
                            <Button type="link" onClick={() => toggleDetail(record)}>
                                {expandedRowKeys.includes(record.Id) ? 'Ẩn' : 'Xem đầy đủ'}
                            </Button>
                        </span>
                    ) : (
                        text
                    )}
                </div>
            );
        },
    },
    {
        title: 'Price',
        dataIndex: 'GiaSanPham',
        key: 'GiaSanPham',
        align: "center",
        width: 120,
        render: (price) => (<span>{Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>)
    },
    {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        width: 80,
        align: "center",
        render: (rating) => (<>{rating} <StarOutlined /></>)
    },
    {
        title: 'Action',
        key: 'action',
        align: "center",
        width: 200,
        render: (_, record) => (
            <Space size="middle">
                <Button icon={<EditOutlined />} onClick={() => handleOpenEditForm(record)}></Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => handleConfirmDelete(record.Id)}></Button>
            </Space>
        ),
    },
]

const Product = () => {

    const [products, setProducts] = useState([])
    const [productSearch, setProductSearch] = useState([])
    const [messageApi, contextHolder] = message.useMessage()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [idDelete, setIdDelete] = useState(null)
    const [dataUpdate, setDataUpdate] = useState(null)


    const formRef = useRef();

    const [imageUpload, setImageUpload] = useState(null)
    const [linkImage, setLinkImage] = useState("")
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const toggleDetail = (record) => {
        const newExpandedRowKeys = [...expandedRowKeys];
        if (newExpandedRowKeys.includes(record.Id)) {
            newExpandedRowKeys.splice(newExpandedRowKeys.indexOf(record.Id), 1);
        } else {
            newExpandedRowKeys.push(record.Id);
        }
        setExpandedRowKeys(newExpandedRowKeys);
    };

    const getAll = async () => {
        const response = await getAllProduct()
        if (response && response.data) {
            setProducts(addKeyForData(response.data))
            setProductSearch(addKeyForData(response.data))
        }
    }

    const addKeyForData = (data) => {
        if (!Array.isArray(data)) {
            return []
        }
        return data.map((value, i) => {
            return {
                ...value,
                key: i + 1
            }
        })
    }

    useEffect(() => {
        (async () => {
            await getAll()
        })()
    }, [])

    const onSearch = (value) => {
        const textSearch = value.trim().toLowerCase()
        const newProducts = products.filter((product) => product.TenSanPham.toLowerCase().includes(textSearch) ||
            product.MoTaSanPham.toLowerCase().includes(textSearch) || product.GiaSanPham.toLowerCase().includes(textSearch))
        setProductSearch(newProducts)
    }

    const handleReset = () => {
        formRef.current.resetFields()
    }

    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleOk = () => {
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        setIsOpenDelete(false)
        setIdDelete(null)
    }

    const onFinish = async (values) => {
        if (linkImage == "") {
            message.info("Choose Photo!")
            return
        }

        if (dataUpdate != null) {
            const rawData = {
                Id: dataUpdate.Id,
                ...values,
                idLoaiSanPham: convertIdCategory(values.idLoaiSanPham),
                hinhAnhSanPham: linkImage
            }
            if (rawData.hinhAnhSanPham.includes("https")) {
                const response = await updateProduct(rawData)
                if (response && response.data && response.status == 200) {
                    message.info(response.data)
                    handleCloseEditForm()
                    getAll()
                }
            } else {
                const imageRef = ref(storage, `image/${imageUpload.name + v4()}`)
                uploadBytes(imageRef, imageUpload)
                    .then((snapshot) => {
                        getDownloadURL(snapshot.ref)
                            .then((url) => {
                                return {
                                    ...rawData,
                                    hinhAnhSanPham: url
                                }
                            })
                            .then((data) => {
                                return updateProduct(data)
                            }).then((response) => {
                                if (response && response.data && response.status == 200) {
                                    message.info(response.data)
                                    handleCloseEditForm()
                                    getAll()
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                message.info("Firebase failure!")
                            })
                    })
                    .catch((error) => {
                        console.log(error);
                        message.info("Server failure!")
                    })
            }
            return
        }

        const imageRef = ref(storage, `image/${imageUpload.name + v4()}`)
        uploadBytes(imageRef, imageUpload)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        return {
                            ...values,
                            hinhAnhSanPham: url
                        }
                    })
                    .then((data) => {
                        return createProduct(data)
                    }).then((response) => {
                        if (response && response.data && response.status == 200) {
                            message.info(response.data)
                            handleCloseEditForm()
                            getAll()
                        }
                    })
            })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const handleChangeSelect = () => {

    }

    const handleConfirmDelete = (Id) => {
        setIdDelete(Id)
        setIsOpenDelete(true)
    }

    const handleDelete = async () => {
        const response = await deleteProduct(idDelete)
        if (response && response.data && response.status == 200) {
            message.info(response.data)
            setIdDelete(null)
            setIsOpenDelete(false)
            getAll()
        }
    }

    const handleCloseEditForm = () => {
        handleReset()
        setIsModalOpen(false)
        setDataUpdate(null)
        setLinkImage("")
    }

    const convertIdCategory = (text) => {
        switch (text) {
            case "Iphone":
                return 1
            case "Samsung":
                return 2
            case "Xiaomi":
                return 3
            case "OnePlus":
                return 4
            default:
                return text
        }
    }

    const handleOpenEditForm = async (data) => {
        // console.log("==> data: ", data.HinhAnhSanPham);
        await setDataUpdate(data)
        await setIsModalOpen(true)

        const category = data.IdLoaiSanPham
        const categoryText = () => category == 1 ? "Iphone" : category == 2 ? "Samsung" : category == 3 ? "Xiaomi" : "OnePlus"

        formRef.current.setFieldsValue({
            tenSanPham: data.TenSanPham,
            giaSanPham: data.GiaSanPham,
            // idLoaiSanPham: data.IdLoaiSanPham,
            idLoaiSanPham: categoryText(),
            rating: data.rating,
            moTaSanPham: data.MoTaSanPham
        })
        setLinkImage(data.HinhAnhSanPham)
    }

    const handleChoosePhoto = (e) => {
        if (!e.target.files) {
            return
        }
        setImageUpload(e.target.files[0])
        setLinkImage(URL.createObjectURL(e.target.files[0]))
    }

    return (
        <div className='account w-100'>
            {contextHolder}

            <Modal title="Delete Product" open={isOpenDelete} onOk={handleDelete} onCancel={handleCancel} maskClosable={false}>
                <p>Do you definitely want to delete products with ID {idDelete}</p>
            </Modal>

            <Modal title={`Product ${dataUpdate ? "Update" : "Create"}`} open={isModalOpen} onOk={handleOk} onCancel={handleCloseEditForm}
                maskClosable={false} footer={<></>} width={1000}
            >
                <Form
                    name="basic"
                    ref={formRef}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row>
                        <Col span={9}>
                            <Form.Item
                                label="Name"
                                name="tenSanPham"
                                labelCol={{
                                    span: 5,
                                }}
                                wrapperCol={{
                                    span: 19,
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input name!',
                                    },
                                ]}
                                style={{ paddingLeft: 4 }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Category"
                                name="idLoaiSanPham"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input category!',
                                    },
                                ]}
                            >
                                <Select
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={handleChangeSelect}
                                    options={[
                                        {
                                            value: 1,
                                            label: 'Iphone',
                                        },
                                        {
                                            value: 2,
                                            label: 'Samsung',
                                        },
                                        {
                                            value: 3,
                                            label: 'Xiaomi',
                                        },
                                        {
                                            value: 4,
                                            label: 'OnePlus',
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={5}>
                            <Form.Item
                                label="Price"
                                name="giaSanPham"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input price!',
                                    },
                                    {
                                        pattern: /^[1-9]\d*$/,
                                        message: 'Enter price > 0!'
                                    }
                                ]}
                            >
                                <Input type='Number' min={0} />
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item
                                label="Rating"
                                name="rating"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input confirm rating!',
                                    },
                                ]}
                            >
                                <Select
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={handleChangeSelect}
                                    options={[
                                        { value: 1, label: 1 },
                                        { value: 2, label: 2 },
                                        { value: 3, label: 3 },
                                        { value: 4, label: 4 },
                                        { value: 5, label: 5 },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={16}>
                            <Form.Item
                                label="Detail"
                                name="moTaSanPham"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input detail!',
                                    },
                                ]}
                                labelCol={{
                                    span: 3,
                                }}
                                wrapperCol={{
                                    span: 21,
                                }}

                            >
                                <Input.TextArea rows={11} placeholder="detail phone" className='rs-none' />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <div className='flex f-col a-center image_scope' >
                                <div className='picture_frame'>
                                    <Image width={200} src={linkImage} />
                                </div>
                                <div>
                                    <label htmlFor='image_file' className='label_image'>Choose File</label>
                                    <input id='image_file' type="file" onChange={(e) => handleChoosePhoto(e)} className='hidden' />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Form.Item
                                wrapperCol={{
                                    offset: 0,
                                    span: 24,
                                }}
                                style={{ marginTop: 24 }}
                            >
                                <div className='flex j-center btn_form_scope'>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Row className='w-100 a-stretch'>
                <Col span={12}>
                    <Button type="primary" className='btn_add' onClick={showModal}>Add</Button>
                </Col>
                <Col span={12} style={{ textAlign: "end" }}>
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                        style={{ minWidth: 300, width: 300, maxWidth: 500 }}
                    />
                </Col>
            </Row>

            <br />

            <Row className='w-100'>
                <Table
                    columns={Columns(expandedRowKeys, toggleDetail, handleConfirmDelete, handleOpenEditForm)}
                    dataSource={productSearch}
                    pagination={{ pageSize: 10 }}
                    className='w-100'
                    scroll={{ y: 500 }}
                />
            </Row>
        </div >
    )
}

export default Product