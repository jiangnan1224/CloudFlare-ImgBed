export default {
    setup() {
        return {
            year: new Date().getFullYear()
        };
    },
    template: `
        <footer class="py-8 text-center text-sm text-gray-500 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
            <div class="max-w-7xl mx-auto px-6">
                <p>&copy; {{ year }} Sanyue ImgHub. All rights reserved.</p>
            </div>
        </footer>
    `
};
