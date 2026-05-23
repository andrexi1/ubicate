export function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const steps = [];

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[start] = 0;

  let queue = [start];

  while (queue.length > 0) {
    let current = queue[0];
    for (let node of queue) {
      if (distances[node] < distances[current]) current = node;
    }

    if (current === end) break;

    queue = queue.filter((n) => n !== current);
    visited.add(current);

    steps.push({
      current,
      distances: { ...distances },
      visited: Array.from(visited),
    });

    if (graph[current]) {
      Object.keys(graph[current]).forEach((neighbor) => {
        if (visited.has(neighbor)) return;
        const weight = graph[current][neighbor].weight;
        const newDist = distances[current] + weight;

        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = current;
          if (!queue.includes(neighbor)) queue.push(neighbor);
        }
      });
    }
  }

  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path,
    distance: distances[end] === Infinity ? Infinity : distances[end],
    steps,
  };
}
