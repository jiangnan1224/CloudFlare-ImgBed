import { store } from '../store.js';
import { logout } from '../api.js';

export default {
    setup() {
        const handleMenuClick = (item) => {
            if (item.children) {
                item.isOpen = !item.isOpen;
            } else {
                store.currentView = item.id;
                store.isMobileMenuOpen = false;
            }
        };

        const handleSubMenuClick = (parent, child) => {
            store.currentView = parent.id;
            store.currentSettingsTab = child.id;
            store.isMobileMenuOpen = false;
        };

        return { store, logout, handleMenuClick, handleSubMenuClick };
    },
    template: `
        <aside
            class="w-72 glass-sidebar flex flex-col z-40 shadow-xl fixed inset-y-0 left-0 transition-transform duration-300 md:relative md:translate-x-0"
            :class="store.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'">
            <div class="p-6 flex items-center gap-4">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <i class="ph ph-cloud-arrow-up text-2xl"></i>
                </div>
                <div>
                    <h1 class="font-bold text-xl tracking-tight text-gray-900 leading-none">ImgHub</h1>
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">管理面板</span>
                </div>
            </div>

            <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <template v-for="item in store.menuItems" :key="item.id">
                    <!-- Parent Item -->
                    <a @click="handleMenuClick(item)"
                        class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer group relative overflow-hidden"
                        :class="store.currentView === item.id && !item.children ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'">
                        <i
                            :class="['ph text-xl relative z-10', item.icon, store.currentView === item.id && !item.children ? 'text-white' : 'text-gray-400 group-hover:text-gray-600']"></i>
                        <span class="font-medium relative z-10 flex-1">{{ item.label }}</span>
                        <i v-if="item.children" class="ph ph-caret-down transition-transform duration-300"
                            :class="item.isOpen ? 'rotate-180' : ''"></i>
                    </a>

                    <!-- Children -->
                    <div v-if="item.children" class="space-y-1 mt-1 overflow-hidden transition-all duration-300"
                        :style="{ maxHeight: item.isOpen ? '500px' : '0', opacity: item.isOpen ? '1' : '0' }">
                        <a v-for="child in item.children" :key="child.id" @click="handleSubMenuClick(item, child)"
                            class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer ml-4 text-sm font-medium"
                            :class="store.currentView === item.id && store.currentSettingsTab === child.id ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-white/40 hover:text-gray-800'">
                            <span class="w-1.5 h-1.5 rounded-full"
                                :class="store.currentView === item.id && store.currentSettingsTab === child.id ? 'bg-blue-500' : 'bg-gray-300'"></span>
                            {{ child.label }}
                        </a>
                    </div>
                </template>
            </nav>

            <div class="p-4 border-t border-gray-200/50 bg-white/30">
                <button @click="logout"
                    class="flex items-center gap-3 px-4 py-3 w-full text-left text-danger hover:bg-red-50/80 rounded-xl transition-colors font-medium">
                    <i class="ph ph-sign-out text-xl"></i>
                    退出登录
                </button>
            </div>
        </aside>
    `
};
