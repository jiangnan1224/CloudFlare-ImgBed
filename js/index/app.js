import { store, showToast } from './store.js';
import { checkConfig, uploadFile } from './api.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import AuthModal from './components/AuthModal.js';
import UploadArea from './components/UploadArea.js';
import UploadList from './components/UploadList.js';

const { createApp, onMounted, onUnmounted, reactive } = Vue;

const App = {
    components: {
        Header,
        Footer,
        AuthModal,
        UploadArea,
        UploadList
    },
    setup() {
        const handleGlobalPaste = (e) => {
            if (store.authRequired && !store.isAuthenticated) return;

            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            const files = [];
            for (let item of items) {
                if (item.kind === 'file') {
                    files.push(item.getAsFile());
                }
            }
            if (files.length > 0) {
                processFiles(files);
            }
        };

        const processFiles = (files) => {
            files.forEach(file => {
                if (!file.type.startsWith('image/')) {
                    showToast(`已跳过 ${file.name}：不是图片文件`, 'error');
                    return;
                }

                const uploadItem = reactive({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    file: file,
                    status: 'uploading', // uploading, success, error
                    progress: 0,
                    preview: URL.createObjectURL(file),
                    result: null,
                    error: null,
                    copied: null
                });

                store.uploads.unshift(uploadItem);
                uploadFile(uploadItem);
            });
        };

        onMounted(() => {
            window.addEventListener('paste', handleGlobalPaste);
            checkConfig();
        });

        onUnmounted(() => {
            window.removeEventListener('paste', handleGlobalPaste);
        });

        return { store };
    },
    template: `
        <div class="flex-1 flex flex-col">
            <!-- Navigation -->
            <Header />

            <!-- Main Content -->
            <main class="flex-1 pt-24 pb-12 px-6 relative">
                <!-- Login Overlay -->
                <AuthModal />

                <div class="max-w-4xl mx-auto space-y-12"
                    :class="{'filter blur-sm pointer-events-none': store.authRequired && !store.isAuthenticated}">

                    <!-- Hero Section -->
                    <div class="text-center space-y-4">
                        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                            Upload simply. <span class="text-primary">Share instantly.</span>
                        </h1>
                        <p class="text-lg text-gray-500 max-w-2xl mx-auto">
                            拖放您的图片到这里，或从剪贴板粘贴。快速、安全、可靠的图片托管服务。
                        </p>
                    </div>

                    <!-- Upload Area -->
                    <UploadArea />

                    <!-- Upload List -->
                    <UploadList />

                </div>
            </main>

            <!-- Footer -->
            <Footer />

            <!-- Toast Notification -->
            <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                <transition-group name="fade">
                    <div v-for="toast in store.toasts" :key="toast.id"
                        class="bg-gray-900/90 backdrop-blur text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 pointer-events-auto min-w-[300px] transform transition-all duration-300 border border-white/10">
                        <i
                            :class="['ph text-xl', toast.type === 'success' ? 'ph-check-circle text-green-400' : 'ph-warning-circle text-red-400']"></i>
                        <span class="text-sm font-medium">{{ toast.message }}</span>
                    </div>
                </transition-group>
            </div>
        </div>
    `
};

createApp(App).mount('#app');
