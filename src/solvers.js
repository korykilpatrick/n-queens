/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.copy = function(board) {
  var copy = [];
  board.rows().forEach(row =>
    copy.push(row.slice()));
  return copy;
};

window.findNRooksSolution = function(n) {
 
  var board = new Board(makeEmptyMatrix(n));
  
  var solutions = [];  

  // create inner recursive function
  var solve = function(piecesPlaced, row) {
    if (solutions.length > 0) {
      return solutions[0];
    }
    var piecesPlaced = piecesPlaced; 
    // iterate through columns
    for (let col = 0; col < n; col++) {
      // set piece in the square
      board.togglePiece(row, col);
      // increment pieces placed
      piecesPlaced++;
      // check if we have a valid board
      if (!board.hasAnyRooksConflicts()) {
        // if we've placed n pieces we have a solution 
        if (piecesPlaced === n) {
          // add it to our solution list
          // solutions.push(JSON.parse(JSON.stringify(board.rows())));
          solutions.push(copy(board));
        } else {
          // we're not done trying to turn this board into a solution
          // recurse if there are more rows below
          if (row < n - 1) {
            solve(piecesPlaced, row + 1);          
          }
        }
      }
      // remove piece so we can look for more solutions 
      board.togglePiece(row, col);
      // decrement pieces placed
      piecesPlaced--;
    }
    if (row < n - 1) {
      solve(piecesPlaced, row + 1);
    }
  };
  // start at row 0 with 0 pieces placed
  solve(0, 0);

  //console.log(solutions);
  
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solutions[0]));
  return solutions[0];
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
// window.countNRooksSolutions = function(n) {
//   var board = new Board(makeEmptyMatrix(n));
//   var solutions = 0;  
//   // create inner recursive function
//   var solve = function(piecesPlaced, row) {
//     var piecesPlaced = piecesPlaced; 
//     // iterate through columns
//     for (let col = 0; col < n; col++) {
//       // set piece in the square
//       board.togglePiece(row, col);
//       // increment pieces placed
//       piecesPlaced++;
//       // check if we have a valid board
//       if (!board.hasAnyRooksConflicts()) {
//         // if we've placed n pieces we have a solution 
//         if (piecesPlaced === n) {
//           // add it to our solution list
//           // solutions.push(JSON.parse(JSON.stringify(board.rows())));
//           solutions++;   
//         } else {
//           // we haven't placed enough pieces, so recurse if there are more rows below
//           if (row < n - 1) {
//             solve(piecesPlaced, row + 1);          
//           }
//         }
//       }
//       // remove piece so we can look for more solutions 
//       board.togglePiece(row, col);
//       // decrement pieces placed
//       piecesPlaced--;
//     }
//     if (row < n - 1) {
//       solve(piecesPlaced, row + 1);
//     }
//   };
//   // start at row 0 with 0 pieces placed
//   solve(0, 0); 
//   console.log('Number of solutions for ' + n + ' rooks:', solutions);
//   return solutions;
// };

window.countNRooksSolutions = function(n) {
  var board = new Board(makeEmptyMatrix(n));
  var solutions = 0;
  // store list of the columns available
  var colsOK = {};
  _(_.range(0, n)).forEach(num => colsOK[num] = num);  
  // create inner recursive function
  var solve = function(piecesPlaced, row, colsObj) {
    var piecesPlaced = piecesPlaced; 
    // iterate through columns
    // for (let col = 0; col < n; col++) {
    _.each(colsOK, col => {  
      // set piece in the square
      board.togglePiece(row, col);
      // increment pieces placed
      piecesPlaced++;
      // remove the column from list of OK cols
      delete colsObj[col];
      // if we've placed n pieces we have a solution 
      if (piecesPlaced === n) {
        // add it to our solution list
        // solutions.push(JSON.parse(JSON.stringify(board.rows())));
        solutions++;   
      } else {
        // we haven't placed enough pieces, so recurse if there are more rows below
        if (row < n - 1) {
          solve(piecesPlaced, row + 1, colsOK);          
        }
      }
      // remove piece so we can look for more solutions 
      board.togglePiece(row, col);
      // decrement pieces placed
      piecesPlaced--;
      // replace column we removed earlier
      colsObj[col] = col;
    }); // end _.each loop
    if (row < n - 1) {
      solve(piecesPlaced, row + 1, colsOK);
    }
  };
  // start at row 0 with 0 pieces placed
  solve(0, 0, colsOK); 
  console.log('Number of solutions for ' + n + ' rooks:', solutions);
  return solutions;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {

  var board = new Board(makeEmptyMatrix(n));
  
  var solutions = [];  

  // create inner recursive function
  var solve = function(piecesPlaced, row) {
    if (solutions.length > 0) {
      return solutions[0];
    }    
    var piecesPlaced = piecesPlaced; 
    // iterate through columns
    for (let col = 0; col < n; col++) {
      // set piece in the square
      board.togglePiece(row, col);
      // increment pieces placed
      piecesPlaced++;
      // check if we have a valid board
      if (!board.hasAnyQueenConflictsOn(row, col)) {
        // if we've placed n pieces we have a solution 
        if (piecesPlaced === n) {
          // add it to our solution list
          // solutions.push(JSON.parse(JSON.stringify(board.rows())));
          solutions.push(copy(board));   
 
        } else {
          // we're not done trying to turn this board into a solution
          // recurse if there are more rows below
          if (row < n - 1) {
            solve(piecesPlaced, row + 1);          
          }
        }
      }
      // remove piece so we can look for more solutions 
      board.togglePiece(row, col);
      // decrement pieces placed
      piecesPlaced--;
    }
    if (row < n - 1) {
      solve(piecesPlaced, row + 1);
    }
  };
  // start at row 0 with 0 pieces placed
  solve(0, 0);
  
  if (n < 1) {
    return [];
  }

  if (!solutions.length) {
    solutions[0] = board.rows();
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solutions[0]));
  return solutions[0];
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  
  var board = new Board(makeEmptyMatrix(n));
  
  // store list of the columns available
  var colsOK = {};
  _(_.range(0, n)).forEach(num => colsOK[num] = num);  
  
  var solutions = 0;  
  // create inner recursive function
  var solve = function(piecesPlaced, row, colsObj) {
    var piecesPlaced = piecesPlaced; 
    // iterate through columns
    //for (let col = 0; col < n; col++) {
      
    _.each(colsObj, col => {   
      // set piece in the square
      board.togglePiece(row, col);
      // increment pieces placed
      piecesPlaced++;
      
      delete colsObj[col];
      
      // check if we have a valid board
      if (!board.hasAnyQueenConflictsOn(row, col)) {
        
      // if (!board.hasAnyMajorDiagonalConflicts() && !board.hasAnyMinorDiagonalConflicts()) {

        // if we've placed n pieces we have a solution 
        if (piecesPlaced === n) {
          // add it to our solution list
          // solutions.push(JSON.parse(JSON.stringify(board.rows())));
          solutions++;   
        } else {
          // we're not done trying to turn this board into a solution
          // recurse if there are more rows below
          if (row < n - 1) {
            solve(piecesPlaced, row + 1, colsOK);          
          }
        }
      }
      // remove piece so we can look for more solutions 
      board.togglePiece(row, col);
      // decrement pieces placed
      piecesPlaced--;
      
      colsObj[col] = col;
      
    });
    if (row < n - 1) {
      solve(piecesPlaced, row + 1, colsOK);
    }
  };
  // start at row 0 with 0 pieces placed
  solve(0, 0, colsOK);
  

  if (n < 1) {
    return 1;
  }
  
  console.log('Number of solutions for ' + n + ' queens:', solutions);
  return solutions;
};
