import { showToast } from './store.js';

export const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getLink = (item, type) => {
    if (!item.result) return '';
    const url = item.result.startsWith('http') ? item.result : window.location.origin + item.result;

    switch (type) {
        case 'markdown': return `![${item.name}](${url})`;
        case 'html': return `<img src="${url}" alt="${item.name}" />`;
        case 'bbcode': return `[img]${url}[/img]`;
        default: return url;
    }
};

export const copyLink = async (item, type) => {
    const text = getLink(item, type);
    try {
        await navigator.clipboard.writeText(text);
        item.copied = type;
        setTimeout(() => item.copied = null, 2000);
        showToast('链接已复制到剪贴板');
    } catch (e) {
        showToast('复制链接失败', 'error');
    }
};
