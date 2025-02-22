export function getInteger(digits = 3) {
  return (Math.random() * 10 ** digits).toFixed(0);
}

const az = 'qwertyuiopasdfghjklzxcvbnm';
const AZ = az.toUpperCase();
const NUMBERS = '12345677890';

export function generate8DigitPassword() {
  const getRandomCharacter = (text: string) => {
    const randomIndex = Math.floor(Math.random() * 100) % text.length;

    return text[randomIndex];
  };

  const getRandomChars = (text: string, amount: number): string =>
    Array.from(Array(amount))
      .map(() => getRandomCharacter(text))
      .join('');

  const twoLowercase = getRandomChars(az, 2);
  const twoUppercase = getRandomChars(AZ, 2);
  const fourNumbers = getRandomChars(NUMBERS, 4);

  return shuffle(twoLowercase + twoUppercase + fourNumbers);
}

function shuffle(value: string): string {
  return value
    .split('')
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join('');
}
