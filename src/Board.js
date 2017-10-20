// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        // console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        // console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        // console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
      // return this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      let row = this.get(rowIndex);
      let count = 0;
      for (let idx = 0; idx < row.length; idx++) {
        if (row[idx] > 0) { count++; }
        if (count > 1) { return true; }
      }
      // // .reduce is less efficient than for-loop
      // return this.get(rowIndex).reduce((acc, val) => acc + val, 0) > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (let row = 0; row < this.get('n'); row++) {
        if (this.hasRowConflictAt(row)) { return true; }
      }
      return false;
      // // .reduce is less efficient than for-loop
      // return this.rows().reduce((acc, row, idx) => this.hasRowConflictAt(idx) || acc, false);
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      let rows = this.rows();
      let count = 0;
      for (let idx = 0; idx < this.get('n'); idx++) {
        if (rows[idx][colIndex]) { count++; }
        if (count > 1) { return true; }
      }
      // // .reduce is less efficient than for-loop
      //return this.rows().reduce((acc, row, idx) => row[colIndex] + acc, 0) > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for (let col = 0; col < this.get('n'); col++) {
        if (this.hasColConflictAt(col)) { return true; }
      }
      return false;
      // // .reduce is less efficient than for-loop
      // return _.range(this.get('n')).reduce((acc, colIndex) => this.hasColConflictAt(colIndex) || acc, false);
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var mdci = majorDiagonalColumnIndexAtFirstRow;
      var pieceCount = 0;
      // find first square: 
      var currCol = mdci < 0 ? 0 : mdci;
      var currRow = mdci < 0 ? Math.abs(mdci) : 0;
      // while row and col are in range:
      while (this._isInBounds(currRow, currCol)) {
        // if piece at sq, add 1 to pieceCount
        pieceCount += this.get(currRow)[currCol];
        // check if we already have a conflict
        if (pieceCount > 1) { return true; }
        // add 1 to row, add 1 to col
        currRow++;
        currCol++;
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      // iterate over column indices from -(n-1) to (n-1)
      for (let colIdx = (-1 * (this.get('n') - 1)); colIdx < this.get('n'); colIdx++) {
        // check diagonal conflict at that col; if conflict, return true
        if (this.hasMajorDiagonalConflictAt(colIdx)) { return true; }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var mdci = minorDiagonalColumnIndexAtFirstRow;
      var pieceCount = 0;
      // find first square: 
      var currCol = mdci < this.get('n') ? mdci : this.get('n') - 1;
      var currRow = mdci < this.get('n') ? 0 : (mdci - (this.get('n')) + 1);
      // while row and col are in range:
      while (this._isInBounds(currRow, currCol)) {
        // if piece at sq, add 1 to pieceCount
        pieceCount += this.get(currRow)[currCol];
        // check if we already have a conflict
        if (pieceCount > 1) { return true; }
        // add 1 to row, add 1 to col
        currRow++;
        currCol--;
      }
      return false;             
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (var idx = 1; idx < this.get('n') + (this.get('n') - 2); idx++) {
        if (this.hasMinorDiagonalConflictAt(idx)) {
          return true;
        }
      }    
      return false;
      
      // return _.range(1, this.get('n') + (this.get('n') - 2)).reduce((acc, idx) => {
      //   return acc || this.hasMinorDiagonalConflictAt(idx);
      // }, false);
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  window.makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
