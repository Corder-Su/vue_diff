/**
 * 创建真实DOM节点， 根据vnode
 * 返回孤儿节点，不插入
 * @param {object} vnode
 * @returns {object}
 */
export default function createElement(vnode){
    let domNode = document.createElement(vnode.tag);

    if( //  有文本节点， 无子节点
        vnode.text !== '' && vnode.text !== undefined &&
        (vnode.children === undefined || vnode.children.length === 0)
    ){
        domNode.innerText = vnode.text;
    }else if(vnode.children instanceof Array && vnode.children.length > 0){ // 有子节点，递归
        for(let child of vnode.children){
            let childDom = createElement(child);
            domNode.appendChild(childDom)
        }
    }
    vnode.elm = domNode;
    return domNode;
}