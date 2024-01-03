import { Button, Col, Row, Table, message, Input, Modal, Form, Space, Popconfirm } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const { Search } = Input

const Columns = (handleClick, confirm) => [
    {
        title: '#',
        dataIndex: "key",
        key: 'key',
        render: (_, __, i) => <>{i + 1}</>
    },
    {
        title: 'name',
        dataIndex: "name",
        key: 'name',
    },
    {
        title: 'action',
        render: (_, category) =>
            <Space size="middle">
                <Button icon={<EditOutlined />} onClick={() => { handleClick(category) }}></Button>
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => confirm(category.id)}
                    onCancel={() => { }}
                >
                    <Button icon={<DeleteOutlined />} danger ></Button>
                </Popconfirm>

            </Space>
    },
]

const Categories = () => {

    const [categories, setCategories] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [categoryUpdate, setCategoryUpdate] = useState(null)

    const [form] = Form.useForm()

    const getAllCategory = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/categories")
            setCategories(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const onFinish = async (values) => {
        if (categoryUpdate) {
            const newInfo = {
                ...categoryUpdate,
                ...values
            }
            const token = localStorage.getItem("token")
            const response = await axios.patch("http://localhost:3000/api/categories", newInfo, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.data) {
                handleCancel()
                getAllCategory()
            } else {
                message.error("Error")
            }
        } else {
            const token = localStorage.getItem("token")
            const response = await axios.post("http://localhost:3000/api/categories", { name: values.name }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status == 201) {
                message.info("Them thanh cong")
                handleCancel()
                getAllCategory()
            } else {
                message.info(response.data.message)
                handleCancel()
            }
        }
    }

    const handleCancel = () => {
        form.resetFields()
        setCategoryUpdate(null)
        setIsOpenModal(false)
    }
    const handleClick = (category) => {
        form.setFieldsValue(category)
        setCategoryUpdate(category)
        setIsOpenModal(true)
    }

    const onSearch = async (value) => {
        const textSearch = value.trim().toLowerCase()
        const result = await axios.get(`http://localhost:3000/api/categories/search?textSearch=${textSearch}`)
        setCategories(result.data.data)
    }

    const confirm = async (id) => {
        const token = localStorage.getItem("token")
        const result = await axios.delete(`http://localhost:3000/api/categories/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (result.data.data) {
            getAllCategory()
        } else {
            message.error("failue!!")
        }
    }

    useEffect(() => {
        getAllCategory()
    }, [])

    return (
        <div className='account w-100'>

            {
                isOpenModal &&
                <Modal
                    title={`Category ${categoryUpdate ? "Update" : "Create"}`}
                    open={isOpenModal}
                    onOk={() => { }}
                    onCancel={handleCancel}
                    maskClosable={false} footer={<></>}
                >
                    <Form
                        name="basic"
                        form={form}
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={() => { }}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 0,
                                        span: 24,
                                    }}
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
            }

            <Row className='w-100 a-stretch'>
                <Col span={12}>
                    <Button type="primary" onClick={() => { setIsOpenModal(true) }}>Add</Button>
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
                    columns={Columns(handleClick, confirm)}
                    dataSource={categories}
                    pagination={{ pageSize: 10 }}
                    className='w-100'
                    scroll={{ y: 500 }}
                />
            </Row>

        </div >
    )
}

export default Categories