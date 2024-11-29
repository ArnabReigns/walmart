export function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const visited = {};
  const previous = {};
  const queue = [];

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    queue.push(node);
  }

  distances[startNode] = 0;

  while (queue.length > 0) {
    const currentNode = queue.reduce(
      (minNode, node) =>
        distances[node] < distances[minNode] ? node : minNode,
      queue[0]
    );

    if (currentNode === endNode) break;

    queue.splice(queue.indexOf(currentNode), 1);
    visited[currentNode] = true;

    graph[currentNode].forEach((neighbor) => {
      if (!visited[neighbor.node]) {
        const newDistance = distances[currentNode] + neighbor.distance;
        if (newDistance < distances[neighbor.node]) {
          distances[neighbor.node] = newDistance;
          previous[neighbor.node] = currentNode;
        }
      }
    });
  }

  const path = [];
  let step = endNode;
  while (previous[step]) {
    path.unshift(step);
    step = previous[step];
  }
  path.unshift(startNode);

  return { steps: [path], distance: distances[endNode] };
}
