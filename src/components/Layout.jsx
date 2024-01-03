import { useEffect, useState } from 'react';
import { Layout, Breadcrumb, Space } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import AppSider from './AppSider';

const { Header, Footer, Sider, Content } = Layout;

const LayoutApp = () => {

    const [toggle, setToggle] = useState(false)
    const location = useLocation()

    return (
        <Space direction="vertical" className='w-100' size={[0, 48]} >
            <Layout>
                <Sider className={`sider`} >
                    <AppSider toggle={toggle} />
                </Sider>
                <Layout>
                    <Header className='header'>
                        <AppHeader setToggle={setToggle} />
                    </Header>

                    <hr />

                    <Content className='content'>
                        {/* <Breadcrumb
                            items={[
                                { title: 'Admin' },
                                {
                                    title: `${location.pathname == `/admin` ? 'Account' : location.pathname == `/admin/product` ? 'Product' : 'Bill'}`,
                                },
                            ]}
                            className='breadcrumb'
                        /> */}
                        <br />

                        <Outlet />
                    </Content>
                    <Footer className='footer'>
                        <AppFooter />
                    </Footer>
                </Layout>
            </Layout>
        </Space >
    )
}

export default LayoutApp