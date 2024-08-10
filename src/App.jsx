import { Box } from "@mui/material";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./Admin";
import Home from "./Home";
import CreateProduct from "./CreateProduct";

const App = () => {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/create-product" element={<CreateProduct />} />
        </Routes>
      </BrowserRouter>
s    </Box>
  );
};

export default App;
