import { PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const IOSImagePicsGallery = (opts?: any): Promise<Asset[]> => {
    const options: any = {
        includeBase64: true,
    }

    return new Promise<Asset[]>(async (resolve, reject) => {
        try {
            launchImageLibrary(opts || options, async (res: ImagePickerResponse) => {
                resolve(res.assets)
            })
        } catch (error) {
            console.log("Error: <- IOSImagePicsGallery ->", error)
            reject(undefined)
        }
    })
}

export const AndroidImagePicsGallery = (opts?: any): Promise<Asset[]> => {
    const options: any = {
        includeBase64: true,
    }

    return new Promise<Asset[]>(async (resolve, reject) => {
        try {
            launchImageLibrary(opts || options, async (res: ImagePickerResponse) => {
                resolve(res.assets)
            })
        } catch (error) {
            console.log("Error: <- AndroidImagePicsGallery ->", error)
            reject(undefined)
        }
    })
}

export const IOSImagePicsCamera = (opts?: any): Promise<Asset[]> => {
    const options: any = {
        includeBase64: true,
    }

    return new Promise<Asset[]>(async (resolve, reject) => {
        try {
            setTimeout(() => {
                launchCamera(opts || options, async (res: ImagePickerResponse) => {
                    resolve(res.assets)
                })
            }, 200);
        } catch (error) {
            console.log("Error: <- IOSImagePicsCamera ->", error)
            reject(undefined)
        }
    })
}

export const AndroidImagePicsCamera = (opts?: any): Promise<Asset[]> => {
    const options: any = {
        includeBase64: true,
    }

    return new Promise<Asset[]>(async (resolve, reject) => {
        try {
            launchCamera(opts || options, async (res: ImagePickerResponse) => {
                resolve(res.assets)
            })
        } catch (error) {
            console.log("Error: <- AndroidImagePicsCamera ->", error)
            reject(undefined)
        }
    })
}

const getAndroidPermisions = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: "Cool Photo App Camera Permission",
                message:
                    "The APP needs access to your storage ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("permission granted");
        } else {
            console.log("permission denied");
        }
    } catch (err) {
        console.warn(err);
    }
}

export const AndroidFoldersAdvanceGetRoot = async () => {
    await getAndroidPermisions()
    const defaultPath: string = "/storage/emulated/0";

    try {
        return new Promise<any[]>((resolve, reject) => {
            RNFS.readDir(defaultPath)
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                });
        })
    } catch (error) {
        console.log("Error: <- AndroidFoldersAdvanceGetRoot ->", error)
    }
}

export const AndroidFoldersAdvance = async (path: string) => {
    try {
        return new Promise<any[]>((resolve, reject) => {
            RNFS.readDir(path)
                .then((result) => {
                    console.log(result)
                    resolve(result)
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                });
        })
    } catch (error) {
        console.log("Error: <- AndroidFoldersAdvance ->", error)
    }
}

export const AndroidFoldersAdvanceFile = async (path: string, name: string) => {

    try {
        const format: string[] = name.split(".");
        const prefix: string = `data:${format[format.length - 1]};base64,`;

        return new Promise<any>((resolve, reject) => {
            RNFS.readFile(path, 'base64')
                .then((result) => {
                    resolve(prefix + result)
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                });
        })
    } catch (error) {
        console.log("Error: <- AndroidFoldersAdvanceFile ->", error)
    }
}