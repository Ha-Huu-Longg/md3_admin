import { Link, useNavigate } from 'react-router-dom'

const PageNotFoundChild = () => {

    const navigate = useNavigate()

    return (
        <div className='container_404 height_100' >
            <div className="error-message">
                <h1 className='t-404'>404</h1>
                <p className='t-pnf'>Page Not Found</p>
                <Link to={"/admin"} className='link_error'>Back to Home</Link>
            </div>
        </div>
    )
}

export default PageNotFoundChild