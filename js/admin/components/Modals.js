import { store } from '../store.js';
import { getImageUrl, getImageName, formatSize, formatDate } from '../utils.js';
import { moveSelected, deleteImage, deleteSelected } from '../api.js';

export const PreviewModal = {
    setup() {
        const closePreview = () => {
            store.showPreview = false;
            setTimeout(() => {
                store.previewImage = null;
            }, 300);
        };

        return { store, getImageUrl, getImageName, closePreview };
    },
    template: `
        <div v-if="store.showPreview" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click="closePreview">
            <div class="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"></div>
            <div class="relative z-10 max-w-7xl max-h-[90vh] flex flex-col items-center justify-center animate-scale-in"
                @click.stop>
                <img v-if="store.previewImage" :src="getImageUrl(store.previewImage.name)" :alt="getImageName(store.previewImage)"
                    class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl">
                <div class="mt-4 flex items-center gap-4">
                    <button @click="closePreview"
                        class="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all font-medium border border-white/10">
                        Close
                    </button>
                    <a v-if="store.previewImage" :href="getImageUrl(store.previewImage.name)" download
                        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 transition-all font-medium flex items-center gap-2"
                        @click.stop>
                        <i class="ph ph-download-simple"></i> Download
                    </a>
                </div>
            </div>
            <button @click="closePreview"
                class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-20">
                <i class="ph ph-x text-3xl"></i>
            </button>
        </div>
    `
};

export const MoveModal = {
    setup() {
        return { store, moveSelected };
    },
    template: `
        <div v-if="store.showMoveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="store.showMoveModal = false"></div>
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in">
                <div class="p-4 md:p-6 border-b border-gray-100">
                    <h3 class="text-xl font-bold text-gray-900">移动图片</h3>
                    <p class="text-sm text-gray-500 mt-1">为 {{ store.selectedImages.length }} 张图片选择目标文件夹</p>
                </div>
                <div class="p-4 md:p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">目标文件夹</label>
                        <select v-model="store.moveTargetDir"
                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                            <option value="/">根目录 /</option>
                            <option v-for="dir in store.directories" :key="dir" :value="dir">{{ dir }}</option>
                        </select>
                    </div>
                </div>
                <div class="p-4 md:p-6 bg-gray-50 flex items-center justify-end gap-3">
                    <button @click="store.showMoveModal = false"
                        class="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors">取消</button>
                    <button @click="moveSelected" :disabled="store.movingImages"
                        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-70">
                        <i v-if="store.movingImages" class="ph ph-spinner animate-spin"></i>
                        <span>移动图片</span>
                    </button>
                </div>
            </div>
        </div>
    `
};

export const DeleteModal = {
    setup() {
        const confirmDelete = async () => {
            store.deletingImages = true;
            try {
                if (store.deleteTarget === 'selected') {
                    await deleteSelected(true); // true = skip confirm
                } else {
                    await deleteImage(store.deleteTarget, true); // true = skip confirm
                }
                store.showDeleteModal = false;
                store.deleteTarget = null;
            } finally {
                store.deletingImages = false;
            }
        };

        return { store, confirmDelete };
    },
    template: `
        <div v-if="store.showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="store.showDeleteModal = false"></div>
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden">
                <div class="p-6 text-center">
                    <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="ph ph-trash text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">确认删除？</h3>
                    <p class="text-gray-500 text-sm mb-6">
                        {{ store.deleteTarget === 'selected' 
                            ? \`确定要删除选中的 \${store.selectedImages.length} 张图片吗？\`
                            : '确定要删除这张图片吗？此操作无法撤销。' 
                        }}
                    </p>
                    <div class="flex gap-3">
                        <button @click="store.showDeleteModal = false" 
                            class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                            取消
                        </button>
                        <button @click="confirmDelete" :disabled="store.deletingImages"
                            class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2">
                            <i v-if="store.deletingImages" class="ph ph-spinner animate-spin"></i>
                            <span>{{ store.deletingImages ? '删除中...' : '确认删除' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};
