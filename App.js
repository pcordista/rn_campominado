import React, { Component } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

import params from "./src/params";
import Field from "./src/components/Campo";
import MineField from "./src/components/MineField";
import Header from './src/components/Header';
import LevelSelection from './src/components/screen/LevelSelecting'
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hasExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed
} from "./src/functions";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.createState();
  }

  mineAmout = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return Math.ceil(cols * rows * params.difficultLevel);
  };

  createState = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return {
      board: createMinedBoard(rows, cols, this.mineAmout()),
      won: false,
      lost: false,
      showLevelSelection: false
    };
  };

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board);
    openField(board, row, column);
    const lost = hasExplosion(board);
    const won = wonGame(board);

    if (lost) {
      showMines(board);
      Alert.alert("Perdeeeeeu!", "Que Burro");
    }

    if (won) {
      Alert.alert("Parabens", "você ganhou");
    }

    this.setState({ board, lost, won });
  };

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if(won) {
      Alert.alert('Parabens', 'Você venceu')
    }

    this.setState({board, won})
  }

  onLevelSelected = level => {
    params.difficultLevel = level
    this.setState(this.createState())
  }

  render() {
    return (
      <View style={styles.container}>
        <LevelSelection isVisible={this.state.showLevelSelection} onLevelSelected={this.onLevelSelected} onCancel={() => this.setState({showLevelSelection: false})}/>
        <Header onFlagPress={() => this.setState({showLevelSelection: true})} flagsLeft={this.mineAmout() - flagsUsed(this.state.board)} onNewGame={() => this.setState(this.createState())} />
        <View style={styles.board}>
          <MineField board={this.state.board} onOpenField={this.onOpenField} onSelectField={this.onSelectField} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    justifyContent: "flex-end"
  },
  board: {
    alignItems: "center",
    backgroundColor: "#AAA"
  }
});
