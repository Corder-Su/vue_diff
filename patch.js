import vnode from "./vnode.js";
import createElement from "./createElem.js";

export default function(oldVnode, newVnode){
    // 判断 oldVnode 真实DOM 还是虚拟DOM
    if(oldVnode.tag === '' || oldVnode.tag === undefined){
        oldVnode = vnode(
            oldVnode.tagName.toLowerCase(),
            {},
            [],
            undefined,
            oldVnode
        )
    }

    // 判断 oldVnode 和 newVNode 是否为同一个节点：
    if(oldVnode.tag === newVnode.tag && newVnode.key && oldVnode.key && oldVnode.key === newVnode.key  ){
        console.log('是同一个节点，精细比较')
        patchVnode(oldVnode, newVnode)
    }else{
        // 删除旧节点，添加新节点
        console.log('不是同一个节点，暴力删除')
        let newVnodeElm = createElement(newVnode);
        let oldVnodeElm = oldVnode.elm;
        if(newVnodeElm){
            oldVnodeElm.parentNode.insertBefore(newVnodeElm, oldVnodeElm);
        }
        oldVnodeElm.parentNode.removeChild(oldVnodeElm)
    }
}



function patchVnode(oldVnode, newVnode) {
    if(oldVnode === newVnode)return;


    if( //  有文本节点， 无子节点
        newVnode.text !== undefined &&
        (newVnode.children === undefined || newVnode.children.length === 0)
    ){
        if(oldVnode.text !== newVnode.text){
            oldVnode.elm.innerText = newVnode.text;
        }
    } else { // 有子节点
        if( oldVnode.children && oldVnode.children.length > 0){
            // 旧节点有子节点
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)

        } else {
            // 旧节点没有子节点
            oldVnode.elm.innerText = '';
            for(let child of newVnode.children){
                let childDom = createElement(child);
                oldVnode.elm.appendChild(childDom);
            }
        }
    }
}


function updateChildren(parentElm, oldChildren, newChildren){
    console.log('updateChildren');

    let oldStartIndex = 0, newStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1, newEndIndex = newChildren.length - 1;

    let keyMap = null;

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if(oldChildren[oldStartIndex] === null || oldChildren[oldStartIndex] === undefined){
            oldStartIndex ++;
        } else if(oldChildren[oldEndIndex] === null || oldChildren[oldEndIndex] === undefined){
            oldEndIndex--;
        } else if(newChildren[newStartIndex] === null || newChildren[newStartIndex] === undefined){
            newStartIndex++;
        } else if(newChildren[newEndIndex] === null || newChildren[newEndIndex] === undefined){
            newEndIndex++;
        } else if(checkSameNode(oldChildren[oldStartIndex], newChildren[newStartIndex])){
            console.log('旧前与新前命中');
            patchVnode(oldChildren[oldStartIndex], newChildren[newStartIndex])
            oldStartIndex++;
            newStartIndex++;
        } else if(checkSameNode(oldChildren[oldEndIndex], newChildren[newEndIndex])){
            console.log('旧后与新后命中');
            patchVnode(oldChildren[oldEndIndex], newChildren[newEndIndex])
            oldEndIndex--;
            newEndIndex --;
        } else if(checkSameNode(oldChildren[oldEndIndex], newChildren[newEndIndex])){
            console.log('旧前与新后命中');
            patchVnode(oldChildren[oldStartIndex], newChildren[newEndIndex])
            parentElm.insertBefore(oldChildren[oldStartIndex].elm, oldChildren[oldEndIndex].elm.nextSibling)
            oldStartIndex++;
            newEndIndex --;
        } else if(checkSameNode(oldChildren[oldEndIndex], newChildren[newEndIndex])){
            console.log('旧后与新前命中');
            patchVnode(oldChildren[oldEndIndex], newChildren[newStartIndex])
            parentElm.insertBefore(oldChildren[oldEndIndex].elm, oldChildren[oldStartIndex].elm)
            oldEndIndex--;
            newStartIndex ++;
        } else {
            console.log('四种都没命中');
            if(!keyMap){
                keyMap = {};
                for(let i = oldStartIndex; i <= oldEndIndex; i ++){
                    const key = oldChildren[i].key;
                    if(key){
                        keyMap[k] = i;
                    }
                }
            };
            const index = keyMap[newChildren[newStartIndex].key];
            if(!index){// 没有相对应的旧DOM节点
                console.log('没有对应的key')
                parentElm.insertBefore(createElement(newChildren[newStartIndex]), oldChildren[oldStartIndex].elm);
            }else{
                let oldNode = oldChildren[index]
                patchVnode(oldNode, newChildren[newStartIndex]);
                parentElm.insertBefore(oldNode.elm, oldChildren[oldStartIndex].elm);
                oldChildren[index] = undefined;
            }
            newStartIndex ++;
        }
    }

    //循环结束后：
    if(newStartIndex <= newEndIndex){ // 新节点还有剩余
        for(let i = newStartIndex; i <= newEndIndex; i ++){
            if(newChildren[i]){
                parentElm.appendChild(createElement(newChildren[i]))
            }
        }

    } else if(oldStartIndex <= oldEndIndex){ // 旧节点还有剩余
        for(let i = oldStartIndex; i <= oldEndIndex; i ++){
            if(oldChildren[i]){
                parentElm.removeChild(oldChildren[i].elm)
            }
        }
    }
}

function checkSameNode(vnode1, vnode2){
    if(vnode1.tag === vnode2.tag && vnode1.key && vnode2.key && vnode1.key === vnode2.key){
        return true
    }
    return false
}