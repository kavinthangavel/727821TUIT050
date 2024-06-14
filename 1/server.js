const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;
let numbers = [];


const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4MzQ3OTE3LCJpYXQiOjE3MTgzNDc2MTcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBhY2VhZjk3LTIyYjQtNGQ4MS1hNGY4LTljNWQ5ZjgwNjA3ZiIsInN1YiI6IjcyNzgyMXR1aXQwNTBAc2tjdC5lZHUuaW4ifSwiY29tcGFueU5hbWUiOiJnb01hcnQiLCJjbGllbnRJRCI6IjBhY2VhZjk3LTIyYjQtNGQ4MS1hNGY4LTljNWQ5ZjgwNjA3ZiIsImNsaWVudFNlY3JldCI6InJua1hHbmxFQnZITGlvQXkiLCJvd25lck5hbWUiOiJLYXZpbiIsIm93bmVyRW1haWwiOiI3Mjc4MjF0dWl0MDUwQHNrY3QuZWR1LmluIiwicm9sbE5vIjoiNzI3ODIxVFVJVDA1MCJ9.KDpmJGSHGgU86gCm5Vgy276ysUvJztrheVKQCQlpX4E';

app.use((req, res, next) => {
  res.setTimeout(500, () => {
    res.status(503).end();
  });
  next();
});

async function fetchNumbers(numberId) {
  let apiUrl = '';

  switch (numberId) {
    case 'p':
      apiUrl = 'http://20.244.56.144/test/primes';
      break;
    case 'f':
      apiUrl = 'http://20.244.56.144/test/fibo';
      break;
    case 'e':
      apiUrl = 'http://20.244.56.144/test/even';
      break;
    case 'r':
      apiUrl = 'http://20.244.56.144/test/rand';
      break;
    default:
      throw new Error('Invalid number ID.');
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}` 
      }
    });
    if (response.status === 200) {
      return response.data.numbers || [];
    }
  } catch (error) {
    console.error(`Error fetching ${numberId} numbers:`, error.message);
    return [];
  }
}

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  const prevState = [...numbers];

  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number ID.' });
  }

  try {
    const newNumbers = await fetchNumbers(numberid);

   
    newNumbers.forEach(num => {
      if (!numbers.includes(num)) {
        numbers.push(num);
        if (numbers.length > WINDOW_SIZE) {
          numbers.shift(); 
        }
      }
    });


    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const avg = numbers.length > 0 ? sum / numbers.length : 0;


    res.json({
      windowPrevState: prevState,
      windowCurrState: numbers,
      numbers: newNumbers,
      avg: avg.toFixed(2)
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
