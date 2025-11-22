import { store, showToast } from './store.js';

export const getAuthHeaders = () => {
    const credentials = localStorage.getItem('adminCredentials');
    return credentials ? { 'Authorization': `Basic ${credentials}` } : {};
};

export const login = async () => {
    console.log('Starting login process...');
    store.loading = true;
    store.error = '';

    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000)
    );

    try {
        console.log('Sending login request...');
        const credentials = btoa(`${store.adminUsername}:${store.adminPassword}`);

        const res = await Promise.race([
            fetch('/api/manage/check', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            }),
            timeout
        ]);

        console.log('Login response received:', res.status);

        if (res.ok) {
            store.isLoggedIn = true;
            localStorage.setItem('adminCredentials', credentials);
            console.log('Login successful, fetching images...');
            fetchImages();
        } else {
            const text = await res.text();
            console.error('Login failed:', text);
            store.error = '用户名或密码错误';
        }
    } catch (e) {
        console.error('Login error:', e);
        store.error = e.message === 'Request timed out'
            ? '登录超时，请检查网络或重试。'
            : '登录失败，请重试。';
    } finally {
        store.loading = false;
        console.log('Login process finished, loading set to false');
    }
};

export const logout = () => {
    store.isLoggedIn = false;
    store.adminUsername = '';
    store.adminPassword = '';
    localStorage.removeItem('adminCredentials');
};

export const fetchImages = async (resetPage = false) => {
    if (resetPage) store.currentPage = 1;
    store.loadingImages = true;
    console.log('Fetching images...');

    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 15000)
    );

    try {
        const start = (store.currentPage - 1) * store.pageSize;
        const params = new URLSearchParams({
            start,
            count: store.pageSize,
            dir: store.currentDir,
            search: store.searchQuery
        });

        const res = await Promise.race([
            fetch(`/api/manage/list?${params}`, {
                headers: getAuthHeaders()
            }),
            timeout
        ]);

        const data = await res.json();

        if (data.files) {
            store.images = data.files;
            if (data.directories) store.directories = data.directories;
            if (data.total !== undefined) store.totalImages = data.total;
            store.selectedImages = [];
            console.log(`Loaded ${data.files.length} images`);
        }
    } catch (e) {
        console.error('Fetch images error:', e);
        showToast(e.message === 'Request timed out' ? '加载图片超时' : '加载图片失败', 'error');
    } finally {
        store.loadingImages = false;
    }
};

export const deleteImage = async (img) => {
    if (!confirm(`确定要删除 ${img.name.split('/').pop()} 吗？`)) return;

    try {
        const credentials = localStorage.getItem('adminCredentials');
        const res = await fetch(`/api/manage/delete/${encodeURIComponent(img.name)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Basic ${credentials}` }
        });

        const data = await res.json();
        if (data.success) {
            showToast('图片删除成功');
            fetchImages();
        } else {
            throw new Error(data.error);
        }
    } catch (e) {
        showToast('删除图片失败', 'error');
    }
};

export const deleteSelected = async () => {
    if (!confirm(`确定要删除 ${store.selectedImages.length} 张图片吗？`)) return;

    let successCount = 0;
    for (const img of store.selectedImages) {
        try {
            const credentials = localStorage.getItem('adminCredentials');
            const res = await fetch(`/api/manage/delete/${encodeURIComponent(img.name)}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${credentials}` }
            });
            if (res.ok) successCount++;
        } catch (e) {
            console.error(e);
        }
    }
    showToast(`已删除 ${successCount} 张图片`);
    fetchImages();
};

export const moveSelected = async () => {
    if (!store.moveTargetDir) return;
    store.movingImages = true;

    let successCount = 0;
    let targetDir = store.moveTargetDir;
    if (targetDir === '/') targetDir = '';

    for (const img of store.selectedImages) {
        try {
            const credentials = localStorage.getItem('adminCredentials');
            const res = await fetch(`/api/manage/move/${encodeURIComponent(img.name)}?dist=${encodeURIComponent(targetDir)}`, {
                method: 'POST',
                headers: { 'Authorization': `Basic ${credentials}` }
            });
            const data = await res.json();
            if (data.success) successCount++;
        } catch (e) {
            console.error(e);
        }
    }

    showToast(`已移动 ${successCount} 张图片`);
    store.showMoveModal = false;
    store.movingImages = false;
    fetchImages();
};

export const fetchAllSettings = async () => {
    store.loadingSettings = true;
    try {
        const headers = getAuthHeaders();
        const [sec, up, pg, oth] = await Promise.all([
            fetch('/api/manage/sysConfig/security', { headers }).then(r => r.json()),
            fetch('/api/manage/sysConfig/upload', { headers }).then(r => r.json()),
            fetch('/api/manage/sysConfig/page', { headers }).then(r => r.json()),
            fetch('/api/manage/sysConfig/others', { headers }).then(r => r.json())
        ]);

        store.settings.security = sec;
        store.settings.upload = up;
        store.settings.page = pg;
        store.settings.others = oth;
    } catch (e) {
        showToast('加载设置失败', 'error');
        console.error(e);
    } finally {
        store.loadingSettings = false;
    }
};

export const saveSettings = async () => {
    store.savingSettings = true;
    try {
        const headers = getAuthHeaders();
        await Promise.all([
            fetch('/api/manage/sysConfig/security', { method: 'POST', headers, body: JSON.stringify(store.settings.security) }),
            fetch('/api/manage/sysConfig/upload', { method: 'POST', headers, body: JSON.stringify(store.settings.upload) }),
            fetch('/api/manage/sysConfig/page', { method: 'POST', headers, body: JSON.stringify(store.settings.page) }),
            fetch('/api/manage/sysConfig/others', { method: 'POST', headers, body: JSON.stringify(store.settings.others) })
        ]);

        showToast('设置保存成功');
    } catch (e) {
        showToast('保存设置失败', 'error');
    } finally {
        store.savingSettings = false;
    }
};
