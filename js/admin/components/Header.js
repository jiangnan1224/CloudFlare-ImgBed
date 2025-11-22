import { store } from '../store.js';
const { computed } = Vue;

export default {
    setup() {
        const toggleMobileMenu = () => {
            store.isMobileMenuOpen = !store.isMobileMenuOpen;
        };

        const currentViewLabel = computed(() => {
            return store.menuItems.find(i => i.id === store.currentView)?.label || 'Dashboard';
        });

        return { store, toggleMobileMenu, currentViewLabel };
    },
    template: `
        <header class="glass-header px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-10 gap-4">
            <div class="flex items-center gap-3 md:gap-4">
                <button @click="toggleMobileMenu"
                    class="md:hidden p-2 -ml-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors">
                    <i class="ph ph-list text-2xl"></i>
                </button>
                <h2 class="text-xl md:text-2xl font-bold text-gray-800 tracking-tight truncate">{{
                    currentViewLabel }}</h2>
            </div>
            <div class="flex items-center gap-2 md:gap-4">
                <a href="/" target="_blank"
                    class="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5 bg-white/50 px-2 md:px-3 py-1.5 rounded-lg border border-white/50 hover:bg-white">
                    <span class="hidden md:inline">查看站点</span> <i
                        class="ph ph-arrow-square-out text-lg md:text-base"></i>
                </a>
                <div class="h-6 md:h-8 w-px bg-gray-300/50"></div>
                <div
                    class="text-xs md:text-sm font-medium text-gray-500 bg-gray-100/50 px-2 md:px-3 py-1 rounded-full border border-gray-200/50">
                    v2.0.0
                </div>
            </div>
        </header>
    `
};
