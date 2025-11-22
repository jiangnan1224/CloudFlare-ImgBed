const { reactive, ref } = Vue;

export const store = reactive({
    isLoggedIn: false,
    checkingAuth: true,
    adminUsername: '',
    adminPassword: '',
    loading: false,
    error: '',
    currentView: 'images',
    viewMode: 'grid',
    images: [],
    directories: [],
    currentDir: '/',
    searchQuery: '',
    loadingImages: false,
    currentPage: 1,
    pageSize: 20,
    totalImages: 0,
    toasts: [],
    selectedImages: [],
    // Modals
    showMoveModal: false,
    moveTargetDir: '/',
    movingImages: false,
    showDeleteModal: false,
    deleteTarget: null, // can be single image object or 'selected' string
    deletingImages: false,
    isMobileMenuOpen: false,

    // Image Preview State
    showPreview: false,
    previewImage: null,

    // Settings State
    currentSettingsTab: 'security',
    loadingSettings: false,
    savingSettings: false,
    settings: {
        security: { auth: { user: {}, admin: {} }, access: {} },
        upload: { telegram: { channels: [] }, cfr2: { channels: [] }, s3: { channels: [] } },
        page: { config: [] },
        others: { telemetry: {}, randomImageAPI: {}, webDAV: {} }
    },

    menuItems: [
        { id: 'images', label: '图片管理', icon: 'ph-image' },
        {
            id: 'settings',
            label: '系统设置',
            icon: 'ph-gear',
            isOpen: true,
            children: [
                { id: 'security', label: '安全设置' },
                { id: 'upload', label: '上传渠道' },
                { id: 'page', label: '页面配置' },
                { id: 'others', label: '其他设置' },
            ]
        },
    ]
});

export const showToast = (message, type = 'success') => {
    const id = Date.now();
    store.toasts.push({ id, message, type });
    setTimeout(() => {
        store.toasts = store.toasts.filter(t => t.id !== id);
    }, 3000);
};
