import { store } from '../store.js';
import { fetchImages, deleteImage, deleteSelected, moveSelected } from '../api.js';
import { getImageUrl, getImageName, formatDate, formatSize, copyLink } from '../utils.js';

export default {
    setup() {
        const toggleSelect = (img) => {
            const index = store.selectedImages.findIndex(i => i.name === img.name);
            if (index === -1) {
                store.selectedImages.push(img);
            } else {
                store.selectedImages.splice(index, 1);
            }
        };

        const selectAll = () => {
            if (store.selectedImages.length === store.images.length) {
                store.selectedImages = [];
            } else {
                store.selectedImages = [...store.images];
            }
        };

        const loadPage = (page) => {
            store.currentPage = page;
            fetchImages();
        };

        const openPreview = (img) => {
            store.previewImage = img;
            store.showPreview = true;
        };

        const handleImageError = (e) => {
            e.target.src = 'https://via.placeholder.com/150?text=Error';
        };

        const downloadSelected = () => {
            store.selectedImages.forEach(img => {
                const link = document.createElement('a');
                link.href = getImageUrl(img.name);
                link.download = getImageName(img);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        };

        const confirmDelete = (target) => {
            store.deleteTarget = target;
            store.showDeleteModal = true;
        };

        return {
            store,
            fetchImages,
            deleteImage,
            deleteSelected,
            moveSelected,
            getImageUrl,
            getImageName,
            formatDate,
            formatSize,
            copyLink,
            toggleSelect,
            selectAll,
            loadPage,
            openPreview,
            handleImageError,
            downloadSelected,
            confirmDelete
        };
    },
    template: `
        <div class="space-y-6 max-w-7xl mx-auto">
            <!-- Toolbar -->
            <div class="px-4 md:px-6 pt-4 pb-2 z-20">
                <div class="glass-panel px-3 md:px-4 py-3 rounded-2xl flex flex-wrap gap-3 md:gap-4 items-center justify-between z-10 shadow-sm transition-all duration-300"
                    :class="store.selectedImages.length > 0 ? 'bg-blue-50/90 border-blue-200' : ''">

                    <!-- Bulk Actions Mode -->
                    <div v-if="store.selectedImages.length > 0"
                        class="flex items-center gap-4 flex-1 w-full animate-fade-in h-[42px]">
                        <div class="flex items-center gap-3">
                            <button @click="store.selectedImages = []"
                                class="p-1.5 hover:bg-white/50 rounded-lg text-gray-500 transition-colors">
                                <i class="ph ph-x text-lg"></i>
                            </button>
                            <span class="font-bold text-blue-600 text-sm">{{ store.selectedImages.length }} 已选择</span>
                        </div>
                        <div class="h-5 w-px bg-blue-200 mx-2"></div>
                        <div class="flex items-center gap-2">
                            <button @click="selectAll"
                                class="px-3 py-1.5 bg-white/60 hover:bg-white text-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                <i
                                    :class="['ph', store.selectedImages.length === store.images.length ? 'ph-check-square-offset' : 'ph-square']"></i>
                                全选
                            </button>
                        </div>
                        <div class="flex-1"></div>
                        <div class="flex items-center gap-2">
                            <button @click="store.showMoveModal = true"
                                class="px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 text-sm">
                                <i class="ph ph-folder-notch-plus text-lg"></i> 移动
                            </button>
                            <button @click="downloadSelected"
                                class="px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-50 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 text-sm">
                                <i class="ph ph-download-simple text-lg"></i> 下载
                            </button>
                            <button @click="confirmDelete('selected')"
                                class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition-all flex items-center gap-2 text-sm">
                                <i class="ph ph-trash text-lg"></i> 删除
                            </button>
                        </div>
                    </div>

                    <!-- Search Mode -->
                    <div v-else class="flex items-center gap-3 flex-1 min-w-[200px] animate-fade-in h-[42px]">
                        <div class="relative flex-1 max-w-md group">
                            <input v-model="store.searchQuery" @keyup.enter="fetchImages(true)" type="text"
                                placeholder="搜索文件..."
                                class="w-full pl-10 pr-4 py-2 rounded-xl bg-white/60 border border-gray-200/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm">
                            <i
                                class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors text-lg"></i>
                        </div>
                        <select v-model="store.currentDir" @change="fetchImages(true)"
                            class="px-3 py-2 rounded-xl border border-gray-200/60 bg-white/60 focus:bg-white focus:border-blue-500 outline-none cursor-pointer hover:bg-white transition-colors text-sm max-w-[150px] truncate">
                            <option value="/">根目录 /</option>
                            <option v-for="dir in store.directories" :key="dir" :value="dir">{{ dir }}</option>
                        </select>
                        <div
                            class="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200/30 ml-auto">
                            <button @click="fetchImages(true)"
                                class="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-lg transition-all shadow-sm hover:shadow"
                                title="Refresh">
                                <i class="ph ph-arrows-clockwise text-lg"></i>
                            </button>
                            <div class="h-4 w-px bg-gray-300/50 mx-1"></div>
                            <button @click="store.viewMode = 'grid'" class="p-1.5 rounded-lg transition-all"
                                :class="store.viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-white/50'">
                                <i class="ph ph-squares-four text-lg"></i>
                            </button>
                            <button @click="store.viewMode = 'list'" class="p-1.5 rounded-lg transition-all"
                                :class="store.viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-white/50'">
                                <i class="ph ph-list-dashes text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="store.loadingImages" class="flex flex-col items-center justify-center py-24 text-gray-400">
                <i class="ph ph-spinner animate-spin text-5xl mb-4 text-primary"></i>
                <p class="font-medium animate-pulse">加载中...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="store.images.length === 0"
                class="flex flex-col items-center justify-center py-24 text-gray-400 glass-panel rounded-3xl border-dashed border-2 border-gray-300/50">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <i class="ph ph-image text-5xl text-gray-300"></i>
                </div>
                <p class="text-xl font-bold text-gray-600">没有找到图片</p>
                <p class="text-sm mt-2">尝试上传一些文件或更改目录。</p>
            </div>

            <!-- Grid View -->
            <div v-else-if="store.viewMode === 'grid'"
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                <div v-for="img in store.images" :key="img.name"
                    class="group relative bg-white/40 backdrop-blur-sm rounded-2xl border border-white/40 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    :class="{'ring-2 ring-blue-500': store.selectedImages.includes(img)}"
                    @click="openPreview(img)">

                    <!-- Selection Checkbox -->
                    <div class="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        :class="{'opacity-100': store.selectedImages.includes(img)}" @click.stop>
                        <input type="checkbox" :checked="store.selectedImages.includes(img)"
                            @change="toggleSelect(img)"
                            class="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm">
                    </div>

                    <!-- Image Aspect Ratio Container -->
                    <div class="aspect-square overflow-hidden bg-gray-100 relative">
                        <img :src="getImageUrl(img.name)" :alt="getImageName(img)" loading="lazy"
                            @error="handleImageError"
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    </div>
                    <!-- Info -->
                    <div class="p-3 bg-white/80 backdrop-blur-md">
                        <div class="mb-2">
                            <p class="text-sm font-semibold text-gray-800 truncate" :title="getImageName(img)">
                                {{ getImageName(img) }}</p>
                        </div>
                        
                        <div class="flex items-center justify-between gap-2 pt-2 border-t border-gray-100" @click.stop>
                            <span class="text-xs text-gray-500 font-medium">
                                {{ formatSize(img) }}
                            </span>
                            <div class="flex items-center gap-1">
                                <button @click="copyLink(img.name, store.showToast, 'url')" 
                                    class="p-1 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-md transition-colors"
                                    title="Copy URL">
                                    <i class="ph ph-link text-lg"></i>
                                </button>
                                <button @click="copyLink(img.name, store.showToast, 'markdown')" 
                                    class="p-1 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-md transition-colors"
                                    title="Copy Markdown">
                                    <i class="ph ph-markdown-logo text-lg"></i>
                                </button>
                                <button @click="confirmDelete(img)" 
                                    class="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete">
                                    <i class="ph ph-trash text-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- List View -->
            <div v-else
                class="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/40 overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                        <thead>
                            <tr
                                class="border-b border-gray-200/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th class="px-4 md:px-6 py-4 w-12">
                                    <input type="checkbox"
                                        :checked="store.selectedImages.length === store.images.length && store.images.length > 0"
                                        @change="selectAll"
                                        class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
                                </th>
                                <th class="px-4 md:px-6 py-4">图片</th>
                                <th class="px-4 md:px-6 py-4">名称</th>
                                <th class="px-4 md:px-6 py-4 hidden md:table-cell">大小</th>
                                <th class="px-4 md:px-6 py-4 hidden lg:table-cell">上传时间</th>
                                <th class="px-4 md:px-6 py-4 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100/50">
                            <tr v-for="img in store.images" :key="img.name"
                                class="hover:bg-white/50 transition-colors cursor-pointer"
                                :class="{'bg-blue-50/50': store.selectedImages.includes(img)}"
                                @click="openPreview(img)">
                                <td class="px-4 md:px-6 py-4" @click.stop>
                                    <input type="checkbox" :checked="store.selectedImages.includes(img)"
                                        @change="toggleSelect(img)"
                                        class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
                                </td>
                                <td class="px-4 md:px-6 py-4">
                                    <img :src="getImageUrl(img.name)" :alt="getImageName(img)"
                                        class="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-white shadow-sm"
                                        loading="lazy">
                                </td>
                                <td class="px-4 md:px-6 py-4 font-medium text-gray-700 truncate max-w-[150px] md:max-w-[200px]"
                                    :title="getImageName(img)">
                                    {{ getImageName(img) }}
                                </td>
                                <td
                                    class="px-4 md:px-6 py-4 text-gray-500 text-sm whitespace-nowrap hidden md:table-cell">
                                    {{ formatSize(img)
                                    }}</td>
                                <td class="px-4 md:px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">{{
                                    formatDate(img.metadata?.TimeStamp) }}</td>
                                <td class="px-4 md:px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click.stop="copyLink(img.name, store.showToast, 'url')"
                                            class="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Copy URL">
                                            <i class="ph ph-link text-lg"></i>
                                        </button>
                                        <button @click.stop="copyLink(img.name, store.showToast, 'markdown')"
                                            class="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Copy Markdown">
                                            <i class="ph ph-markdown-logo text-lg"></i>
                                        </button>
                                        <button @click.stop="confirmDelete(img)"
                                            class="p-1.5 text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete">
                                            <i class="ph ph-trash text-lg"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="store.images.length > 0"
                class="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 pb-8">
                <div class="flex items-center gap-4">
                    <button @click="loadPage(store.currentPage - 1)" :disabled="store.currentPage === 1"
                        class="px-5 py-2.5 rounded-xl glass-panel hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-medium text-gray-700">
                        <i class="ph ph-caret-left font-bold"></i> Previous
                    </button>
                    <span
                        class="text-gray-600 font-semibold bg-white/50 px-4 py-2 rounded-lg border border-white/50 whitespace-nowrap">
                        Page {{ store.currentPage }} <span v-if="store.totalImages">/ {{ Math.ceil(store.totalImages /
                            store.pageSize) }}</span>
                    </span>
                    <button @click="loadPage(store.currentPage + 1)" :disabled="store.images.length < store.pageSize"
                        class="px-5 py-2.5 rounded-xl glass-panel hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-medium text-gray-700">
                        Next <i class="ph ph-caret-right font-bold"></i>
                    </button>
                </div>
                <div v-if="store.totalImages"
                    class="text-sm text-gray-500 font-medium bg-white/30 px-3 py-1 rounded-full">
                    共 {{ store.totalImages }} 张图片
                </div>
            </div>
        </div>
    `
};
