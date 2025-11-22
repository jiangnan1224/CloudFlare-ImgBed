import { store } from '../store.js';
import { login } from '../api.js';

export default {
    setup() {
        return { store, login };
    },
    template: `
        <div class="flex-1 flex items-center justify-center p-4 relative">
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-3xl"></div>
                <div class="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-3xl">
                </div>
            </div>

            <div class="glass-panel p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
                <div class="text-center mb-8">
                    <div
                        class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-lg shadow-blue-500/30">
                        <i class="ph ph-lock-key text-4xl"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 tracking-tight">管理员登录</h1>
                    <p class="text-gray-500 mt-2 font-medium">欢迎回来，请进行身份验证。</p>
                </div>
                <form @submit.prevent="login" class="space-y-6">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-1">用户名</label>
                        <div class="relative group">
                            <input type="text" v-model="store.adminUsername"
                                class="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none pl-11"
                                placeholder="请输入用户名..." required>
                            <i
                                class="ph ph-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors text-xl"></i>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-1">密码</label>
                        <div class="relative group">
                            <input type="password" v-model="store.adminPassword"
                                class="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none pl-11"
                                placeholder="请输入密码..." required>
                            <i
                                class="ph ph-key absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors text-xl"></i>
                        </div>
                    </div>
                    <button type="submit" :disabled="store.loading"
                        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]">
                        <i v-if="store.loading" class="ph ph-spinner animate-spin text-xl"></i>
                        <span v-else>登录</span>
                        <i v-if="!store.loading" class="ph ph-arrow-right font-bold"></i>
                    </button>
                    <p v-if="store.error"
                        class="text-danger text-sm text-center bg-red-50/80 py-2.5 rounded-lg border border-red-100 font-medium">
                        {{ store.error }}</p>
                </form>
            </div>
        </div>
    `
};
