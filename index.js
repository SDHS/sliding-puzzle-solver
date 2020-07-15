class Board {
  constructor(board) {
    this.board = board;
    this.moves = 0;
    this.previous = null;
  }

  getTileAt(i, j) {
    if (i >= 0 && i < this.board.length && j >= 0 && j < this.board.length) {
      return this.board[i][j];
    }
    return "Index out of bounds!";
  }

  getSize() {
    return this.board.length ** 2;
  }

  getOneDimensionalRepresentation() {
    let arr = "";
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        arr += this.board[i][j];
      }
    }
    return arr;
  }

  getNumberOfMisplacedTiles() {
    let count = 0;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] !== Board.goal[i][j]) {
          if (this.board[i][j] === 0) {
            continue;
          }
          count++;
        }
      }
    }
    return count;
  }

  getNumberOfMisplacedTilesTwo() {
    let count = 0;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] !== Board.goalTwo[i][j]) {
          if (this.board[i][j] === 0) {
            continue;
          }
          count++;
        }
      }
    }
    return count;
  }

  isGoal() {
    return this.getNumberOfMisplacedTiles() === 0;
  }

  isGoalTwo() {
    return this.getNumberOfMisplacedTilesTwo() === 0;
  }
  getInversions(arr) {
    let inversions = 0;
    for (let i = 0; i < this.getSize() - 1; i++) {
      if (arr[i] === 0) {
        continue;
      }
      for (let j = i + 1; j < this.getSize(); j++) {
        if (arr[j] < arr[i]) {
          if (arr[j] === 0) {
            continue;
          }
          inversions++;
        }
      }
    }
    return inversions;
  }

  getZeroRow() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === 0) {
          return i;
        }
      }
    }
  }

  getZeroIndices() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === 0) {
          return [i, j];
        }
      }
    }
  }

  isSolvable() {
    let count = 0;
    let arr = new Array(this.getSize());
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        arr[count] = this.board[i][j];
        count++;
      }
    }
    let inversions = this.getInversions(arr);
    if (this.getSize() % 2 !== 0) {
      return inversions % 2 === 0;
    } else {
      return (inversions + this.getZeroRow()) % 2 !== 0;
    }
  }

  getChildren() {
    let children = [];
    let [zeroRow, zeroColumn] = this.getZeroIndices();

    ////////////////////////////////////////////////////////////////
    // FOREACH

    const moves = [-1, 1];
    moves.forEach((el) => {
      let potentialChild = this.board.map((el) => el.slice());
      let newZeroRow = zeroRow + el;
      let newZeroColumn = zeroColumn;
      if (newZeroRow >= 0 && newZeroRow < this.board.length) {
        let temp = potentialChild[newZeroRow][newZeroColumn];
        potentialChild[newZeroRow][newZeroColumn] = 0;
        potentialChild[zeroRow][zeroColumn] = temp;
        let child = new Board(potentialChild);
        child.previous = this;
        children.push(child);
      }
    });
    moves.forEach((el) => {
      let potentialChild = this.board.map((el) => el.slice());
      let newZeroRow = zeroRow;
      let newZeroColumn = zeroColumn + el;
      if (newZeroColumn >= 0 && newZeroColumn < this.board.length) {
        let temp = potentialChild[newZeroRow][newZeroColumn];
        potentialChild[newZeroRow][newZeroColumn] = 0;
        potentialChild[zeroRow][zeroColumn] = temp;
        let child = new Board(potentialChild);
        child.previous = this;
        children.push(child);
      }
    });
    return children;
  }

  getPriority() {
    return this.getNumberOfMisplacedTiles() + this.moves;
  }

  equals(b) {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] !== b[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  toString() {
    let str = "";
    for (let i = 0; i < this.board.length; i++) {
      str = "";
      for (let j = 0; j < this.board.length; j++) {
        str += `${this.board[i][j]}\t`;
        //process.stdout.write(`${this.board[i][j]}\t`);
      }
      console.log(str);
      console.log();
    }
  }
}

class PriorityQueue {
  constructor() {
    this.degree = 2;
    this.items = [];
  }

  getLeftChildIndex(parentIndex) {
    return this.degree * parentIndex + (this.degree - 1);
  }

  getRightChildIndex(parentIndex) {
    return this.degree * parentIndex + this.degree;
  }

  getParentIndex(childIndex) {
    return parseInt((childIndex - 1) / this.degree);
  }

  hasLeftChild(parentIndex) {
    return this.getLeftChildIndex(parentIndex) < this.items.length;
  }

  hasRightChild(parentIndex) {
    return this.getRightChildIndex(parentIndex) < this.items.length;
  }

  hasParent(childIndex) {
    return this.getParentIndex(childIndex) >= 0;
  }

  getLeftChild(parentIndex) {
    return this.items[this.getLeftChildIndex(parentIndex)];
  }

  getRightChild(parentIndex) {
    return this.items[this.getRightChildIndex(parentIndex)];
  }

  getParent(childIndex) {
    return this.items[this.getParentIndex(childIndex)];
  }

  swap(indexOne, indexTwo) {
    let temp = this.items[indexOne];
    this.items[indexOne] = this.items[indexTwo];
    this.items[indexTwo] = temp;
  }

  isEmpty() {
    return !this.items.length;
  }

  remove() {
    let element = this.copyInstance(this.items[0]);
    this.items[0] = this.items[this.items.length - 1];
    this.items.pop();
    this.heapifyDown(0);
    return element;
  }

  insert(element) {
    this.items.push(element);
    this.heapifyUp(this.items.length - 1);
  }

  heapifyUp(index) {
    while (
      this.hasParent(index) &&
      this.getParent(index).getPriority() > this.items[index].getPriority()
    ) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown(index) {
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.getRightChild(index).getPriority() <
          this.getLeftChild(index).getPriority()
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (
        this.items[index].getPriority() <
        this.items[smallerChildIndex].getPriority()
      ) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  traverse() {
    if (this.isEmpty()) {
      console.log("Empty!");
      return;
    }
    // for (let i = 0; i < this.items.length; i++) {
    //   process.stdout.write(this.items[i] + "\t");
    // }
    // console.log();
    console.log(this.items);
  }

  getSize() {
    return this.items.length;
  }

  copyInstance(original) {
    let copied = Object.assign(
      Object.create(Object.getPrototypeOf(original)),
      original
    );
    return copied;
  }
}

class Solver {
  constructor(initialBoard, goalCondition) {
    this.moves = 1;
    this.solution = [];
    let closed = {};
    let open = new PriorityQueue();
    let moves = 1;
    open.insert(initialBoard);
    while (!open.isEmpty()) {
      let parent = open.remove();
      if (goalCondition) {
        if (parent.isGoal()) {
          while (parent.previous !== null) {
            this.solution.push(parent);
            parent = parent.previous;
          }
          this.solution.push(initialBoard);
          break;
        }
      } else {
        if (parent.isGoalTwo()) {
          while (parent.previous !== null) {
            this.solution.push(parent);
            parent = parent.previous;
          }
          this.solution.push(initialBoard);
          break;
        }
      }
      if (closed[parent.getOneDimensionalRepresentation()]) {
        continue;
      } else {
        closed[parent.getOneDimensionalRepresentation()] = true;
      }
      let children = parent.getChildren();
      for (let i = 0; i < children.length; i++) {
        if (parent.previous === null) {
          children[i].moves = moves;
          open.insert(children[i]);
          continue;
        }
        if (children[i].equals(parent.previous.board)) {
          continue;
        }
        children[i].moves = moves;
        open.insert(children[i]);
      }
      moves++;
    }
  }

  printSolution() {
    for (let i = 0; i < this.solution.length; i++) {
      this.solution[i].toString();
      console.log();
    }
  }

  inClosed(closed, b) {
    for (let i = 0; i < closed.length; i++) {
      if (b.equals(closed[i].board)) {
        return true;
      }
    }
    return false;
  }
}

/////////////////////////////////////////////////////////////////////
// CREATING VARIABLES
const infoBar = document.getElementsByClassName("info--bar")[0];
const textArea = document.getElementsByClassName("textarea")[0];
const solveButton = document.getElementsByClassName("solve--button")[0];
const solutionSection = document.getElementsByClassName("solution")[0];
const goalOne = document.getElementsByClassName("goal--one")[0];
const goalTwo = document.getElementsByClassName("goal--two")[0];

let goalCondition = true;

function isCorrectInput(board) {
  let map = {};
  for (let i = 0; i < board.length; i++) {
    if (board[i].length !== board.length) {
      return false;
    }
    for (let j = 0; j < board.length; j++) {
      if (
        !Number.isInteger(board[i][j]) ||
        board[i][j] < 0 ||
        board[i][j] >= board.length ** 2
      ) {
        return false;
      }
      if (map[board[i][j]]) {
        return false;
      }
      map[board[i][j]] = true;
    }
  }
  return true;
}

function createGoal(length) {
  let goal = new Array(length);
  for (let i = 0; i < length; i++) {
    goal[i] = new Array(length);
  }
  let count = 1;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (i === length - 1 && j === length - 1) {
        goal[i][j] = 0;
      } else {
        goal[i][j] = count;
      }
      count++;
    }
  }
  return goal;
}

function createGoalTwo(length) {
  let goal = new Array(length);
  for (let i = 0; i < length; i++) {
    goal[i] = new Array(length);
  }
  let count = 0;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      goal[i][j] = count;
      count++;
    }
  }
  return goal;
}

function hideAlert() {
  infoBar.style.opacity = "0";
}

/////////////////////////////////////////////////////////////////////
// EVENT LISTENERS
textArea.addEventListener("click", () => {
  if (textArea.value === "Please enter your starting node here...") {
    textArea.value = "";
  }
});

textArea.addEventListener("focusout", () => {
  if (textArea.value === "") {
    textArea.value = "Please enter your starting node here...";
  }
});

goalOne.addEventListener("click", () => {
  goalOne.classList.add("goal--button-active");
  goalTwo.classList.remove("goal--button-active");
  goalCondition = true;
});

goalTwo.addEventListener("click", () => {
  goalTwo.classList.add("goal--button-active");
  goalOne.classList.remove("goal--button-active");
  goalCondition = false;
});

solveButton.addEventListener("click", () => {
  let start = new Date().getTime();
  infoBar.style.opacity = "1";
  solutionSection.innerHTML = "";
  let inputValue = textArea.value;
  inputValue = inputValue.split("\n").filter((el) => el.length > 0);
  let board = new Array(inputValue.length);
  for (let i = 0; i < inputValue.length; i++) {
    board[i] = new Array(inputValue.length);
  }
  for (let i = 0; i < inputValue.length; i++) {
    inputValue[i] = inputValue[i].split(",");
  }
  for (let i = 0; i < inputValue.length; i++) {
    for (let j = 0; j < inputValue.length; j++) {
      board[i][j] = parseInt(inputValue[i][j]);
    }
  }
  if (isCorrectInput(board)) {
    // alert("Calculating...");
    Board.goal = createGoal(inputValue.length);
    Board.goalTwo = createGoalTwo(inputValue.length);
    let initialNode = new Board(board);
    if (
      !initialNode.isSolvable() ||
      (inputValue.length % 2 === 0 && goalCondition === false)
    ) {
      // alert("Puzzle is insolvable!");
      infoBar.innerHTML = "Puzzle is insolvable! Try with a different puzzle!";
      infoBar.style.backgroundColor = "#DB3737";
      infoBar.style.opacity = "1";
      window.setTimeout(hideAlert, 5000);
    } else {
      let solutionObj;
      try {
        solutionObj = new Solver(initialNode, goalCondition);
      } catch (e) {
        // alert("Invalid input! Please try again!");
        infoBar.innerHTML = "Invalid input! Please try again!";
        infoBar.style.backgroundColor = "#DB3737";
        infoBar.style.opacity = "1";
        window.setTimeout(hideAlert, 5000);
        return;
      }
      let end = new Date().getTime();
      let time = end - start;
      infoBar.innerHTML = `Solved! Time taken: ${time} ms.`;
      infoBar.style.opacity = "1";
      infoBar.style.backgroundColor = "#38c354";
      window.setTimeout(hideAlert, 5000);
      const solution = solutionObj.solution;
      let board;
      for (let i = solution.length - 1; i >= 0; i--) {
        board = document.createElement("div");
        board.style.gridTemplateColumns = `repeat(${solution[i].board.length}, 5rem)`;
        board.className = "board";
        for (let j = 0; j < solution[i].board.length; j++) {
          for (let k = 0; k < solution[i].board.length; k++) {
            let tile = document.createElement("div");
            tile.className = "tile";
            if (solution[i].board[j][k] === 0) {
              tile.innerHTML = "";
            } else {
              tile.innerHTML = solution[i].board[j][k];
            }
            board.appendChild(tile);
          }
        }
        solutionSection.appendChild(board);
      }
    }
    //infoBar.style.opacity = "0";
  } else {
    // alert("Invalid input! Please try again!");
    infoBar.innerHTML = "Invalid input! Please try again!";
    infoBar.style.backgroundColor = "#DB3737";
    infoBar.style.opacity = "1";
    window.setTimeout(hideAlert, 5000);
    //infoBar.style.opacity = "0";
  }
});
