import React, { useState, useEffect } from "react";
import edgesData from "./edges.json";
import nodesData from "./nodes.json";
import productsData from "./products.json";
import { dijkstra } from "./Graph";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Autocomplete,
} from "@mui/material";
import img from "@/assets/img.png";

const DijkstraVisualization = () => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [startProduct, setStartProduct] = useState(null);
  const [endProduct, setEndProduct] = useState(null);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [animationFrameId, setAnimationFrameId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsArray = Object.keys(productsData).map((key) => ({
      name: key,
      ...productsData[key],
    }));
    setProducts(productsArray);
  }, []);

  const graph = {};
  for (const node in edgesData) {
    graph[node] = edgesData[node].map((edge) => ({
      node: edge.name,
      distance: Number(edge.distance),
    }));
  }

  const nodes = {};
  for (const nodeId in nodesData) {
    const node = nodesData[nodeId];
    nodes[nodeId] = {
      x: node.x,
      y: node.y,
      name: node.name,
    };
  }

  const findPath = () => {
    if (startNode && endNode) {
      const result = dijkstra(graph, startNode, endNode);
      setSteps(result.steps);
      setCurrentStep(0);

      let stepIndex = 0;

      const animate = () => {
        stepIndex++;
        if (stepIndex < result.steps.length) {
          setCurrentStep(stepIndex);
          setAnimationFrameId(requestAnimationFrame(animate));
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      };

      setAnimationFrameId(requestAnimationFrame(animate));
    }
  };

  useEffect(() => {
    if (steps.length) {
      let stepIndex = 0;

      const animate = () => {
        stepIndex++;
        if (stepIndex < steps.length) {
          setCurrentStep(stepIndex);
          setAnimationFrameId(requestAnimationFrame(animate));
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      };

      setAnimationFrameId(requestAnimationFrame(animate));

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [steps]);

  const renderEdges = () => {
    const edges = [];
    for (const node in graph) {
      graph[node].forEach((neighbor) => {
        edges.push(
          <g key={`${node}-${neighbor.node}`}>
            <line
              x1={nodes[node]?.x || 0}
              y1={nodes[node]?.y || 0}
              x2={nodes[neighbor.node]?.x || 0}
              y2={nodes[neighbor.node]?.y || 0}
              stroke="gray"
              strokeWidth="2"
            />
          </g>
        );
      });
    }
    return edges;
  };

  const renderNodes = () => {
    return Object.keys(nodes).map((nodeId) => (
      <g key={nodeId}>
        <circle
          cx={nodes[nodeId]?.x || 0}
          cy={nodes[nodeId]?.y || 0}
          r="15"
          fill={
            steps[currentStep] && steps[currentStep].includes(nodeId)
              ? "green"
              : "blue"
          }
        />
        <text
          x={nodes[nodeId]?.x || 0}
          y={nodes[nodeId]?.y || 0}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          fontSize="12"
        >
          {nodes[nodeId]?.name || ""}
        </text>
      </g>
    ));
  };

  const renderPath = () => {
    if (!steps[currentStep]) return null;
    const pathEdges = [];
    const stepNodes = steps[currentStep];

    for (let i = 0; i < stepNodes.length - 1; i++) {
      const fromNode = stepNodes[i];
      const toNode = stepNodes[i + 1];

      if (nodes[fromNode] && nodes[toNode]) {
        pathEdges.push(
          <line
            key={`path-${fromNode}-${toNode}`}
            x1={nodes[fromNode].x}
            y1={nodes[fromNode].y}
            x2={nodes[toNode].x}
            y2={nodes[toNode].y}
            stroke="red"
            strokeWidth="4"
          />
        );
      }
    }
    return pathEdges;
  };

  const handleProductChange = (event, newValue, field) => {
    if (field === "start") {
      setStartProduct(newValue);
      setStartNode(newValue ? newValue.node_id : null);
    } else {
      setEndProduct(newValue);
      setEndNode(newValue ? newValue.node_id : null);
    }
  };

  return (
    <Box>
      <Box flex={1} position={"relative"} height={"50vh"} width={"50vw"}>
        <img
          src={img}
          height={"100%"}
          width={"100%"}
          style={{
            zIndex: -1,
            position: "absolute",
            objectFit: "contain",
          }}
        />
        <svg height={"100%"} width={"100%"}>
          {renderEdges()}
          {renderPath()}
          {renderNodes()}
        </svg>
      </Box>

      <Box>
        <FormControl sx={{ m: 1, minWidth: 300 }}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) =>
              handleProductChange(event, newValue, "start")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Current Product"
                variant="outlined"
              />
            )}
          />
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 300 }}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) =>
              handleProductChange(event, newValue, "end")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Desired Product"
                variant="outlined"
              />
            )}
          />
        </FormControl>
      </Box>

      <Stack gap={2} width={"10%"} p={1}>
        <Button variant="contained" onClick={findPath}>
          Show Path
        </Button>
      </Stack>
    </Box>
  );
};

export default DijkstraVisualization;
