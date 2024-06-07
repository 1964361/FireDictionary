// Load words from JSON file
async function loadWords() {
  try {
    const response = await fetch('words.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading words:', error);
    return [];
  }
}

let dictionary = [];

// Populate dictionary with words
async function populateDictionary() {
  dictionary = await loadWords();
}

populateDictionary();

// Function to search for a word
async function searchWord() {
  var searchTerm = document.getElementById('searchInput').value;
  var searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  const foundWords = dictionary.filter(word => word.word.toLowerCase() === searchTerm.toLowerCase());

  if (foundWords.length > 0) {
    foundWords.forEach(entry => {
      var resultElement = document.createElement('div');
      resultElement.classList.add('result');
      resultElement.innerHTML = '<h2>' + entry.word + '</h2>';
      resultElement.innerHTML += '<p><strong>Part of Speech:</strong> ' + entry.part_of_speech + '</p>';
      resultElement.innerHTML += '<p><strong>Definition:</strong> ' + entry.definition + '</p>';
      
      const synonyms = findSynonyms(entry.definition);
      if (synonyms.length > 0) {
        resultElement.innerHTML += '<p><strong>Synonyms:</strong> ' + synonyms.join(', ') + '</p>';
      }
      
      searchResults.appendChild(resultElement);
    });
  } else {
    searchResults.innerHTML = '<p>No results found for "' + searchTerm + '".</p>';
  }
}

// Function to find synonyms for a given definition
function findSynonyms(definition) {
  const synonyms = [];
  dictionary.forEach(word => {
    if (word.definition.toLowerCase() === definition.toLowerCase() && word.word.toLowerCase() !== searchTerm.toLowerCase()) {
      synonyms.push(word.word);
    }
  });
  return synonyms;
}

// Function to suggest words as the user types
async function suggestWords(query) {
  if (query === '') {
    document.getElementById('autocomplete').style.display = 'none';
    return;
  }

  const matchedWords = dictionary.filter(word => word.word.toLowerCase().startsWith(query.toLowerCase()));

  if (matchedWords.length > 0) {
    const autocompleteContainer = document.getElementById('autocomplete');
    autocompleteContainer.innerHTML = '';
    matchedWords.forEach(item => {
      const autocompleteItem = document.createElement('div');
      autocompleteItem.classList.add('autocomplete-item');
      autocompleteItem.textContent = item.word;
      autocompleteItem.onclick = () => {
        document.getElementById('searchInput').value = item.word;
        autocompleteContainer.style.display = 'none';
      };
      autocompleteContainer.appendChild(autocompleteItem);
    });
    autocompleteContainer.style.display = 'block';
  } else {
    document.getElementById('autocomplete').style.display = 'none';
  }
}
