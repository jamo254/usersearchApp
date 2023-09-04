import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import InputMask from 'react-input-mask';

const API_URL = 'http://localhost:8000/search';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    number: Yup.string().matches(/^\d{2}-\d{2}-\d{2}$/, 'Invalid number format'),
});

const Forms = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            number: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(API_URL, values);
                console.log(response.data); // Log the response
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error while sending request to the server:', error);
            }
            setLoading(false);
        },
    });

    useEffect(() => {
        // Cancel the previous request when form values change
        const source = axios.CancelToken.source();
        return () => {
            source.cancel('Request canceled');
        };
    }, [formik.values]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 py-8 max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6">Search User Data</h1>
                <form onSubmit={ formik.handleSubmit }>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email:
                        </label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            value={ formik.values.email }
                            className={ `${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                                } appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline` }
                        />
                        { formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-xs italic">{ formik.errors.email }</p>
                        ) }
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number">
                            Number:
                        </label>
                        <InputMask
                            mask="99-99-99"
                            name="number"
                            id="number"
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            value={ formik.values.number }
                            className={ `${formik.touched.number && formik.errors.number ? 'border-red-500' : 'border-gray-300'
                                } appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline` }
                        />
                        { formik.touched.number && formik.errors.number && (
                            <p className="text-red-500 text-xs italic">{ formik.errors.number }</p>
                        ) }
                    </div>
                    <button
                        type="submit"
                        disabled={ loading }
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Search
                    </button>
                </form>
                <div className="mt-6">
                    { loading ? (
                        <p className="text-gray-600">Searching...</p>
                    ) : (
                        <ul>
                            { searchResults.map((user, index) => (
                                <li
                                    key={ index }
                                    className="border-t border-gray-300 py-2 flex justify-between items-center"
                                >
                                    <span>
                                        Email: { user.email }, Number: { user.number }
                                    </span>
                                </li>
                            )) }
                        </ul>
                    ) }
                </div>
            </div>
        </div>
    );
};

export default Forms;
