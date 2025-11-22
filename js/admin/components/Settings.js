import { store } from '../store.js';
import { saveSettings } from '../api.js';

export default {
    setup() {
        const getSettingsLabel = (id) => {
            const settingsItem = store.menuItems.find(i => i.id === 'settings');
            return settingsItem.children.find(c => c.id === id)?.label || 'Settings';
        };

        const addChannel = (type) => {
            if (type === 'telegram') {
                store.settings.upload.telegram.channels.push({ botToken: '', chatId: '', enabled: true });
            } else if (type === 'cfr2') {
                store.settings.upload.cfr2.channels.push({ publicUrl: '', enabled: true });
            } else if (type === 's3') {
                store.settings.upload.s3.channels.push({ endpoint: '', bucketName: '', accessKeyId: '', secretAccessKey: '', region: 'auto', enabled: true, pathStyle: false });
            }
        };

        const removeChannel = (type, index) => {
            if (type === 'telegram') {
                store.settings.upload.telegram.channels.splice(index, 1);
            } else if (type === 'cfr2') {
                store.settings.upload.cfr2.channels.splice(index, 1);
            } else if (type === 's3') {
                store.settings.upload.s3.channels.splice(index, 1);
            }
        };

        return { store, saveSettings, getSettingsLabel, addChannel, removeChannel };
    },
    template: `
        <div class="max-w-5xl mx-auto">
            <div class="glass-panel rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                <!-- Settings Content -->
                <div class="flex-1 p-4 md:p-8 bg-white/40">
                    <div v-if="store.loadingSettings" class="flex justify-center py-20">
                        <i class="ph ph-spinner animate-spin text-4xl text-primary"></i>
                    </div>

                    <div v-else class="space-y-8 animate-fade-in">
                        <div
                            class="flex items-center justify-between border-b border-gray-200/50 pb-6 mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">{{
                                getSettingsLabel(store.currentSettingsTab) }}</h2>
                            <button @click="saveSettings" :disabled="store.savingSettings"
                                class="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-70 transform active:scale-95">
                                <i v-if="store.savingSettings" class="ph ph-spinner animate-spin"></i>
                                <i v-else class="ph ph-floppy-disk"></i>
                                <span>保存更改</span>
                            </button>
                        </div>

                        <!-- Security Settings -->
                        <div v-if="store.currentSettingsTab === 'security'" class="space-y-8">
                            <section>
                                <h3
                                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <div class="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><i
                                            class="ph ph-lock-key"></i></div>
                                    身份验证
                                </h3>
                                <div
                                    class="grid gap-5 p-4 md:p-6 bg-white/60 rounded-2xl border border-gray-100 shadow-sm">
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700 mb-1.5">用户认证码</label>
                                        <input v-model="store.settings.security.auth.user.authCode" type="text"
                                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 mb-1.5">管理员用户名</label>
                                            <input v-model="store.settings.security.auth.admin.adminUsername"
                                                type="text"
                                                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 mb-1.5">管理员密码</label>
                                            <input v-model="store.settings.security.auth.admin.adminPassword"
                                                type="password"
                                                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3
                                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <div class="p-1.5 bg-green-100 text-green-600 rounded-lg"><i
                                            class="ph ph-shield-check"></i></div>
                                    访问控制
                                </h3>
                                <div
                                    class="grid gap-5 p-4 md:p-6 bg-white/60 rounded-2xl border border-gray-100 shadow-sm">
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700 mb-1.5">允许的域名</label>
                                        <input v-model="store.settings.security.access.allowedDomains" type="text"
                                            placeholder="example.com, test.com"
                                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                        <p class="text-xs text-gray-500 mt-1.5 ml-1">逗号分隔的域名</p>
                                    </div>
                                    <div
                                        class="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/50 w-fit">
                                        <div
                                            class="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                                            <input v-model="store.settings.security.access.whiteListMode"
                                                type="checkbox" name="toggle" id="whitelist"
                                                class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
                                                :class="store.settings.security.access.whiteListMode ? 'right-1 border-primary' : 'left-1 border-gray-300'" />
                                            <label for="whitelist"
                                                class="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300"
                                                :class="store.settings.security.access.whiteListMode ? 'bg-primary' : 'bg-gray-300'"></label>
                                        </div>
                                        <label for="whitelist"
                                            class="text-sm font-medium text-gray-700 cursor-pointer">启用白名单模式</label>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <!-- Upload Settings -->
                        <div v-if="store.currentSettingsTab === 'upload'" class="space-y-8">
                            <!-- Telegram -->
                            <section>
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <div class="p-1.5 bg-blue-100 text-blue-500 rounded-lg"><i
                                                class="ph ph-telegram-logo"></i></div>
                                        Telegram 频道
                                    </h3>
                                    <button @click="addChannel('telegram')"
                                        class="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors">
                                        <i class="ph ph-plus-circle"></i> 添加频道
                                    </button>
                                </div>
                                <div class="space-y-4">
                                    <div v-for="(channel, idx) in store.settings.upload.telegram.channels"
                                        :key="idx"
                                        class="p-4 md:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow">
                                        <button @click="removeChannel('telegram', idx)"
                                            class="absolute top-3 right-3 text-gray-400 hover:text-danger hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                            title="移除">
                                            <i class="ph ph-trash"></i>
                                        </button>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label
                                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">机器人
                                                    Token</label>
                                                <input v-model="channel.botToken" type="text"
                                                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                                            </div>
                                            <div>
                                                <label
                                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">聊天
                                                    ID</label>
                                                <input v-model="channel.chatId" type="text"
                                                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                                            </div>
                                        </div>
                                        <div class="mt-4 flex items-center gap-2">
                                            <input v-model="channel.enabled" type="checkbox"
                                                class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary">
                                            <span class="text-sm font-medium text-gray-700">启用</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- R2 -->
                            <section>
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <div class="p-1.5 bg-orange-100 text-orange-500 rounded-lg"><i
                                                class="ph ph-cloud"></i></div>
                                        Cloudflare R2
                                    </h3>
                                    <button @click="addChannel('cfr2')"
                                        class="text-sm bg-orange-50 text-orange-600 hover:bg-orange-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors">
                                        <i class="ph ph-plus-circle"></i> 添加频道
                                    </button>
                                </div>
                                <div class="space-y-4">
                                    <div v-for="(channel, idx) in store.settings.upload.cfr2.channels" :key="idx"
                                        class="p-4 md:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow">
                                        <button @click="removeChannel('cfr2', idx)"
                                            class="absolute top-3 right-3 text-gray-400 hover:text-danger hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                            <i class="ph ph-trash"></i>
                                        </button>
                                        <div>
                                            <label
                                                class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">公共
                                                URL</label>
                                            <input v-model="channel.publicUrl" type="text"
                                                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none">
                                        </div>
                                        <div class="mt-4 flex items-center gap-2">
                                            <input v-model="channel.enabled" type="checkbox"
                                                class="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500">
                                            <span class="text-sm font-medium text-gray-700">启用</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- S3 -->
                            <section>
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <div class="p-1.5 bg-green-100 text-green-600 rounded-lg"><i
                                                class="ph ph-hard-drives"></i></div>
                                        S3 存储
                                    </h3>
                                    <button @click="addChannel('s3')"
                                        class="text-sm bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors">
                                        <i class="ph ph-plus-circle"></i> 添加频道
                                    </button>
                                </div>
                                <div class="space-y-4">
                                    <div v-for="(channel, idx) in store.settings.upload.s3.channels" :key="idx"
                                        class="p-4 md:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow">
                                        <button @click="removeChannel('s3', idx)"
                                            class="absolute top-3 right-3 text-gray-400 hover:text-danger hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                            <i class="ph ph-trash"></i>
                                        </button>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label
                                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">端点</label>
                                                <input v-model="channel.endpoint" type="text"
                                                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none">
                                            </div>
                                            <div>
                                                <label
                                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">存储桶名称</label>
                                                <input v-model="channel.bucketName" type="text"
                                                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none">
                                            </div>
                                            <div>
                                                <label
                                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">访问密钥
                                                    ID</label>
                                                <input v-model="channel.accessKeyId" type="text"
                                                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none">
                                            </div>
                                            <div>
                                                <label
                                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">秘密访问密钥</label>
                                                <input v-model="channel.secretAccessKey" type="password"
                                                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none">
                                            </div>
                                            <div>
                                                <label
                                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">区域</label>
                                                <input v-model="channel.region" type="text"
                                                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                                    placeholder="自动">
                                            </div>
                                        </div>
                                        <div class="mt-4 flex items-center gap-6">
                                            <div class="flex items-center gap-2">
                                                <input v-model="channel.enabled" type="checkbox"
                                                    class="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500">
                                                <span class="text-sm font-medium text-gray-700">启用</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <input v-model="channel.pathStyle" type="checkbox"
                                                    class="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500">
                                                <span
                                                    class="text-sm font-medium text-gray-700">强制路径样式</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <!-- Page Settings -->
                        <div v-if="store.currentSettingsTab === 'page'" class="space-y-6">
                            <div v-for="item in store.settings.page.config" :key="item.id"
                                class="p-4 md:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <label class="block text-sm font-bold text-gray-700 mb-2">{{ item.label
                                    }}</label>

                                <!-- Text Input -->
                                <input v-if="!item.type || item.type === 'text'" v-model="item.value"
                                    type="text" :placeholder="item.placeholder"
                                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">

                                <!-- Select -->
                                <select v-else-if="item.type === 'select'" v-model="item.value"
                                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                    <option v-for="opt in item.options" :key="opt.value" :value="opt.value">
                                        {{ opt.label }}</option>
                                </select>

                                <!-- Boolean -->
                                <div v-else-if="item.type === 'boolean'"
                                    class="flex items-center gap-2 mt-2">
                                    <input v-model="item.value" type="checkbox"
                                        class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary">
                                    <span class="text-sm font-medium text-gray-700">启用</span>
                                </div>

                                <p v-if="item.tooltip"
                                    class="text-xs text-gray-500 mt-2 flex items-center gap-1"
                                    v-html="item.tooltip"></p>
                            </div>
                        </div>

                        <!-- Others Settings -->
                        <div v-if="store.currentSettingsTab === 'others'" class="space-y-6">
                            <section
                                class="p-4 md:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <h3 class="text-base font-bold text-gray-900 mb-4">遥测</h3>
                                <div class="flex items-center gap-3">
                                    <input v-model="store.settings.others.telemetry.enabled" type="checkbox"
                                        class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary">
                                    <label class="text-sm font-medium text-gray-700">启用遥测</label>
                                </div>
                            </section>

                            <section
                                class="p-4 md:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <h3 class="text-base font-bold text-gray-900 mb-4">随机图片 API</h3>
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3">
                                        <input v-model="store.settings.others.randomImageAPI.enabled"
                                            type="checkbox"
                                            class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary">
                                        <label class="text-sm font-medium text-gray-700">启用 API</label>
                                    </div>
                                    <div>
                                        <label
                                            class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">允许的目录</label>
                                        <input v-model="store.settings.others.randomImageAPI.allowedDir"
                                            type="text"
                                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                    </div>
                                </div>
                            </section>

                            <section
                                class="p-4 md:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <h3 class="text-base font-bold text-gray-900 mb-4">WebDAV</h3>
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3">
                                        <input v-model="store.settings.others.webDAV.enabled" type="checkbox"
                                            class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary">
                                        <label class="text-sm font-medium text-gray-700">启用 WebDAV</label>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label
                                                class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">用户名</label>
                                            <input v-model="store.settings.others.webDAV.username" type="text"
                                                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                        </div>
                                        <div>
                                            <label
                                                class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">密码</label>
                                            <input v-model="store.settings.others.webDAV.password" type="password"
                                                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `
};
