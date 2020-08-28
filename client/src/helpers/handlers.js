export const calcPriceByDistance = (distance, NumOfPassengers) => {
  // distance is metric data
  const kms = distance / 1000;
  // Multiplier: 2 ppl - 1.5, 3 ppl - 2.2, 4 ppl - 3
  let multiplier;
  switch (NumOfPassengers) {
    case "4":
      multiplier = 3;
      break;
    case "3":
      multiplier = 2.2;
      break;
    case "2":
      multiplier = 1.5;
      break;
    default:
      multiplier = 1;
  }

  // Price table per passenger
  // | start range |   $   |
  // |     15      |   5   |

  // |   over km   | $/km  | max |
  // |   15 - 30   | 0.2   |  8  |
  // |   30 - 200  | 0.1   |  25 |
  // |     200+    | 0.07  |
  let pricePerPerson;
  if (kms < 15) {
    pricePerPerson = 5;
  } else if (kms < 30) {
    pricePerPerson = 5 + (kms - 15) * 0.2;
  } else if (kms < 200) {
    pricePerPerson = 8 + (kms - 30) * 0.1;
  } else {
    pricePerPerson = 25 + (kms - 200) * 0.07;
  }
  return Math.round(pricePerPerson * multiplier, 2);
};
