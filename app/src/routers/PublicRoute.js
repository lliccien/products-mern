import React from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types';
 
export const PublicRoute = ({
    isAuthenticated,
    children,
}) => {
 
    return (
            (isAuthenticated)
            ? (<Navigate to="/*" />)
            : (children)
    )
}
 
PublicRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    children: PropTypes.object.isRequired
}