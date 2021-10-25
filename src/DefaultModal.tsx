import React from 'react';
import { View, Image, Button, StyleSheet, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import { CameraIcon, GalleryIcon } from './Images';

interface Props {
    modalVisible: boolean;
    setModalVisible: Function;
    buttonOnPress: Function;
    color: string;
}

const DefaultModal = ({ modalVisible, setModalVisible, buttonOnPress, color }: Props) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            hardwareAccelerated={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <SafeAreaView style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => buttonOnPress("CAMERA")}>
                        <Image style={styles.icon} source={{ uri: CameraIcon }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => buttonOnPress("GALLERY")}>
                        <Image style={styles.icon} source={{ uri: GalleryIcon }} />
                    </TouchableOpacity>
                    <Button color={color || "#000"} title="close" onPress={() => setModalVisible()}></Button>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0002"
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
    },
    icon: {
        width: 60,
        height: 60,
        marginHorizontal: 10,
        marginBottom: 20
    }
})

export default DefaultModal;