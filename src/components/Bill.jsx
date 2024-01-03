import { Button, Col, Image, Modal, Row, Space, Table, message, Input } from 'antd'
import { useEffect, useState } from 'react'
import { getAllBill, getDetailBill, updateBill } from '../axiosConfig/bill'
import { EditOutlined } from '@ant-design/icons'

const { Search } = Input

const Columns = (showModal, handleUpdateBill) => [
    {
        title: '#',
        dataIndex: "key",
        key: 'key',
        width: 100
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        width: 100
    },
    {
        title: 'Uername',
        dataIndex: 'tenkhachhang',
        key: 'tenkhachhang',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Phone Number',
        dataIndex: 'sodienthoai',
        key: 'sodienthoai',
        width: 150
    },
    {
        title: 'Status',
        dataIndex: 'sold',
        key: 'sold',
        width: 150,
        align: "center",
        render: (sold) => (
            <>{sold == 0 ? "Pending" : sold == 1 ? <span style={{ color: "#008dff" }}>Accept</span> : <span style={{ color: "#ff4d4f" }}>Deny</span>}</>
        )
    },
    {
        title: 'Detail',
        key: 'detail',
        align: "center",
        width: 150,
        render: (_, record) => (
            <Space size="middle">
                <Button icon={<EditOutlined />} onClick={() => showModal(record.id)}></Button>
            </Space>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        align: "center",
        render: (_, record) => (
            <Space size="middle">
                {record.sold == 0 ?
                    <>
                        <Button onClick={() => handleUpdateBill(record.id, "1")}>Accept</Button>
                        <Button danger onClick={() => handleUpdateBill(record.id, "2")}>Deny</Button>
                    </> : <></>}
            </Space>
        ),
    },
]

const Bill = () => {

    const [bills, setBills] = useState([])
    const [billSearch, setBillSearch] = useState([])
    const [messageApi, contextHolder] = message.useMessage()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [idBill, setIdBill] = useState(-1)
    const [detailBill, setDetailBill] = useState([])

    const getAll = async () => {
        const response = await getAllBill()
        if (response && response.data) {

            const data = [...response.data]
            data.sort((a, b) => {
                if (a.sold == 0 && b.sold != 0) {
                    return -1; // Đưa object có sold là 0 lên đầu
                } else if (a.sold != 0 && b.sold == 0) {
                    return 1; // Đưa object có sold khác 0 xuống sau
                } else {
                    return 0; // Giữ nguyên vị trí của các object có sold là 1 hoặc 2
                }
            });

            setBills(addKeyForData(data))
            setBillSearch(addKeyForData(data))
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

    const showModal = (id) => {
        setIdBill(id)
        setIsModalOpen(true);
    }

    const handleOk = () => {
        setIdBill(-1)
        setDetailBill([])
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        setIdBill(-1)
        setDetailBill([])
        setIsModalOpen(false)
    }

    const handleUpdateBill = async (id, sold) => {
        const response = await updateBill({ id, sold })
        if (response.data.includes("Cập nhật đơn hàng thành công.")) {
            message.info(response.data)
            getAll()
        }
    }

    useEffect(() => {
        (async () => {
            await getAll()
        })()
    }, [])

    useEffect(() => {
        if (idBill == -1) {
            return
        } else {
            (async () => {
                const response = await getDetailBill(idBill)
                if (response && response.data) {
                    setDetailBill(addKeyForData(response.data))
                }
            })()
        }
    }, [idBill])

    const onSearch = (value) => {
        const textSearch = value.trim().toLowerCase()
        const newBills = bills.filter((accoount) => accoount.tenkhachhang.toLowerCase().includes(textSearch) ||
            accoount.email.toLowerCase().includes(textSearch) || accoount.sodienthoai.toLowerCase().includes(textSearch))
        setBillSearch(newBills)
    }

    return (
        <div className='account w-100'>
            {contextHolder}

            <Modal title={`Bill Detail ${idBill}`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosable={false} idBill={idBill}
                width={1000}
            >
                <Table
                    dataSource={detailBill}
                    scroll={{ y: 500 }}
                    columns={[
                        {
                            title: '#',
                            dataIndex: "key",
                            key: 'key',
                            width: 50,
                            align: "center"
                        },
                        {
                            title: 'Photo',
                            dataIndex: 'hinhanhsanpham',
                            key: 'hinhanhsanpham',
                            align: "center",
                            render: (src) => (
                                <Image
                                    width={100}
                                    src={src}
                                />
                            )
                        },
                        {
                            title: 'Name',
                            dataIndex: 'tensanpham',
                            key: 'tensanpham',
                            align: "center"
                        },
                        {
                            title: 'Quantity',
                            dataIndex: 'soluongsanpham',
                            key: 'soluongsanpham',
                            align: "center"
                        },
                        {
                            title: 'Price',
                            dataIndex: 'giasanpham',
                            key: 'giasanpham',
                            align: "center",
                            render: (price) => (
                                <span>{Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            )
                        },
                    ]}
                />

                <Row>
                    <div>
                        <span>Total price: </span>
                        <strong>
                            {Number(detailBill.reduce((total, product) => {
                                return total + product.giasanpham
                            }, 0)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </strong>
                    </div>
                </Row>
            </Modal>

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
                    columns={Columns(showModal, handleUpdateBill)}
                    dataSource={billSearch}
                    pagination={{ pageSize: 10 }}
                    className='w-100'
                    scroll={{ y: 500 }}
                />
            </Row>

        </div >
    )
}

export default Bill