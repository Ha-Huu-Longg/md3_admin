import { useEffect, useRef, useState } from 'react'
import { Button, Col, Row, Space, Input, Table, Modal, Pagination, Form, message } from 'antd'
import { createAccount, getAllAccount } from '../axiosConfig/account'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const { Search } = Input

const columns = [
    {
        title: '#',
        dataIndex: "key",
        key: 'key',
    },
    {
        title: 'Uername',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'age',
    },
    {
        title: 'Phone Number',
        dataIndex: 'sodienthoai',
        key: 'phoneNumber',
    },
    // {
    //     title: 'Action',
    //     key: 'action',
    //     render: (_, record) => (
    //         <Space size="middle">
    //             <Button icon={<EditOutlined />}></Button>
    //             <Button icon={<DeleteOutlined />} danger ></Button>
    //         </Space>
    //     ),
    // },
]

const Account = () => {

    const [accounts, setAccounts] = useState([])
    const [accountSearch, setAccountSearch] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()
    const formRef = useRef()

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
        handleReset()
        setIsModalOpen(false)
    }

    const getAll = async () => {
        const response = await getAllAccount()
        if (response && response.data) {
            setAccounts(addKeyForData(response.data))
            setAccountSearch(addKeyForData(response.data))
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

    const onFinish = async (values) => {
        const { confirmpassword, ...data } = values
        if (confirmpassword != data.password) {
            messageApi.info('Confirm password !')
        } else {
            console.log(data);
            const response = await createAccount(data)
            if (response.data.success) {
                handleReset()
                handleCancel()
                getAll()
            } else {
                message.info("Account already exists!")
            }
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    useEffect(() => {
        (async () => {
            await getAll()
        })()
    }, [])

    const onSearch = (value) => {
        const textSearch = value.trim().toLowerCase()
        const newAccounts = accounts.filter((accoount) => accoount.username.toLowerCase().includes(textSearch) ||
            accoount.email.toLowerCase().includes(textSearch) || accoount.sodienthoai.toLowerCase().includes(textSearch))
        setAccountSearch(newAccounts)
    }

    return (
        <div className='account w-100'>
            {contextHolder}

            <Modal title="Add Account" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosable={false} footer={<></>}>
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
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                            {
                                pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Enter the correct email format!"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="sodienthoai"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone number!',
                            },
                            {
                                pattern: /^0\d{9}$/,
                                message: "Enter the correct phone number format!"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmpassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your confirm password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 0,
                            span: 24,
                        }}
                        style={{ marginTop: 48 }}
                    >
                        <div className='flex j-center btn_form_scope'>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </div>
                    </Form.Item>
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
                    columns={columns}
                    dataSource={accountSearch}
                    pagination={{ pageSize: 10 }}
                    className='w-100'
                    scroll={{ y: 500 }}
                />
            </Row>
        </div >
    )
}

export default Account