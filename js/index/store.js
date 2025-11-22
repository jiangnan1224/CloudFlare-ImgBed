const { reactive, ref } = Vue;

export const store = reactive({
    isDragging: false,
    fileInput: null,
    uploads: [],
    toasts: [],

    // Auth State
    authRequired: false,
    isAuthenticated: false,
    authCodeInput: '',
    authError: '',
    authCode: ''
});

export const showToast = (message, type = 'success') => {
    const id = Date.now();
    store.toasts.push({ id, message, type });
    setTimeout(() => {
        store.toasts = store.toasts.filter(t => t.id !== id);
    }, 3000);
};
