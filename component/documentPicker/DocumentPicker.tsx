import React, { useEffect, useState } from 'react';
import { View, Button, TouchableOpacity, ViewStyle } from 'react-native';
import { Asset } from 'react-native-image-picker';
import * as SV from './Services';
import { getSystemName } from 'react-native-device-info';
import DefaultModal from './DefaultModal';
import AdvanceExplorer from './AdvanceExplorer';

interface Props {
    types?: string[]; // only Windows and Android
    customButton?: any | undefined;
    customStyle?: ViewStyle
    buttonColor?: string;
    buttonText: string;
    closeColor?: string;
    onSelect: Function;
    mode: "GALLERY" | "CAMERA" | "POPUP"; // only iOS and Android
    advancedExplorer?: boolean; // only Windows and Android
}

const DocumentPicker = ({ buttonText, onSelect, buttonColor, customStyle, customButton, closeColor, advancedExplorer, mode }: Props) => {
    const [OS, setOS] = useState<"IOS" | "ANDROID" | "WINDOWS">("ANDROID");
    const [popupOpen, setPopupOpen] = useState<boolean>(false);
    const [advancedExplorerOpen, setAdvancedExplorerOpen] = useState<boolean>(false);

    useEffect(() => setOS(getSystemName().toUpperCase() as "IOS" | "ANDROID" | "WINDOWS"), [])

    const imageReciverHandler = (res: Asset[]) => {
        if (res) {
            const prefix: string = `data:${res[0].type};base64,`;
            onSelect(prefix + res[0].base64)
        }
    }

    const androidHandler = (type?: "GALLERY" | "CAMERA") => {
        if (advancedExplorer) {
            setAdvancedExplorerOpen(true)
        } else if (!!type) {
            type === "CAMERA" && SV.AndroidImagePicsCamera().then((res: Asset[]) => imageReciverHandler(res))
            type === "GALLERY" && SV.AndroidImagePicsGallery().then((res: Asset[]) => imageReciverHandler(res))
            setPopupOpen(false)
        } else {
            mode === "CAMERA" && SV.AndroidImagePicsCamera().then((res: Asset[]) => imageReciverHandler(res))
            mode === "GALLERY" && SV.AndroidImagePicsGallery().then((res: Asset[]) => imageReciverHandler(res))
            mode === "POPUP" && setPopupOpen(true)
        }
    }

    const windowsHandler = () => {
        return
    }

    const iosHandler = (type?: "GALLERY" | "CAMERA") => {
        if (!!type) {
            type === "CAMERA" && SV.IOSImagePicsCamera().then((res: Asset[]) => imageReciverHandler(res))
            type === "GALLERY" && SV.IOSImagePicsGallery().then((res: Asset[]) => imageReciverHandler(res))
            setPopupOpen(false)
        } else {
            mode === "CAMERA" && SV.IOSImagePicsCamera().then((res: Asset[]) => imageReciverHandler(res))
            mode === "GALLERY" && SV.IOSImagePicsGallery().then((res: Asset[]) => imageReciverHandler(res))
            mode === "POPUP" && setPopupOpen(true)
        }
    }

    const buttonRender = () => {
        switch (OS) {
            case "ANDROID":
                return <Button
                    color={buttonColor || "#000"}
                    title={buttonText || "press me!"}
                    onPress={() => androidHandler()}
                />
            case "WINDOWS":
                return <Button
                    color={buttonColor || "#000"}
                    title={buttonText || "press me!"}
                    onPress={() => windowsHandler()}
                />
            case "IOS":
                return <Button
                    color={buttonColor || "#000"}
                    title={buttonText || "press me!"}
                    onPress={() => iosHandler()}
                />
            default:
                return <></>
        }
    }

    const systemHandler = (type?: "GALLERY" | "CAMERA") => {
        OS === "IOS" && iosHandler(type)
        OS === "ANDROID" && androidHandler(type)
        OS === "WINDOWS" && windowsHandler()
    }

    return (
        <React.Fragment>
            {
                customButton ?
                    <TouchableOpacity onPress={() => {
                        systemHandler()
                    }}>
                        {customButton}
                    </TouchableOpacity>
                    :
                    <View style={{ ...customStyle } || {}}>
                        {buttonRender()}
                    </View>
            }
            <DefaultModal color={closeColor} buttonOnPress={(res) => systemHandler(res)} modalVisible={popupOpen} setModalVisible={() => setPopupOpen(false)} />
            <AdvanceExplorer color={closeColor} modalVisible={advancedExplorerOpen} setModalVisible={() => setAdvancedExplorerOpen(false)} fileHandler={(res) => onSelect(res)} />
        </React.Fragment>
    )
}

export default DocumentPicker;