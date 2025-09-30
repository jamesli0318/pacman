import { MazeData } from '../../types/maze';
import level1 from './level1';

// Import more levels as they are created
// import level2 from './level2';
// import level3 from './level3';
// ... etc

export const mazes: { [key: number]: MazeData } = {
  1: level1,
  // Placeholder for additional levels - will be implemented
  2: level1, // TODO: Create unique level 2
  3: level1, // TODO: Create unique level 3
  4: level1, // TODO: Create unique level 4
  5: level1, // TODO: Create unique level 5
  6: level1, // TODO: Create unique level 6
  7: level1, // TODO: Create unique level 7
  8: level1, // TODO: Create unique level 8
  9: level1, // TODO: Create unique level 9
  10: level1, // TODO: Create unique level 10
};

export const getMaze = (level: number): MazeData => {
  return mazes[level] || mazes[1];
};

export default mazes;