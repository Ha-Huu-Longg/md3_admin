import { Button, Form, Input, message } from 'antd'
import aixiosInstance from '../axiosConfig/axiosInstance'
import { useNavigate } from "react-router-dom"

const Login = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await aixiosInstance.post("/auth/login", values)

            if (response.status == 200 && response.data.user.role == 1) {
                messageApi.info('Login Oke !');
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("admin_login", JSON.stringify(response.data.user))
                navigate("/admin");
            } else {
                message.info("Login failure !!")
            }
            // const stringResponse = response.data
            // const trimmedResponse = stringResponse.slice(0, -2)
            // const responseObject = JSON.parse(trimmedResponse)

            // if (responseObject.success) {
            //     messageApi.info('Success !');
            //     localStorage.setItem("admin", JSON.stringify(responseObject))
            //     navigate("/admin");
            // } else {
            //     messageApi.info('Failure !');
            // }
        } catch (error) {
            messageApi.info('The server does not respond !')
        }
    };

    const onFinishFailed = (errorInfo) => {
        messageApi.info('Enter enough information !')
    };

    return (
        <div className='container_page_form'>
            {contextHolder}
            <div className='form'>
                <h1>Login</h1>
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className='form_content'
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input className='input_login' type='email' />
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
                        <Input.Password className='input_login' />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 0,
                            span: 24,
                        }}
                        style={{ textAlign: "center" }}
                    >
                        <Button type="primary" htmlType="submit" className='btn_submit_login'>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login