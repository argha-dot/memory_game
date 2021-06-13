const getRandomPassSequence = () => {
    const passSequences = [
    [
        "J",
        "K",
        "D",
        "K",
        "D",
        "L",
        "J",
        "L",
        "S",
        "J",
        "F",
        "L",
        "S",
        "K",
        "D",
        "S",
        "F",
        "S",
        "J",
        "S",
        "J",
        "L",
        "K",
        "D",
        "J",
        "F",
        "S",
        "F",
        "S",
        "K",
    ],
    [
        "L",
        "F",
        "K",
        "L",
        "K",
        "L",
        "D",
        "J",
        "L",
        "K",
        "J",
        "D",
        "J",
        "K",
        "L",
        "K",
        "L",
        "S",
        "J",
        "K",
        "J",
        "L",
        "J",
        "S",
        "F",
        "S",
        "J",
        "F",
        "J",
        "K",
    ],
    [
        "S",
        "L",
        "F",
        "K",
        "L",
        "S",
        "L",
        "K",
        "S",
        "D",
        "F",
        "S",
        "L",
        "F",
        "K",
        "S",
        "F",
        "J",
        "D",
        "L",
        "S",
        "D",
        "K",
        "S",
        "F",
        "S",
        "D",
        "K",
        "L",
        "J",
    ],
    [
        "F",
        "J",
        "K",
        "L",
        "F",
        "S",
        "F",
        "S",
        "J",
        "S",
        "J",
        "D",
        "L",
        "S",
        "F",
        "L",
        "F",
        "K",
        "S",
        "D",
        "L",
        "D",
        "J",
        "D",
        "J",
        "L",
        "K",
        "L",
        "D",
        "J",
    ],
    [
        "F",
        "L",
        "D",
        "J",
        "K",
        "J",
        "D",
        "J",
        "K",
        "S",
        "K",
        "J",
        "S",
        "J",
        "S",
        "J",
        "L",
        "F",
        "L",
        "K",
        "J",
        "S",
        "D",
        "J",
        "S",
        "J",
        "S",
        "F",
        "J",
        "K",
    ],
    ];
  return passSequences[Math.floor(Math.random() * 5)];
};

export default getRandomPassSequence;