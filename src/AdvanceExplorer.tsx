import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, SafeAreaView, TouchableOpacity, Dimensions, Text, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native';
import * as SV from './Services';
import { FolderIcon, FileIcon } from './Images';

interface Props {
    modalVisible: boolean;
    setModalVisible: Function;
    fileHandler: Function;
    color: string;
}

const defaultPath: string = "/storage/emulated/0";
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const numOfColums = Math.trunc(screenWidth / 120);

interface Element {
    name: string;
    date: Date;
    isFile: boolean;
    size: number;
    path: string;
    isImage: boolean;
    isDirectory: boolean;
    base64: string;
}

const AdvanceExplorer = ({ modalVisible, setModalVisible, fileHandler }: Props) => {
    const [path, setPath] = useState<string>(defaultPath);
    const [loading, setLoading] = useState<boolean>(false);
    const [elements, setElements] = useState<Element[]>([]);
    const [history, setHistory] = useState<string[]>([defaultPath]);

    const setData = (data: any[]) => {
        const imagesTypes: string[] = ["jpg", "jpeg", "png"]

        setLoading(true)
        setTimeout(async () => {
            if (data && data.length) {
                let itemsList = [];
                for (let index = 0; index < data.length; index++) {
                    const item = data[index];
                    const format: string[] = item.name.split(".");
                    const isImage: boolean = imagesTypes.includes(format[format.length - 1]) ? true : false;
                    let base64: string = "";

                    if (isImage) {
                        base64 = await SV.AndroidFoldersAdvanceFile(item.path, item.name)
                    }

                    const element: Element = {
                        name: item.name,
                        date: item.mtime,
                        isFile: item.isFile(),
                        size: item.size,
                        path: item.path,
                        isDirectory: item.isDirectory(),
                        isImage: isImage,
                        base64: base64,
                    }
                    itemsList.push(element)
                }
                setElements(itemsList)
            } else setElements([])
            setLoading(false)
        }, 10);
    }

    useEffect(() => {
        SV.AndroidFoldersAdvanceGetRoot().then((res: any[]) => {
            setData(res)
        })
    }, [])

    const loadNewPath = (path: string, pop?: boolean) => {
        if (pop) {
            let hist = history
            hist.pop()
            const current = hist[hist.length - 1]
            setPath(current)
            setHistory(hist)
            SV.AndroidFoldersAdvance(current).then((res: any[]) => {
                setData(res)
            })
        } else {
            let hist = history
            hist.push(path)
            setHistory(hist)
            setPath(path)
            SV.AndroidFoldersAdvance(path).then((res: any[]) => {
                setData(res)
            })
        }
    }

    const loadFile = (path: string, name: string) => {
        SV.AndroidFoldersAdvanceFile(path, name).then((res) => {
            fileHandler(res)
            setModalVisible(false)
        })
    }

    const elementHandler = (data: Element) => {
        console.log(data)
        if (data.isDirectory) {
            loadNewPath(data.path)
        } else {
            loadFile(data.path, data.name)
        }
    }

    const directoryItemRender = (element: Element, index: number) => {
        return (
            <TouchableOpacity onPress={() => elementHandler(element)} key={element.name + index} style={styles.btnTileContainer}>
                <View style={styles.btnTileImg}>
                    <Image style={styles.icon} source={{ uri: FolderIcon }} />
                </View>
                <Text numberOfLines={1} ellipsizeMode={"middle"}>{element.name}</Text>
                <Text numberOfLines={1}>{element.date.toDateString()}</Text>
            </TouchableOpacity>
        )
    }

    const imageItemRender = (element: Element, index: number) => {
        return (
            <TouchableOpacity onPress={() => elementHandler(element)} key={element.name + index} style={styles.btnTileContainer}>
                <View style={styles.btnTileImg}>
                    <Image style={styles.icon} source={{ uri: element.base64 }} />
                </View>
                <Text numberOfLines={1} ellipsizeMode={"middle"}>{element.name}</Text>
                <Text numberOfLines={1}>{element.date.toDateString()}</Text>
            </TouchableOpacity>
        )
    }

    const fileItemRender = (element: Element, index: number) => {
        return (
            <TouchableOpacity onPress={() => elementHandler(element)} key={element.name + index} style={styles.btnTileContainer}>
                <View style={styles.btnTileImg}>
                    <Image style={styles.icon} source={{ uri: FileIcon }} />
                </View>
                <Text numberOfLines={1} ellipsizeMode={"middle"}>{element.name}</Text>
                <Text numberOfLines={1}>{element.date.toDateString()}</Text>
            </TouchableOpacity>
        )
    }

    const itemsRender = ({ item, index }) => {
        const element: Element = item;
        if (element.isDirectory) return directoryItemRender(element, index)
        else if (element.isImage) return imageItemRender(element, index)
        else return fileItemRender(element, index)
    }

    const listEmpty = () => {
        return (
            <View style={styles.noFileContainer}>
                <Text style={styles.noFileText}>No files</Text>
            </View>
        )
    }

    const mainViewRender = () => {
        return (
            <View style={styles.listContainer}>
                {
                    loading ?
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" />
                        </View>
                        :
                        <FlatList
                            data={elements}
                            renderItem={itemsRender}
                            keyExtractor={(item, index) => item.name + index}
                            numColumns={numOfColums}
                            ListEmptyComponent={listEmpty}
                        />
                }
            </View>
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            hardwareAccelerated={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <SafeAreaView style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.navRow}>
                        <TouchableOpacity
                            disabled={history.length === 1}
                            style={history.length > 1 ? styles.backContainer : styles.backContainerDisabled}
                            onPress={() => loadNewPath("", true)}>
                            <Text style={styles.backBtn}>{"«"}</Text>
                        </TouchableOpacity>
                        <View style={styles.pathContainer}>
                            <ScrollView horizontal>
                                <Text style={styles.pathText}>{path}</Text>
                            </ScrollView>
                        </View>
                        <TouchableOpacity style={styles.exitContainer} onPress={() => setModalVisible()}>
                            <Text style={styles.exitBtn}>{"x"}</Text>
                        </TouchableOpacity>
                    </View>
                    {mainViewRender()}
                    <View style={styles.bottomRow}>
                        <Text>Folders {elements.filter((item) => item.isDirectory).length}</Text>
                        <Text>Files {elements.filter((item) => item.isFile).length}</Text>
                    </View>
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
        flex: 1,
        marginTop: 20,
        width: screenWidth,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
    },
    navRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: screenWidth,
        paddingHorizontal: 10,
        height: 50
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: screenWidth,
        paddingHorizontal: 10,
        paddingTop: 0,
        height: 20
    },
    pathContainer: {
        backgroundColor: "#000",
        width: (screenWidth - 150),
        paddingHorizontal: 10,
        borderRadius: 10
    },
    exitContainer: {
        backgroundColor: "#f00",
        width: 50,
        height: 50,
        borderRadius: 10
    },
    backContainer: {
        backgroundColor: "#000A",
        width: 50,
        height: 50,
        borderRadius: 10
    },
    backContainerDisabled: {
        backgroundColor: "#0004",
        width: 50,
        height: 50,
        borderRadius: 10
    },
    pathText: {
        color: "#fff",
        fontSize: 20,
        marginTop: 10
    },
    backBtn: {
        fontSize: 30,
        textAlign: "center",
        color: "#fff"
    },
    exitBtn: {
        fontSize: 30,
        textAlign: "center",
        color: "#fff"
    },
    listContainer: {
        width: screenWidth - 20,
        backgroundColor: "#0003",
        borderRadius: 10,
        marginVertical: 20,
        height: (screenHeight - 240),
    },
    btnTileContainer: {
        width: 110,
        height: 130,
        backgroundColor: "#fff",
        alignItems: "center",
        borderRadius: 10,
        margin: 5,
        padding: 5,
    },
    btnTile: {
        width: 80,
        height: 80,
        backgroundColor: "#0005",
        borderRadius: 10
    },
    btnTileImg: {
        width: 80,
        height: 80,
    },
    icon: {
        width: 60,
        height: 60,
        marginHorizontal: 10,
        marginTop: 10
    },
    loader: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    noFileContainer: {
        marginTop: 20
    },
    noFileText: {
        textAlign: "center"
    }
})

export default AdvanceExplorer;