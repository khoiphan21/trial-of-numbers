import { Injectable } from '@angular/core';
import { HintCard } from '@luna-academy-trial-of-numbers/definitions';

type HintFrequency = {
  text: string;
  type: HintCard['type'];
  count: number;
  validator: (num: number, position: number, numbers: number[]) => boolean;
};

@Injectable({
  providedIn: 'root',
})
export class HintService {
  private readonly hintFrequencies: HintFrequency[] = [
    {
      text: 'Even number',
      type: 'EVEN',
      count: 1,
      validator: (num) => num % 2 === 0,
    },
    {
      text: 'Greater than 4',
      type: 'GREATER_THAN',
      count: 10,
      validator: (num) => num > 4,
    },
    {
      text: 'Less than 6',
      type: 'LESS_THAN',
      count: 10,
      validator: (num) => num < 6,
    },
    {
      text: 'Greater than 6',
      type: 'GREATER_THAN',
      count: 10,
      validator: (num) => num > 6,
    },
    {
      text: 'Less than 4',
      type: 'LESS_THAN',
      count: 10,
      validator: (num) => num < 4,
    },

    // Common Hints (10 each)
    {
      text: 'Next to an odd number',
      type: 'ADJACENT',
      count: 10,
      validator: (num, pos, numbers) =>
        (pos > 0 && numbers[pos - 1] % 2 !== 0) ||
        (pos < 4 && numbers[pos + 1] % 2 !== 0),
    },
    {
      text: 'Next to an even number',
      type: 'ADJACENT',
      count: 10,
      validator: (num, pos, numbers) =>
        (pos > 0 && numbers[pos - 1] % 2 === 0) ||
        (pos < 4 && numbers[pos + 1] % 2 === 0),
    },
    {
      text: 'Prime number',
      type: 'PRIME',
      count: 10,
      validator: this.isPrime,
    },
    {
      text: 'Divisible by 3',
      type: 'DIVISIBLE',
      count: 10,
      validator: (num) => num % 3 === 0,
    },
    {
      text: 'Divisible by 5',
      type: 'DIVISIBLE',
      count: 10,
      validator: (num) => num % 5 === 0,
    },

    {
      text: 'Between 3 and 8',
      type: 'RANGE',
      count: 10,
      validator: (num) => num > 3 && num < 8,
    },
    {
      text: 'Between 2 and 7',
      type: 'RANGE',
      count: 10,
      validator: (num) => num > 2 && num < 7,
    },
    {
      text: 'Next to a prime number',
      type: 'ADJACENT',
      count: 10,
      validator: (num, pos, numbers) =>
        (pos > 0 && this.isPrime(numbers[pos - 1])) ||
        (pos < 4 && this.isPrime(numbers[pos + 1])),
    },
  ];

  generateGameDeck(numbers: number[]): HintCard[] {
    const deck: HintCard[] = [];

    this.hintFrequencies.forEach((hintType) => {
      // Create the specified number of each hint type
      for (let i = 0; i < hintType.count; i++) {
        // For each number in the sequence, check if the hint applies
        numbers.forEach((num, position) => {
          if (hintType.validator(num, position, numbers)) {
            deck.push({
              id: crypto.randomUUID(),
              text: hintType.text,
              type: hintType.type,
              value: num,
              slot: String.fromCharCode(65 + position) as 'A' | 'B' | 'C' | 'D',
              isFlipped: false,
            });
          }
        });
      }
    });

    return this.shuffleArray(deck);
  }

  dealPlayerHand(deck: HintCard[]): HintCard[] {
    return this.shuffleArray(deck).slice(0, 10);
  }

  private isPrime(num: number): boolean {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}
