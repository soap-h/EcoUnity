import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

function AdminPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // State to store products
    const [imageFile, setImageFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    const formik = useFormik({
        initialValues: {
            prod_name: "",
            prod_desc: "",
            prod_img: "",
            prod_price: "",
            prod_stock: ""
        },
        validationSchema: yup.object({
            prod_name: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            prod_desc: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            prod_price: yup.number().integer().positive()
                .min(1)
                .required('Price is required'),
            prod_stock: yup.number().integer().positive()
                .required()
        }),
        onSubmit: async (data) => {
            if (imageFile) {
                try {
                    let formData = new FormData();
                    formData.append('file', imageFile);
                    
                    const res = await http.post('/file/upload/productPictures', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    
                    data.prod_img = res.data.filename;
                } catch (error) {
                    console.error('Error uploading image:', error.response);
                    toast.error('Error uploading image.');
                    return;
                }
            }

            data.prod_name = data.prod_name.trim();
            data.prod_desc = data.prod_desc.trim();

            if (isEditing) {
                try {
                    const res = await http.put(`/products/${editingProductId}`, data);
                    console.log(`Editing ${editingProductId}` );
                    console.log(res.data);
                    toast.success('Product edited successfully!');
                    getProducts();
                } catch (error) {
                    console.error('Error putting data:', error);
                    toast.error('Error editing product.');
                } finally {
                    setIsEditing(false);
                    setEditingProductId(null);
                    setImageFile(null);
                    setPreviewURL(null);
                    formik.resetForm();
                }
            } else {
                try {
                    const res = await http.post("/products", data);
                    console.log(res.data);
                    toast.success('Product added successfully!');
                    getProducts();
                    setImageFile(null);
                    setPreviewURL(null);
                    formik.resetForm();
                } catch (error) {
                    console.error('Error posting data:', error);
                    toast.error('Error adding product.');
                }
            }

            
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            setImageFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const getProducts = () => {
        http.get("/products")
            .then(response => {
                setProducts(response.data); // Set fetched products to state
            })
            .catch(error => {
                console.error('Failed to fetch products:', error);
                toast.error('Failed to fetch products');
            });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleEdit = (product) => {
        setIsEditing(true);
        setEditingProductId(product.id);
        formik.setValues({
            prod_name: product.prod_name,
            prod_desc: product.prod_desc,
            prod_img: product.prod_img,
            prod_price: product.prod_price,
            prod_stock: product.prod_stock,
        });
        setPreviewURL(`${import.meta.env.VITE_FILE_PRODUCTS_URL}/${product.prod_img}`);
    };

    const handleDelete = (productId) => {

        http.delete(`/products/${productId}`)
            .then((res) => {
                console.log(res.data);
                getProducts();
            }).catch((error) => {
                console.error('Error deleting product:', error);
                toast.error('Error deleting product.');
            });
        console.log('Delete product with ID:', productId);
    };

    return (
        <Box sx={{ width: '80%', margin: 'auto' }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                {isEditing ? 'Edit Product' : 'Add Product'}
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Product Name"
                            name="prod_name"
                            value={formik.values.prod_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.prod_name && Boolean(formik.errors.prod_name)}
                            helperText={formik.touched.prod_name && formik.errors.prod_name}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Description"
                            name="prod_desc"
                            value={formik.values.prod_desc}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.prod_desc && Boolean(formik.errors.prod_desc)}
                            helperText={formik.touched.prod_desc && formik.errors.prod_desc}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Price"
                            name="prod_price"
                            type="number"
                            step="0.01"
                            value={formik.values.prod_price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.prod_price && Boolean(formik.errors.prod_price)}
                            helperText={formik.touched.prod_price && formik.errors.prod_price}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Stock"
                            name="prod_stock"
                            type="number"
                            value={formik.values.prod_stock}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.prod_stock && Boolean(formik.errors.prod_stock)}
                            helperText={formik.touched.prod_stock && formik.errors.prod_stock}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }} >
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file"
                                    onChange={onFileChange} />
                            </Button>
                            {
                                previewURL && (
                                    <Box sx={{ mt: 2, width: '200px', height: '200px', position: 'relative', margin: 'auto', pt: 5 }}>
                                        <img alt="product image"
                                            src={previewURL}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </Box>
            </Box>
            
            <Box>
                <Typography variant="h5" sx={{ my: 4 }}>
                    Product List
                </Typography>
                <List sx={{ mt: 4 }}>
                    {products.map((product, index) => (
                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemAvatar>
                                <Avatar
                                    variant="square"
                                    src={`${import.meta.env.VITE_FILE_PRODUCTS_URL}/${product.prod_img}`}
                                    alt={product.prod_name}
                                    sx={{ width: '100px', height: '100px', aspectRatio: '1/1', objectFit: 'cover' }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={product.prod_name}
                                secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        {product.prod_desc}
                                    </Typography>
                                    <br />
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        Price: {product.prod_price} Points
                                    </Typography>
                                    <br />
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        Created At: {new Date(product.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <br />
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        Stock: {product.prod_stock}
                                    </Typography>
                                </>
                                }
                                sx={{ ml: 2 }}
                            />
                            <IconButton onClick={() => navigate("/reviews")}>
                                <StarIcon/>
                            </IconButton>
                            <IconButton onClick={() => handleEdit(product)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(product.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

                <ToastContainer />
        </Box>
    );
}

export default AdminPage;
