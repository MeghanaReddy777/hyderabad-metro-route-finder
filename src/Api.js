const BASE_URL = 'http://localhost:8000/api';

export const getStations = async () => {
  const response = await fetch(`${BASE_URL}/stations`);
  if (!response.ok) throw new Error('Failed to fetch stations');
  return await response.json();
};

export const findRoute = async (data) => {
  const response = await fetch(`${BASE_URL}/route/find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to find route');
  return await response.json();
};