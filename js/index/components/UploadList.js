import { store } from '../store.js';
import { formatSize, getLink, copyLink } from '../utils.js';

export default {
    setup() {
        const removeFile = (id) => {
            store.uploads = store.uploads.filter(u => u.id !== id);
        };

        return { store, formatSize, getLink, copyLink, removeFile };
    },
    template: `
        <transition-group name="list" tag="div" class="space-y-4" v-if="store.uploads.length > 0">
            <div v-for="file in store.uploads" :key="file.id"
                class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-start overflow-hidden">
                <!-- Preview -->
                <div
                    class="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
                    <img v-if="file.preview" :src="file.preview" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                        <i class="ph ph-image text-2xl"></i>
                    </div>
                    <!-- Status Overlay -->
                    <div v-if="file.status === 'uploading'"
                        class="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                        <i class="ph ph-spinner animate-spin text-white text-2xl"></i>
                    </div>
                    <div v-else-if="file.status === 'error'"
                        class="absolute inset-0 bg-red-500/10 flex items-center justify-center backdrop-blur-[1px]">
                        <i class="ph ph-warning-circle text-red-500 text-2xl"></i>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0 py-1">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <h4 class="font-medium text-gray-900 truncate pr-4" :title="file.name">{{ file.name
                                }}</h4>
                            <p class="text-xs text-gray-500">{{ formatSize(file.size) }}</p>
                        </div>
                        <button @click="removeFile(file.id)"
                            class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="ph ph-x"></i>
                        </button>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="file.status === 'uploading'"
                        class="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div class="bg-primary h-full rounded-full transition-all duration-300"
                            :style="{ width: file.progress + '%' }"
                            :class="{'animate-pulse': file.progress === 100}"></div>
                    </div>

                    <!-- Error Message -->
                    <div v-else-if="file.status === 'error'"
                        class="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <i class="ph ph-warning"></i> {{ file.error || '上传失败' }}
                    </div>

                    <!-- Success Actions -->
                    <div v-else-if="file.status === 'success'" class="mt-2 space-y-3">
                        <div class="flex flex-wrap gap-2">
                            <button v-for="type in ['url', 'markdown', 'html', 'bbcode']" :key="type"
                                @click="copyLink(file, type)"
                                class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 flex items-center gap-1.5"
                                :class="file.copied === type ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'">
                                <i class="ph" :class="file.copied === type ? 'ph-check' : 'ph-copy'"></i>
                                {{ type.toUpperCase() }}
                            </button>
                        </div>
                        <div
                            class="bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono text-gray-600 break-all select-all cursor-text border border-gray-100">
                            {{ getLink(file, 'url') }}
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>
    `
};
