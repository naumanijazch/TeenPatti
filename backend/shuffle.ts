export function shuffleCards(allCards: [string, string][]) {
  const sets: [string, string][][] = []
  for (let i = 0; i < 4; i++) {
    const temp: [string, string][] = []
    for (let j = 0; j < 9; j++) {
      const tempVal: [string, string] = allCards[Math.floor(Math.random() * allCards.length)]
      temp.push(tempVal)
      allCards.splice(allCards.indexOf(tempVal), 1)
      if (allCards.length === 0) {
        break
      }
    }
    sets.push(temp)
  }
  return sets
}


export function getRemainingCards(allCards: [string, string][], shuffledCards: [string, string][][]): [string, string][] {
  const remainingCards: [string, string][] = []
  const flattenedShuffledCards: [string, string][] = shuffledCards.flat()
  
  for (let i = 0; i < allCards.length; i++) {
    const card = allCards[i]
    if (!flattenedShuffledCards.includes(card)) {
      remainingCards.push(card)
    }
  }

  return remainingCards
}

