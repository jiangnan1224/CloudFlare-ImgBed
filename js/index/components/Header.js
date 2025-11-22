export default {
    template: `
        <nav class="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-gray-200/50">
            <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" class="w-8 h-8 rounded-lg">
                    <span class="font-semibold text-lg tracking-tight">Sanyue ImgHub</span>
                </div>
                <div class="flex items-center gap-4">
                    <a href="/admin.html"
                        class="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                        Admin
                        <i class="ph ph-arrow-right"></i>
                    </a>
                </div>
            </div>
        </nav>
    `
};
