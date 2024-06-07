async function searchWord() {
  var searchTerm = document.getElementById('searchInput').value;
  var searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  try {
    const response = await fetch(`https://api.dictionary.com/api/v3/references/learners/json/${searchTerm}`);
    const data = await response.json();

    if (data.length > 0) {
      data.forEach(entry => {
        var resultElement = document.createElement('div');
        resultElement.classList.add('result');
        resultElement.innerHTML = '<h2>' + entry.meta.id + '</h2>';

        if (entry.fl) {
          resultElement.innerHTML += '<p><strong>Part of Speech:</strong> ' + entry.fl + '</p>';
        }

        if (entry.shortdef) {
          resultElement.innerHTML += '<p><strong>Definition:</strong> ' + entry.shortdef[0] + '</p>';
        }

        if (entry.hwi && entry.hwi.prs) {
          resultElement.innerHTML += '<p><strong>Pronunciation:</strong> ' + entry.hwi.prs[0].mw + '</p>';
        }

        if (entry.meta.syns) {
          resultElement.innerHTML += '<p><strong>Synonyms:</strong> ' + entry.meta.syns[0].join(', ') + '</p>';
        }

        if (entry.meta.ants) {
          resultElement.innerHTML += '<p><strong>Antonyms:</strong> ' + entry.meta.ants[0].join(', ') + '</p>';
        }

        if (entry.meta.stems) {
          resultElement.innerHTML += '<p><strong>Examples Usage:</strong></p>';
          entry.meta.stems.slice(0, 3).forEach(example => {
            resultElement.innerHTML += '<p class="example">' + example + '</p>';
          });
        }

        searchResults.appendChild(resultElement);
      });
    } else {
      searchResults.innerHTML = '<p>No results found for "' + searchTerm + '".</p>';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    searchResults.innerHTML = '<p>Something went wrong. Please try again later.</p>';
  }
}

async function suggestWords(query) {
  if (query === '') {
    document.getElementById('autocomplete').style.display = 'none';
    return;
  }

  try {
    const response = await fetch(`https://api.dictionary.com/api/v3/references/learners/suggest?q=${query}`);
    const data = await response.json();

    if (data.length > 0) {
      const autocompleteContainer = document.getElementById('autocomplete');
      autocompleteContainer.innerHTML = '';
      data.forEach(item => {
        const autocompleteItem = document.createElement('div');
        autocompleteItem.classList.add('autocomplete-item');
        autocompleteItem.textContent = item;
        autocompleteItem.onclick = () => {
          document.getElementById('searchInput').value = item;
          autocompleteContainer.style.display = 'none';
        };
        autocompleteContainer.appendChild(autocompleteItem);
      });
      autocompleteContainer.style.display = 'block';
    } else {
      document.getElementById('autocomplete').style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching autocomplete data:', error);
    document.getElementById('autocomplete').style.display = 'none';
  }
}
