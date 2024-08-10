import React, { useState, useEffect } from "react";
import edgesData from "./edges.json";
import nodesData from "./nodes.json";
import productsData from "./products.json";
import { dijkstra } from "./Graph";
import {
  Box,
  Button,
  FormControl,
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

  const renderNodes = () => {
    if (!startNode && !endNode) {
      return null;
    }

    return (
      <>
        {startNode && (
          <g key={startNode}>
            <circle
              cx={nodes[startNode]?.x || 0}
              cy={nodes[startNode]?.y || 0}
              r="15"
              fill="blue"
            />
            <text
              x={nodes[startNode]?.x || 0}
              y={nodes[startNode]?.y || 0}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="white"
              fontSize="12"
            >
              {nodes[startNode]?.name || ""}
            </text>
          </g>
        )}
        {endNode && (
          <g key={endNode}>
            <circle
              cx={nodes[endNode]?.x || 0}
              cy={nodes[endNode]?.y || 0}
              r="15"
              fill="red"
            />
            <text
              x={nodes[endNode]?.x || 0}
              y={nodes[endNode]?.y || 0}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="white"
              fontSize="12"
            >
              {nodes[endNode]?.name || ""}
            </text>
          </g>
        )}
      </>
    );
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
            stroke="green"
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
      setEndProduct(null);
      setEndNode(null);
    } else {
      setEndProduct(newValue);
      setEndNode(newValue ? newValue.node_id : null);
    }

    setSteps([]);
    setCurrentStep(0);
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
          {renderPath()}
          {renderNodes()}
        </svg>
      </Box>

      <Box>
        <FormControl sx={{ m: 1, minWidth: 300 }}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) =>
              `${option.name} (Block ${
                nodes[option.node_id]?.name || "Unknown"
              })`
            }
            onChange={(event, newValue) =>
              handleProductChange(event, newValue, "start")
            }
            value={startProduct}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Current Product"
                variant="outlined"
              />
            )}
          />
        </FormControl>

        {startNode && (
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <Autocomplete
              options={products.filter(
                (product) => product.node_id !== startNode
              )}
              getOptionLabel={(option) =>
                `${option.name} (Block ${
                  nodes[option.node_id]?.name || "Unknown"
                })`
              }
              onChange={(event, newValue) =>
                handleProductChange(event, newValue, "end")
              }
              value={endProduct}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Desired Product"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        )}
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
