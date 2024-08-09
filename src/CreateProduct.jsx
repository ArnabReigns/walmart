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
} from "@mui/material";
import { saveAs } from "file-saver";
import nodesData from "./nodes.json";

const AdminPage = () => {
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
      [productName]: {
        node_id: selectedNodeId,
        node_name: nodes.find((node) => node.id === selectedNodeId)?.name,
        stock: parseInt(stockQuantity, 10),
      },
    };
    setProducts((prevProducts) => ({ ...prevProducts, ...newProduct }));
    setProductName("");
    setSelectedNodeId("");
    setStockQuantity("");
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "products.json");
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
      }}
      gap={4}
      height={"100vh"}
    >
      <Stack spacing={2} flex={1} maxHeight={"100%"}>
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        <FormControl fullWidth required>
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
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
        />

        {error && <Typography color="error">{error}</Typography>}

        <Button variant="contained" onClick={handleAddProduct}>
          Add Product
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadJSON}
        >
          Download JSON
        </Button>
      </Stack>

      <Stack flex={1} maxHeight={"100%"} sx={{ overflowY: "scroll" }}>
        <Box>
          <h3>Product List:</h3>
          <ul>
            {Object.keys(products).map((key) => (
              <li key={key}>
                Product name: {key} - Block: {products[key].node_name} - Stock:{" "}
                {products[key].stock}
              </li>
            ))}
          </ul>
        </Box>
      </Stack>
    </Box>
  );
};

export default AdminPage;
