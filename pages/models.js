const fs = wx.getFileSystemManager();


function uploadImage(filePath, httpUrl) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            filePath: filePath,
            name: 'file',
            url: httpUrl + 'api/release/uploadImage',
            header: {
                "content-type": "multipart/form-data"
            },
            success: function (res) {
                resolve(res);
            },
            fail: function (error) {
                reject(error);
            }
        });
    });
}

function compressUploadImage(filePath, httpUrl) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            filePath: filePath,
            name: 'file',
            url: httpUrl + 'api/release/compressUploadImage',
            header: {
                "content-type": "multipart/form-data"
            },
            success: function (res) {
                resolve(res);
            },
            fail: function (error) {
                reject(error);
            }
        });
    });
}

function ContaactCompressImage(filePath, httpUrl) {
    console.log("filePath", filePath)
    return new Promise((resolve, reject) => {
        wx.request({
            url: httpUrl + 'api/release/contaactCompressImage',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            data: {
                file_path: filePath,
            },
            success: function (res) {
                resolve(res);
            },
            fail: function (error) {
                reject(error);
            }
        });
    });
}


function compressAndReturnPath(filePath, quality, Width) {
    return new Promise((resolve, reject) => {
        wx.compressImage({
            src: filePath,
            quality: quality,
            compressedWidth: Width,
            success: (res) => {
                const compressPath = res.tempFilePath;
                resolve(compressPath);
            },
            fail: (error) => {
                reject(error);
            }
        });
    });
}

function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}


module.exports = {
    uploadImage: uploadImage,
    compressUploadImage: compressUploadImage,
    ContaactCompressImage: ContaactCompressImage,
    compressAndReturnPath: compressAndReturnPath,
    debounce: debounce,
};