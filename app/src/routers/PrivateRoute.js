import React from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types';
 
export const PrivateRoute = ({
    isAuthenticated,
    children,
}) => {

    return (
            (isAuthenticated)
            ? (children)
            : (<Navigate to="/login" />)
    )
}
 
PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    children: PropTypes.object.isRequired
}