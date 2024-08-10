import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { saveAs } from "file-saver";
import nodesData from "./nodes.json";

const CreateProduct = () => {
  const [products, setProducts] = useState({});
  const [productName, setProductName] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const nodesArray = Object.values(nodesData).map((node) => ({
      id: node.id,
      name: node.name,
    }));
    setNodes(nodesArray);
  }, []);

  const handleAddProduct = () => {
    if (!productName || !selectedNodeId || !stockQuantity) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(stockQuantity) || stockQuantity <= 0) {
      setError("Stock quantity must be a positive number.");
      return;
    }
    setError("");

    const newProduct = {
      id: selectedNodeId, // Use node_id as the product ID
      name: productName,
      node_name: nodes.find((node) => node.id === selectedNodeId)?.name,
      stock: parseInt(stockQuantity, 10),
    };

    setProducts((prevProducts) => ({
      ...prevProducts,
      [newProduct.id]: newProduct,
    }));

    setProductName("");
    setSelectedNodeId("");
    setStockQuantity("");
  };

  const handleDeleteProduct = (id) => {
    setProducts((prevProducts) => {
      const updatedProducts = { ...prevProducts };
      delete updatedProducts[id];
      return updatedProducts;
    });
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "products.json");
  };

  const handleProcessRowUpdate = (newRow) => {
    const updatedProduct = { ...newRow };
    setProducts((prevProducts) => ({
      ...prevProducts,
      [newRow.id]: updatedProduct,
    }));
    return updatedProduct;
  };

  const columns = [
    { field: "name", headerName: "Product Name", flex: 1, editable: true },
    { field: "node_name", headerName: "Block", flex: 1, editable: true },
    {
      field: "stock",
      headerName: "Stock Quantity",
      type: "number",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteProduct(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
      flex: 0.5,
      sortable: false,
      filterable: false,
    },
  ];

  const rows = Object.values(products);

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          gap: 3,
          height: "95vh",
          width: "98vw",
          bgcolor: "#F4F5F5",
          borderRadius: "10px",
        }}
      >
        <Stack
          spacing={2}
          flex={1}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <h1>Add Products</h1>
          <TextField
            label="Product Name"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            sx={{
              bgcolor: "white",
            }}
          />

          <FormControl fullWidth required sx={{ bgcolor: "white" }}>
            <InputLabel>Block</InputLabel>
            <Select
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              displayEmpty
            >
              {nodes.map((node) => (
                <MenuItem key={node.id} value={node.id}>
                  {node.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Stock Quantity"
            type="number"
            fullWidth
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            sx={{ bgcolor: "white", borderRadius: "10px" }}
          />

          {error && <Typography color="error">{error}</Typography>}

          <Button
            variant="contained"
            sx={{ bgcolor: "#576cca" }}
            onClick={handleAddProduct}
            fullWidth
          >
            Add Product
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "#EE6363" }}
            fullWidth
            onClick={handleDownloadJSON}
          >
            Download Product File (.json)
          </Button>
        </Stack>

        <Box flex={2}>
          <DataGrid
            rows={rows}
            columns={columns}
            height={"100%"}
            processRowUpdate={handleProcessRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            localeText={{ noRowsLabel: "No product" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateProduct;
