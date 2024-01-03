import React, { useEffect, useMemo, useState } from 'react'
import { Col, Row, Avatar, Tooltip } from 'antd'
import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";

const AppHeader = ({ setToggle }) => {
    const [admin, setAdmin] = useState()
    const [arrow, setArrow] = useState('Show');

    const navigate = useNavigate();

    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    const handleLogout = () => {
        // localStorage.setItem("admin_login", JSON.stringify(""))
        localStorage.removeItem("admin_login")
        localStorage.removeItem("token")
        navigate("/")
    }

    useEffect(() => {
        const dataAdmin = JSON.parse(localStorage.getItem("admin_login"))
        if (!dataAdmin) {
            navigate("/")
        } else {
            setAdmin(dataAdmin)
        }
    }, [])

    return (
        <Row className='height_100'>
            <Col span={8} className='flex j-start a-center col-toggle' >
                <MenuOutlined className='menu_toggle' onClick={() => setToggle(prev => !prev)} />
            </Col>

            <Col span={16} className='flex j-end a-center col-avatar col-avatar' >
                <span style={{ fontSize: 18 }}>{(admin && admin.email) ? admin.email : ""}</span>
                <Avatar
                    size={38}
                    icon={<UserOutlined style={{ fontSize: 32 }} />}
                    className='bg-avatar'
                />
                <Tooltip placement="bottom" title={"Logout"} arrow={mergedArrow}>
                    <LogoutOutlined style={{ fontSize: 24 }} onClick={() => handleLogout()} />
                </Tooltip>
            </Col>
        </Row>
    )
}

export default AppHeader