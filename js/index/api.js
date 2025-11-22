import { store, showToast } from './store.js';

export const checkConfig = async () => {
    try {
        const res = await fetch('/api/userConfig');
        const config = await res.json();
        store.authRequired = config.authRequired;

        if (store.authRequired) {
            const savedCode = localStorage.getItem('authCode');
            if (savedCode) {
                store.authCode = savedCode;
                store.isAuthenticated = true;
            }
        } else {
            store.isAuthenticated = true;
        }
    } catch (e) {
        console.error('Failed to load config:', e);
    }
};

export const uploadFile = (item) => {
    const formData = new FormData();
    formData.append('file', item.file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    if (store.authRequired && store.authCode) {
        xhr.setRequestHeader('authCode', store.authCode);
    }

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            item.progress = Math.round((e.loaded / e.total) * 100);
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                if (Array.isArray(data) && data.length > 0) {
                    item.result = data[0].src;
                    const uploadedUrl = data[0].src.startsWith('http') ? data[0].src : window.location.origin + data[0].src;

                    if (item.preview && item.preview.startsWith('blob:')) {
                        URL.revokeObjectURL(item.preview);
                    }

                    item.preview = uploadedUrl;
                    item.progress = 100;
                    item.status = 'success';
                    showToast('上传成功');
                } else {
                    throw new Error('无效的响应格式');
                }
            } catch (e) {
                item.status = 'error';
                item.error = '无效的响应';
                showToast('上传失败：无效的响应', 'error');
            }
        } else {
            if (xhr.status === 401) {
                store.isAuthenticated = false;
                store.authError = '会话已过期或代码无效';
                localStorage.removeItem('authCode');
            }
            try {
                const data = JSON.parse(xhr.responseText);
                item.error = data.error || '上传失败';
            } catch (e) {
                item.error = '上传失败';
            }
            item.status = 'error';
            showToast(`上传失败：${item.error}`, 'error');
        }
    };

    xhr.onerror = () => {
        item.status = 'error';
        item.error = '网络错误';
        showToast('上传失败：网络错误', 'error');
    };

    xhr.send(formData);
};
