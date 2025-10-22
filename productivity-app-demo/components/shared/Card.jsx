// File: src/components/shared/Card.jsx
import React from 'react';

const Card = ({ children, className, ...props }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`} {...props}>
        {children}
    </div>
);

export default Card;
