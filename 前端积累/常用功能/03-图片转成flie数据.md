# base64 图片转成 file数据


```javascript
const base64ToFile = (base64, filename, mimeType = 'image/png') => {
    // 去掉头部信息
    const byteString = atob(base64.split(',')[1]);
    
    // 创建一个 Uint8Array 长度为 byteString 的长度
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    // 将每个字符的 UTF-8 编码加入到数组中
    for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
    }
    // 创建 File 对象
    return new File([ab], filename, { type: mimeType });
}

const imageBlob = base64ToFile(message.data)

```

