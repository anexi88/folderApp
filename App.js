import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Main from './src/Main';

const App = () => {

  return (
    <SafeAreaView style={{ backgroundColor: "#0002", flex: 1 }}>
      <StatusBar barStyle={'light-content'} />
      <Main />
    </SafeAreaView>
  );
};

export default App;
