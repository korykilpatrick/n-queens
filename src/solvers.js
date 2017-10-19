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



window.findNRooksSolution = function(n) {
  var board = new Board(makeEmptyMatrix(n));
  
  
  // for each of rows r 0 to n:
    // for each row greater than r
      // 
  
  
  
  
  for (var row = 0; row < n; row++) {
    for (var col = 0; col < n; col++) {
      board.togglePiece(row, col)
    }    
  }
  
  
  // create inner recursive function
  var solve = function(piecesPlaced, rowsOK) {
    // iterate through columns
    for (let col = 0; col < n; col++) {
      // set piece in first available square
      board.togglePiece(rowsOK[0], col);
      // increment rook counter
      piecesPlaced++;
      // check if we have a solution
      if (piecesPlaced === n) {
        if (!board.hasAnyRooksConflicts()) { return board.rows(); }
      } else if (!rowsOK.length) {
        // base case: no options left and no solution
        return [];
      } else {
        return solve(piecesPlaced, rowsOK.slice(1));  
      }
      // if we haven't found a solution, recurse
      board.togglePiece(rowsOK[0], col);
    }
  };
  var solution = solve(0, _.range(0, n));
  
  
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
