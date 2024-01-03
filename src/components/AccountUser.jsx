import { Col, Row, Table, Input, message, Button } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'

const { Search } = Input

const columns = (handleChangeStatus) => [
    {
        title: '#',
        render: (_, user, i) => <span>{i + 1}</span>
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (status == 1 ? <span>Active</span> : <span>Block</span>)
    },
    {
        title: 'Action',
        dataIndex: 'status',
        key: 'action',
        render: (status, user) => <Button onClick={() => handleChangeStatus(user.id)}>{status == 1 ? "Block" : "Active"}</Button>
    },
]

const AccountUser = () => {

    const [accounts, setAccounts] = useState([])
    const [messageApi, contextHolder] = message.useMessage()

    const getAll = async () => {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.get("http://localhost:3000/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAccounts(response.data.users)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async () => {
            await getAll()
        })()
    }, [])

    const onSearch = async (value) => {
        const textSearch = value.trim().toLowerCase()
        const token = localStorage.getItem("token")
        try {
            const response = await axios.get(`http://localhost:3000/api/users/search?textSearch=${textSearch}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response);
            setAccounts(response.data.users)
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeStatus = async (id) => {

        const token = localStorage.getItem("token")
        try {
            const response = await axios.patch(`http://localhost:3000/api/users/status`, {
                userId: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.result[0] == "oke") {
                getAll()
            } else {
                messageApi.error("Failure!!")
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='account w-100'>
            {contextHolder}

            <Row className='w-100 a-stretch'>
                <Col span={12}></Col>
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
                    columns={columns(handleChangeStatus)}
                    dataSource={accounts}
                    pagination={{ pageSize: 10 }}
                    className='w-100'
                    scroll={{ y: 500 }}
                />
            </Row>
        </div >
    )
}

export default AccountUser