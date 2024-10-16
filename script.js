// Fetch jokes from the API
const fetchJokes = async (topic = '') => {
  const url = topic ? `https://icanhazdadjoke.com/search?term=${topic}` : 'https://icanhazdadjoke.com/';
  const jokesDiv = document.getElementById('jokes');
  jokesDiv.innerHTML = '<div class="loading">Loading...</div>'; // Display loading indicator
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const jokes = data.results.map(joke => joke.joke);
      localStorage.setItem('jokes', JSON.stringify(jokes));
      return jokes;
    } else if (data.joke) {
      const jokes = [data.joke];
      localStorage.setItem('jokes', JSON.stringify(jokes));
      return jokes;
    } else {
      return ['No jokes found for that topic.'];
    }
  } catch (error) {
    console.error('Error fetching the jokes:', error);
    return ['Oops! Something went wrong. Please try again later.'];
  }
};

// Display jokes on the page
const displayJokes = (jokes) => {
  const jokesDiv = document.getElementById('jokes');
  jokesDiv.innerHTML = ''; // Clear previous content
  jokes.forEach(joke => {
    const jokeDiv = document.createElement('div');
    jokeDiv.classList.add('joke-item');
    jokeDiv.textContent = joke;
    jokesDiv.appendChild(jokeDiv);
  });
};

// Add event listener to the button
document.getElementById('getJokeButton').addEventListener('click', async () => {
  const topic = document.getElementById('topicInput').value.trim();
  const jokes = await fetchJokes(topic);
  displayJokes(jokes);
});

// Display the last fetched jokes on page reload
window.addEventListener('load', () => {
  const savedJokes = JSON.parse(localStorage.getItem('jokes'));
  if (savedJokes && savedJokes.length > 0) {
    displayJokes(savedJokes);
  } else {
    displayRandomJoke();
  }
});

// Function to display a random joke if no topic is provided
const displayRandomJoke = async () => {
  const jokes = await fetchJokes();
  displayJokes(jokes);
};

// Function to clear the displayed jokes and reset the input field
const clearJokes = () => {
  document.getElementById('jokes').innerHTML = '';
  document.getElementById('topicInput').value = '';
  localStorage.removeItem('jokes');
};

// Optionally, add a clear button
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Jokes';
clearButton.addEventListener('click', clearJokes);
document.querySelector('.container').appendChild(clearButton);
