import { Position, OuijaElement, ControlPositions } from '@/types/ouija';

// Board dimensions
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 600;
const CENTER_X = BOARD_WIDTH / 2;
const CENTER_Y = BOARD_HEIGHT / 2;

/**
 * Calculate positions for letters A-Z arranged in a full circle
 */
export function getLetterPositions(): OuijaElement[] {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const letterElements: OuijaElement[] = [];

  const radius = 200;
  // Start from top (-90 degrees) and go clockwise
  const startAngle = -Math.PI / 2;

  letters.forEach((letter, index) => {
    const angle = startAngle + (2 * Math.PI * index) / letters.length;
    const x = CENTER_X + radius * Math.cos(angle);
    const y = CENTER_Y + radius * Math.sin(angle);

    letterElements.push({
      char: letter,
      position: { x, y },
      rotation: 0 // Keep letters upright for readability
    });
  });

  return letterElements;
}

/**
 * Calculate positions for numbers 0-9 in an inner circle
 */
export function getNumberPositions(): OuijaElement[] {
  const numbers = '1234567890'.split('');
  const numberElements: OuijaElement[] = [];

  const radius = 130;
  const startAngle = -Math.PI / 2;

  numbers.forEach((num, index) => {
    const angle = startAngle + (2 * Math.PI * index) / numbers.length;
    const x = CENTER_X + radius * Math.cos(angle);
    const y = CENTER_Y + radius * Math.sin(angle);

    numberElements.push({
      char: num,
      position: { x, y },
      rotation: 0
    });
  });

  return numberElements;
}

/**
 * Get positions for control elements (YES, NO, GOODBYE)
 */
export function getControlPositions(): ControlPositions {
  return {
    yes: {
      x: CENTER_X - 120,
      y: CENTER_Y
    },
    no: {
      x: CENTER_X + 120,
      y: CENTER_Y
    },
    goodbye: {
      x: CENTER_X,
      y: CENTER_Y + 50
    }
  };
}

/**
 * Get all board elements (letters, numbers, controls)
 */
export function getAllBoardElements() {
  const letters = getLetterPositions();
  const numbers = getNumberPositions();
  const controls = getControlPositions();

  const elementMap = new Map<string, Position>();

  letters.forEach(el => elementMap.set(el.char, el.position));
  numbers.forEach(el => elementMap.set(el.char, el.position));
  elementMap.set('YES', controls.yes);
  elementMap.set('NO', controls.no);
  elementMap.set('GOODBYE', controls.goodbye);
  elementMap.set('START', { x: CENTER_X, y: CENTER_Y });

  return {
    letters,
    numbers,
    controls,
    elementMap
  };
}

/**
 * Calculate rotation angle to point from one position to another
 */
export function calculateRotation(from: Position, to: Position): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}
