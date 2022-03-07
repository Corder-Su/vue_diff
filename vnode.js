/**
 * 根据输入参数，返回一个虚拟节点对象
 * 
 * @param {string} tag 标签
 * @param {object} data 属性、样式
 * @param {Array} children 子节点对象
 * @param {string|number} text 文本
 * @param {object} elm 真实DOM节点，undefined意味着还没有上树
 * @returns {object}
 * 
 */
function vnode(tag, data, children, text, elm) {
    const key = data.key;
    return { tag, data, children, text, elm, key}
}

export default vnode;