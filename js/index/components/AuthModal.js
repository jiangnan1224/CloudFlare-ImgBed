import { store } from '../store.js';

export default {
    setup() {
        const handleLogin = () => {
            if (store.authCodeInput) {
                store.authCode = store.authCodeInput;
                localStorage.setItem('authCode', store.authCode);
                store.isAuthenticated = true;
                store.authError = '';
            } else {
                store.authError = '请输入有效的代码';
            }
        };

        return { store, handleLogin };
    },
    template: `
        <div v-if="store.authRequired && !store.isAuthenticated"
            class="absolute inset-0 z-40 bg-white/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
            <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
                <div
                    class="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <i class="ph ph-lock-key text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">需要身份验证</h2>
                <p class="text-gray-500 mb-8">请输入访问代码以上传图片。</p>

                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div class="relative">
                        <input type="password" v-model="store.authCodeInput"
                            class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-center tracking-widest text-lg"
                            placeholder="输入访问代码" required>
                    </div>
                    <button type="submit"
                        class="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transform active:scale-[0.98]">
                        <span>访问上传</span>
                        <i class="ph ph-arrow-right font-bold"></i>
                    </button>
                    <p v-if="store.authError" class="text-red-500 text-sm font-medium animate-pulse">{{ store.authError }}</p>
                </form>
            </div>
        </div>
    `
};
