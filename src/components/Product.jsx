import { Button, Col, Image, Row, Space, Table, message, Input, Modal, Form, Select, Popconfirm } from 'antd'
import { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { storage } from '../firebase/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from "uuid"
import axios from 'axios'

const { Search } = Input

const Columns = (confirm, handleClickEdit, categories) => [
    {
        title: '#',
        width: 50,
        render: (_, __, i) => <>{i + 1}</>
    },
    {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        width: 150,
        align: "center",
        render: (src) => (<Image width={100} src={src} />)
    },
    {
        title: 'Category',
        dataIndex: 'category_id',
        key: 'category_id',
        align: "center",
        width: 100,
        render: (category_id) => (<span>{categories.find(item => item.id == category_id).name}</span>)
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: "center",
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        align: "center",
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        align: "center",
        width: 120,
        render: (price) => (<span>{Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>)
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        width: 80,
        align: "center",
    },
    {
        title: 'Action',
        key: 'action',
        align: "center",
        width: 200,
        render: (_, product) => (
            <Space size="middle">
                <Button icon={<EditOutlined />} onClick={() => handleClickEdit(product)}></Button>
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => confirm(record.id)}
                    onCancel={() => { }}
                >
                    <Button icon={<DeleteOutlined />} danger></Button>
                </Popconfirm>
            </Space>
        ),
    },
]

const Product = () => {

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [productUpdate, setProductUpdate] = useState(null)

    const [form] = Form.useForm()

    const [imageUpload, setImageUpload] = useState(null)
    const [linkImage, setLinkImage] = useState("")

    const getCategories = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/categories")
            setCategories(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const getProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/products")
            setProducts(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const onSearch = async (value) => {
        const textSearch = value.trim().toLowerCase()
        const response = await axios.get(`http://localhost:3000/api/products/search?textSearch=${textSearch}`)
        setProducts(response.data.data)
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

        if (productUpdate != null) {
            const rawData = {
                id: productUpdate.id,
                ...values,
                image: linkImage
            }
            if (rawData.image.includes("https")) {
                const token = localStorage.getItem("token")
                const response = await axios.put(`http://localhost:3000/api/products`, rawData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.data.affectedRows == 1) {
                    message.info("success")
                    handleCloseEditForm()
                    getProducts()
                } else {
                    message.error("faile")
                }
            }
            else {
                const imageRef = ref(storage, `image/${imageUpload.name + v4()}`)
                uploadBytes(imageRef, imageUpload)
                    .then((snapshot) => {
                        getDownloadURL(snapshot.ref)
                            .then(async (url) => {
                                const newProduct = {
                                    id: productUpdate.id,
                                    ...values,
                                    image: url
                                }

                                const token = localStorage.getItem("token")
                                const response = await axios.put(`http://localhost:3000/api/products`, newProduct, {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                })
                                if (response.data.data.affectedRows == 1) {
                                    message.info("success")
                                    handleCloseEditForm()
                                    getProducts()
                                } else {
                                    message.error("faile")
                                }
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
                    .then(async (url) => {
                        const newProduct = {
                            ...values,
                            image: url
                        }
                        const token = localStorage.getItem("token")
                        const response = await axios.post("http://localhost:3000/api/products", newProduct, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        if (response.data.data.insertId) {
                            message.info("success")
                            handleCloseEditForm()
                            getProducts()
                        } else {
                            message.error("faile!!")
                        }
                    })
            })
    }


    const handleCloseEditForm = () => {
        form.resetFields()
        setIsModalOpen(false)
        setProductUpdate(null)
        setLinkImage("")
    }


    const handleChoosePhoto = (e) => {
        if (!e.target.files) {
            return
        }
        setImageUpload(e.target.files[0])
        setLinkImage(URL.createObjectURL(e.target.files[0]))
    }

    const confirm = async (id) => {
        const token = localStorage.getItem("token")
        const response = await axios.delete(`http://localhost:3000/api/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.data.affectedRows) {
            message.info("oke")
            getProducts()
        } else {
            message.error("faile!!!")
        }
    }

    const handleClickEdit = (product) => {
        form.setFieldsValue(product)
        setLinkImage(product.image)
        setProductUpdate(product)
        setIsModalOpen(true)
    }

    useEffect(() => {
        getCategories()
        getProducts()
    }, [])

    return (
        <div className='account w-100'>


            <Modal title={`Product ${productUpdate ? "Update" : "Create"}`} open={isModalOpen} onOk={handleOk} onCancel={handleCloseEditForm}
                maskClosable={false} footer={<></>} width={1000}
            >
                <Form
                    name="basic"
                    form={form}
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
                    onFinishFailed={() => { }}
                    autoComplete="off"
                >
                    <Row>

                        <Col span={6}>
                            <Form.Item
                                label="Category"
                                name="category_id"
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
                                    options={categories.map((item) => ({
                                        value: item.id,
                                        label: item.name
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={9}>
                            <Form.Item
                                label="Name"
                                name="name"
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



                        <Col span={5}>
                            <Form.Item
                                label="Price"
                                name="price"
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
                                label="Stock"
                                name="stock"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input stock!',
                                    },
                                ]}
                            >
                                <Input type='number' min={1} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={16}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input description!',
                                    },
                                ]}
                                labelCol={{
                                    span: 3,
                                }}
                                wrapperCol={{
                                    span: 21,
                                }}

                            >
                                <Input.TextArea rows={11} placeholder="description" className='rs-none' />
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
                    columns={Columns(confirm, handleClickEdit, categories)}
                    dataSource={products}
                    pagination={{ pageSize: 10 }}
                    className='w-100'
                    scroll={{ y: 500 }}
                />
            </Row>
        </div >
    )
}

export default Product