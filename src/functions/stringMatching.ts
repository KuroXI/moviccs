export const stringMatching = (word: string, match: string, isCaseSensitive = false) => {
  const position: number[][] = [];

  if (!isCaseSensitive) {
    word = word.toLowerCase();
    match = match.toLowerCase();
  }

  let index = indexOf(word, match, 0);
  while (index !== -1) {
    position.push([index, index + match.length - 1]);
    index = indexOf(word, match, index + match.length);
  }

  return {
    count: position.length,
    position,
  };
};

const indexOf = (text: string, match: string, fromIndex = 0) => {
  if (match.length === 0) return fromIndex;

  for (let index = fromIndex; index < text.length; index++) {
    let searchIndex = 0;
    while (searchIndex < match.length && text[index + searchIndex] === match[searchIndex]) {
      searchIndex++;
    }

    if (searchIndex === match.length) return index;
  }

  return -1;
};
