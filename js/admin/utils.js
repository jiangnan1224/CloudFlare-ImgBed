export const getImageUrl = (name) => {
    return `/file/${name}`;
};

export const getImageName = (img) => {
    return img.metadata?.FileName || img.name.split('/').pop();
};

export const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString();
};

export const formatSize = (img) => {
    if (!img) return '未知';

    // Try to get size from metadata first
    const metadata = img.metadata || {};

    // If FileSize exists and already has a unit, return it
    if (metadata.FileSize && typeof metadata.FileSize === 'string' && /[a-zA-Z]/.test(metadata.FileSize)) {
        // Ensure no line break between number and unit
        return metadata.FileSize.replace(/\s+/g, '\u00A0');
    }

    // Try to get numeric size value from various possible properties
    let sizeInBytes = 0;
    if (metadata.Size) {
        sizeInBytes = parseFloat(metadata.Size);
    } else if (metadata.FileSize) {
        sizeInBytes = parseFloat(metadata.FileSize);
    } else if (img.size) {
        sizeInBytes = parseFloat(img.size);
    }

    if (!sizeInBytes || sizeInBytes === 0) return '未知';

    // Convert to MB and use non-breaking space
    const sizeInMB = sizeInBytes.toFixed(2);
    return sizeInMB + 'MB';
};

export const getLink = (name, type) => {
    const url = `${window.location.origin}/file/${name}`;
    switch (type) {
        case 'markdown': return `![${name}](${url})`;
        case 'html': return `<img src="${url}" alt="${name}" />`;
        case 'bbcode': return `[img]${url}[/img]`;
        default: return url;
    }
};

export const copyLink = async (name, showToast, type = 'url') => {
    const text = getLink(name, type);
    try {
        await navigator.clipboard.writeText(text);
        showToast('链接已复制到剪贴板');
    } catch (e) {
        showToast('复制链接失败', 'error');
    }
};
