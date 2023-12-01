import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import horseImage from "../assets/horse.png";
import bishopImage from "../assets/bishop.png";

const Grid = () => {
  const N = 8;
  const M = 8;
  const [grid, setGrid] = useState(Array.from({ length: N }, () => Array(M).fill(1)));
  const [showHorsePath, setShowHorsePath] = useState(false);
  const [showBishopPath, setShowBishopPath] = useState(false);
  const inactivePositions = [
    [0, 3], [0, 7],
    [2, 0], [2, 6],
    [4, 3], [6, 7],
    [7, 1]
  ];
  const horseMoves = [
    [-2, -1], [-2, 1],
    [-1, -2], [-1, 2],
    [1, -2], [1, 2],
    [2, -1], [2, 1],
  ];

  const bishopMoves = [
    [-1, -1], [-1, 1],
    [1, -1], [1, 1],
  ];

  const isValidPosition = (row, col) => {
    return row >= 0 && row < N && col >= 0 && col < M;
  };

  const highlightPath = (moves, piece, newGrid) => {
    moves.forEach(([dx, dy]) => {
      let row, col;
      let Steppp
      if (piece === 'horse') {
        row = 6;
        col = 6;
        Steppp = 1;
      } else {
        row = 3;
        col = 2;
        Steppp = 3;
      } // Starting positions
      let isBlocked = false;
      let stepCount = 0; // Track the steps taken
  
      while (stepCount < Steppp) { // Restrict the bishop to one step
        row += dx;
        col += dy;
  
        if (isValidPosition(row, col) && newGrid[row][col] !== 0) {
          if (inactivePositions.some(([inactiveRow, inactiveCol]) => row === inactiveRow && col === inactiveCol)) {
            isBlocked = true;
            break;
          } else {
            newGrid[row][col] = 3; // Mark the path with a different value (3)
            stepCount++; // Increment step count after valid movement
          }
        } else {
          isBlocked = true;
          break;
        }
      }
  
      if (isBlocked && ((dx === -1 && dy === -1) || (dx === -1 && dy === 1))) {
        let [r, c] = piece === 'horse' ? [6, 6] : [3, 2];
  
        while (isValidPosition(r, c)) {
          if (newGrid[r][c] === 0) {
            break;
          } else if (newGrid[r][c] !== 3 && !inactivePositions.some(([inactiveRow, inactiveCol]) => r === inactiveRow && c === inactiveCol)) {
            newGrid[r][c] = 2;
          }
          r += dx;
          c += dy;
        }
      }
    });
  };

  const dfsBishopPath = (row, col) => {
    const directions = [
      [-1, -1], [-1, 1],
      [1, -1], [1, 1],
    ];
  
    directions.forEach(([dx, dy]) => {
      let r = row + dx;
      let c = col + dy;
  
      while (isValidPosition(r, c)) {
        if (grid[r][c] !== 0) {
          if (grid[r][c] !== 3 && !inactivePositions.some(([inactiveRow, inactiveCol]) => r === inactiveRow && c === inactiveCol)) {
            grid[r][c] = 2;
          }
          r += dx;
          c += dy;
        } else {
          break;
        }
      }
    });
  };

  useEffect(() => {
    const updateGrid = () => {
      const newGrid = Array.from({ length: N }, () => Array(M).fill(1));
  
      if (showHorsePath) {
        highlightPath(horseMoves, 'horse', newGrid);
      } else if (showBishopPath) {
        dfsBishopPath(3, 2); // Start bishop path from the initial position
        highlightPath(bishopMoves, 'bishop', newGrid);
      }
  
      setGrid(newGrid);
    };
  
    if (showHorsePath || showBishopPath) {
      updateGrid();
    }
  }, [showHorsePath, showBishopPath]);

  const handleHorseClick = () => {
    setShowHorsePath((prevShowHorsePath) => !prevShowHorsePath);
    setShowBishopPath(false);
  };

  const handleBishopClick = () => {
    setShowBishopPath((prevShowBishopPath) => !prevShowBishopPath);
    setShowHorsePath(false);
  };

  const renderGrid = () => {
    return (
      <View style={styles.container}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.row]}>
            {row.map((cell, colIndex) => {
              const isInactive = inactivePositions.some(
                ([inactiveRow, inactiveCol]) =>
                  rowIndex === inactiveRow && colIndex === inactiveCol
              );

              return (
                <View
                  key={colIndex}
                  style={[
                    styles.cell,
                    (rowIndex + colIndex) % 2 === 0
                      ? styles.whiteCell
                      : styles.blackCell,
                    cell === 3 && { backgroundColor: 'yellow' },
                  ]}
                >
                  {isInactive ? (
                    <View style={styles.inactiveCell}>
                      <Text style={styles.inactiveText}>X</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (rowIndex === 3 && colIndex === 2) {
                          handleBishopClick();
                        } else if (rowIndex === 6 && colIndex === 6) {
                          handleHorseClick();
                        }
                      }}
                      style={styles.centerContent}
                    >
                      {rowIndex === 3 && colIndex === 2 ? (
                        <Image source={bishopImage} style={styles.image} />
                      ) : rowIndex === 6 && colIndex === 6 ? (
                        <Image source={horseImage} style={styles.image} />
                      ) : (
                        <Text></Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return renderGrid();
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    width: 40,
    height: 40,
  },
  whiteCell: {
    backgroundColor: 'white',
  },
  blackCell: {
    backgroundColor: '#C06234',
  },
  inactiveCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    color: 'black',
    width: 30,
    height: 30,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
  },
});

export default Grid;