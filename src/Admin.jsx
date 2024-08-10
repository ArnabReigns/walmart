import React, { useEffect, useMemo, useState } from "react";
import useMouse from "./hooks/useMouse";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import img from "@/assets/img.png";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import { saveAs } from "file-saver";

const saveFile = (data, name) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  saveAs(blob, `${name}.json`);
};

const Admin = () => {
  const { targetRef, mousePos } = useMouse();
  const [nodes, setNodes] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [edges, setEdges] = useState({});

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 200,
    },
    {
      field: "x",
    },
    {
      field: "y",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: true,
    },
    {
      field: "actions",
      flex: 1,
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <Box display={"flex"} gap={1} alignItems={"center"} height={"100%"}>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                let new_nodes = { ...nodes };
                delete new_nodes[params.id];
                setNodes(new_nodes);
              }}
            >
              delete
            </Button>
            <Button
              onClick={() => {
                setSelectedNode(params.id);
              }}
            >
              view
            </Button>
          </Box>
        );
      },
    },
  ];

  const rows = useMemo(
    () =>
      Object.entries(nodes).map(([key, value], idx) => ({
        id: key,
        x: value.x,
        y: value.y,
        name: value.name,
      })),
    [nodes]
  );

  const handleClick = () => {
    setNodes((prev) => {
      const newNodes = { ...prev };
      let id = "node_" + Date.now();
      newNodes[id] = {
        x: mousePos.clientX,
        y: mousePos.clientY,
        name: id,
        id: id,
      };
      return newNodes;
    });
  };

  useEffect(() => {
    console.log(edges);
  }, [edges]);

  return (
    <Box>
      <Box display={"flex"} gap={1} height={"100vh"}>
        <Stack gap={1} flex={1} minHeight={0}>
          <Box flex={1} position={"relative"} minHeight={"50vh"}>
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
            <svg
              ref={targetRef}
              onClick={handleClick}
              height={"100%"}
              width={"100%"}
              style={{
                border: "1px solid black",
                zIndex: 99,
              }}
            >
              {Object.entries(nodes).map(([key, value], idx) => (
                <React.Fragment key={value.name}>
                  <circle
                    cx={value.x}
                    cy={value.y}
                    r={key === selectedNode ? 10 : 6}
                    strokeWidth={2}
                    stroke={key === selectedNode ? "black" : "red"}
                    fill={key === selectedNode ? "yellow" : "blue"}
                  />
                  <text
                    x={value.x}
                    y={value.y - 10}
                    textAnchor="middle"
                    fontSize="13px"
                    fill="black"
                    fontWeight={"bold"}
                  >
                    {value.name}
                  </text>
                </React.Fragment>
              ))}
              {Object.entries(edges)?.map(([key, value], idx) => {
                return value?.map(
                  (v, i) =>
                    v.name &&
                    nodes[key] &&
                    nodes[v.name] && (
                      <line
                        key={`path-${idx}`}
                        x1={nodes[key].x}
                        y1={nodes[key].y}
                        x2={nodes[v.name].x}
                        y2={nodes[v.name].y}
                        stroke="red"
                        strokeWidth="4"
                      />
                    )
                );
              })}
            </svg>
          </Box>
          <Box flex={1} height={0}>
            <DataGrid
              rows={rows}
              disableColumnResize
              experimentalFeatures={{ newEditingApi: true }}
              columns={columns}
              processRowUpdate={(newRow) => {
                const updatedRow = { ...newRow, isNew: false };

                setNodes((prevNodes) => {
                  const newNodes = { ...prevNodes };
                  let id = newRow.id;
                  newNodes[id] = { ...newRow };
                  return newNodes;
                });

                return updatedRow;
              }}
            />
          </Box>
        </Stack>

        <Box flex={1}>
          <Button
            variant="contained"
            color={"secondary"}
            sx={{ mb: 1 }}
            onClick={() => {
              saveFile(nodes, "nodes");
              saveFile(edges, "edges");
            }}
          >
            Download configuration Files
          </Button>
          <Box>
            <Typography fontSize={"1.3rem"}>Paths</Typography>
            <Stack>
              {Object.entries(nodes).map(([key, value], idx) => (
                <Box key={key}>
                  <Box display={"flex"} gap={1} alignItems={"center"}>
                    <Typography p={1} bgcolor={"divider"} width={"fit-content"}>
                      {value.name}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setEdges((prev) => {
                          const newEdges = {
                            ...prev,
                          };
                          if (!newEdges[value.id]) {
                            newEdges[value.id] = [];
                          }
                          newEdges[value.id] = [
                            ...newEdges[value.id],
                            {
                              name: "",
                              distance: 0,
                            },
                          ];
                          return newEdges;
                        });
                      }}
                    >
                      Add Connection
                    </Button>
                  </Box>
                  <Stack gap={2} ml={2} p={2}>
                    {edges[key]?.map((e, i) => (
                      <Box key={i} display={"flex"} gap={1}>
                        <FormControl
                          fullWidth
                          sx={{ width: "15rem" }}
                          size="small"
                        >
                          <InputLabel>Name</InputLabel>
                          <Select
                            value={e.name}
                            label="Name"
                            onChange={(e) => {
                              setEdges((prev) => {
                                const newEdges = {
                                  ...prev,
                                };
                                newEdges[key][i].name = e.target.value;
                                if (!newEdges[e.target.value]) {
                                  newEdges[e.target.value] = [];
                                }
                                newEdges[e.target.value].push({
                                  name: key,
                                  distance: 0,
                                });

                                return newEdges;
                              });
                            }}
                          >
                            {Object.values(nodes)?.map(
                              (e, i) =>
                                e.id !== key && (
                                  <MenuItem value={e.id} key={i}>
                                    {e.name}
                                  </MenuItem>
                                )
                            )}
                          </Select>
                        </FormControl>
                        <TextField
                          label="distance"
                          size="small"
                          value={e.distance}
                          onChange={(e) => {
                            setEdges((prev) => {
                              const newEdges = {
                                ...prev,
                              };
                              newEdges[key][i].distance =
                                e.target.value < 0 ? 0 : e.target.value;

                              const u_node = newEdges[newEdges[key][i]?.name];

                              if (u_node) {
                                u_node.find(
                                  (e) => e.name && e.name === key
                                ).distance = e.target.value;
                              }

                              return newEdges;
                            });
                          }}
                        />

                        <IconButton
                          color="error"
                          onClick={() => {
                            setEdges((prev) => {
                              const new_edges = { ...edges };
                              delete new_edges[key][i];
                              return new_edges;
                            });
                          }}
                        >
                          <GridDeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
