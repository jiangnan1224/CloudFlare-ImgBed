import { store, showToast } from '../store.js';
import { uploadFile } from '../api.js';

const { reactive, ref } = Vue;

export default {
    setup() {
        const fileInput = ref(null);

        const triggerFileInput = () => {
            if (store.authRequired && !store.isAuthenticated) return;
            fileInput.value.click();
        };

        const handleFileSelect = (e) => {
            const files = Array.from(e.target.files);
            processFiles(files);
            e.target.value = ''; // Reset input
        };

        const handleDrop = (e) => {
            if (store.authRequired && !store.isAuthenticated) return;
            store.isDragging = false;
            const files = Array.from(e.dataTransfer.files);
            processFiles(files);
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

        return { store, fileInput, triggerFileInput, handleFileSelect, handleDrop };
    },
    template: `
        <div class="relative group cursor-pointer" @dragover.prevent="store.isDragging = true"
            @dragleave.prevent="store.isDragging = false" @drop.prevent="handleDrop" @click="triggerFileInput">
            <input type="file" ref="fileInput" class="hidden" multiple accept="image/*"
                @change="handleFileSelect">

            <div class="upload-zone rounded-3xl text-center transition-all duration-500 bg-white shadow-apple hover:shadow-apple-hover overflow-hidden"
                :class="[
                    store.isDragging ? 'dragging' : '',
                    store.uploads.length > 0 ? 'p-6 md:p-8' : 'p-12 md:p-20'
                ]">
                <div class="space-y-6 pointer-events-none transition-all duration-500"
                    :class="store.uploads.length > 0 ? 'flex items-center gap-6 space-y-0 text-left justify-center' : ''">

                    <div class="bg-blue-50 text-primary rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                        :class="[
                                store.uploads.length > 0 ? 'w-12 h-12 mb-0' : 'w-20 h-20 mx-auto mb-6'
                            ]">
                        <i class="ph ph-cloud-arrow-up transition-all duration-500"
                            :class="store.uploads.length > 0 ? 'text-2xl' : 'text-4xl'"></i>
                    </div>

                    <div class="space-y-2 transition-all duration-500"
                        :class="store.uploads.length > 0 ? 'space-y-1' : ''">
                        <h3 class="font-semibold text-gray-900 transition-all duration-500"
                            :class="store.uploads.length > 0 ? 'text-lg' : 'text-xl'">
                            {{ store.uploads.length > 0 ? '添加更多图片' : '将图片拖放到这里' }}
                        </h3>
                        <p class="text-gray-500 transition-all duration-500"
                            :class="store.uploads.length > 0 ? 'text-sm' : ''">
                            {{ store.uploads.length > 0 ? '或点击浏览' : '或点击浏览' }}
                        </p>
                    </div>

                    <div v-if="store.uploads.length === 0"
                        class="flex items-center justify-center gap-4 text-sm text-gray-400 animate-fade-in">
                        <span class="flex items-center gap-1"><i class="ph ph-image"></i>
                            PNG、JPG、GIF、WEBP</span>
                        <span class="flex items-center gap-1"><i class="ph ph-file-size"></i> 最大 20MB</span>
                    </div>
                </div>
            </div>
        </div>
    `
};
