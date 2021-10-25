import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, StatusBar, ScrollView, Image, Dimensions, View, Text
} from 'react-native';
import DocumentPicker from './src/DocumentPicker';

const App = () => {
  let eventLis;

  const [img, setImg] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    eventLis = Dimensions.addEventListener('change', () => {
      setVisible(false)
      setTimeout(() => {
        setVisible(true)
      }, 10);
    });
    return () => {
      eventLis.remove()
    };
  }, []);



  return (
    <SafeAreaView style={{ backgroundColor: "#0002", flex: 1 }}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: "#0002" }}>
        {!!img && visible && <Image style={{
          width: 200, height: 200, marginVertical: 20,
          marginLeft: (Dimensions.get('screen').width / 2) - 100
        }} source={{ uri: img }} />}

        <DocumentPicker
          buttonText={""}
          onSelect={(res) => { setImg(res); console.log(res) }}
          closeColor={"green"}
          buttonColor={"#c0c0c0"}
          mode={"POPUP"}
          advancedExplorer={false}
          customStyle={{ backgroundColor: "green", marginHorizontal: 20, marginVertical: 20 }}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
