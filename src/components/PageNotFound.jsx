import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


const PageNotFound = () => {

    const navigate = useNavigate()

    return (
        <div className='container_404'>
            <div class="error-message">
                <h1 className='t-404'>404</h1>
                <p className='t-pnf'>Page Not Found</p>
                <Link onClick={() => navigate(-1)} className='link_error'>Back to Home</Link>
            </div>
        </div>
    )
}

export default PageNotFound