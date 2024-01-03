import {
    AntDesignOutlined,
    ContainerOutlined,
    DatabaseOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { LOGO_LINK } from '../firebase/constance';

const AppSider = () => {

    return (
        <div className='c-white'>
            <div className="logo">
                {/* <img className='image_logo' src={LOGO_LINK} alt='item_images' /> */}
            </div>
            <div className="menu_scope">
                <ul className="menu flex fd-col">
                    {/* <Link className='link_sider' to={""}><UserOutlined /> &nbsp; Account Admin</Link> */}
                    <Link className='link_sider' to={"account-user"}><UserOutlined /> &nbsp; User</Link>
                    <Link className='link_sider' to={"category"}> <DatabaseOutlined /> &nbsp; Category</Link>
                    <Link className='link_sider' to={"product"}> <DatabaseOutlined /> &nbsp; Product</Link>
                    <Link className='link_sider' to={"bill"}> <ContainerOutlined /> &nbsp; Bill</Link>
                </ul>
            </div>
        </div>
    )
}

export default AppSider