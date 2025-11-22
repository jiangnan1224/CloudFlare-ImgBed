import { store } from './store.js';
import { login, fetchImages, fetchAllSettings } from './api.js';
import LoginView from './components/LoginView.js';
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import ImageManager from './components/ImageManager.js';
import Settings from './components/Settings.js';
import { PreviewModal, MoveModal, DeleteModal } from './components/Modals.js';

const { createApp, onMounted, watch } = Vue;

const App = {
    components: {
        LoginView,
        Sidebar,
        Header,
        ImageManager,
        Settings,
        PreviewModal,
        MoveModal,
        DeleteModal
    },
    setup() {
        // Watch for view change to load settings
        watch(() => store.currentView, (newVal) => {
            if (newVal === 'settings') {
                fetchAllSettings();
            }
        });

        onMounted(async () => {
            const savedCredentials = localStorage.getItem('adminCredentials');
            if (savedCredentials) {
                try {
                    const decoded = atob(savedCredentials);
                    const [username, password] = decoded.split(':');
                    store.adminUsername = username;
                    store.adminPassword = password;
                    await login();
                } catch (e) {
                    console.error('Failed to decode credentials:', e);
                    localStorage.removeItem('adminCredentials');
                }
            }
            store.checkingAuth = false;
        });

        return { store };
    },
    template: `
        <div class="h-screen flex flex-col overflow-hidden">
            <!-- Initial Loading State -->
            <div v-if="store.checkingAuth" class="flex-1 flex items-center justify-center">
                <div class="text-center">
                    <i class="ph ph-spinner animate-spin text-5xl text-primary mb-4"></i>
                    <p class="text-gray-500 font-medium">加载中...</p>
                </div>
            </div>

            <!-- Login View -->
            <LoginView v-else-if="!store.isLoggedIn" />

            <!-- Main Dashboard -->
            <div v-else class="flex h-screen overflow-hidden bg-white/30 backdrop-blur-3xl">
                <!-- Mobile Overlay -->
                <div v-if="store.isMobileMenuOpen" @click="store.isMobileMenuOpen = false"
                    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-opacity"></div>

                <!-- Sidebar -->
                <Sidebar />

                <!-- Content Area -->
                <main class="flex-1 flex flex-col overflow-hidden relative">
                    <!-- Header -->
                    <Header />

                    <!-- Views -->
                    <div class="flex-1 overflow-auto px-6 pb-6 pt-4 scroll-smooth">
                        <!-- Image Manager View -->
                        <ImageManager v-if="store.currentView === 'images'" />

                        <!-- Settings View -->
                        <Settings v-if="store.currentView === 'settings'" />
                    </div>
                </main>
            </div>

            <!-- Modals -->
            <PreviewModal />
            <MoveModal />
            <DeleteModal />

            <!-- Toast Notification -->
            <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                <transition-group name="fade">
                    <div v-for="toast in store.toasts" :key="toast.id"
                        class="bg-gray-900/90 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto min-w-[320px] border border-white/10 transform transition-all duration-300">
                        <i
                            :class="['ph text-2xl', toast.type === 'success' ? 'ph-check-circle text-success' : 'ph-warning-circle text-danger']"></i>
                        <span class="text-sm font-medium">{{ toast.message }}</span>
                    </div>
                </transition-group>
            </div>
        </div>
    `
};

createApp(App).mount('#app');
