// File: src/components/AuthScreen.jsx
import React from 'react';

function AuthScreen({ onLogin }) { 
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Academi<span className="text-blue-500">Git</span></h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Your AI-powered project partner.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div><input id="email-address" name="email" type="email" required className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Email address" defaultValue="alex@university.edu" /></div>
                        <div><input id="password" name="password" type="password" required className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Password" defaultValue="password" /></div>
                    </div>
                    <div><button type="submit" className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700">Sign in</button></div>
                </form>
            </div>
        </div>
    ); 
}

export default AuthScreen;

