import React, { useState, useEffect } from 'react';
import { ScrollView, Image, Dimensions, View } from 'react-native';
import DocumentPicker from '../component/documentPicker/DocumentPicker';
import { GalleryIcon } from '../component/documentPicker/Images';

const Main = () => {
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

  const mockButton = () => {
    return (
      <View style={{ backgroundColor: "pink", height: 50, width: 50, borderRadius: 50, marginLeft: (Dimensions.get('screen').width / 2) - 25, marginTop: 100 }}>
        <Image style={{ width: 30, height: 30, margin: 10, tintColor: "white" }} source={{ uri: GalleryIcon }} />
      </View>
    )
  }

  return (
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
        mode={"GALLERY"}
        customButton={mockButton()}
        advancedExplorer={false}
        customStyle={{ backgroundColor: "green", marginHorizontal: 20, marginVertical: 20 }}
      />

    </ScrollView>
  );
};

export default Main;
