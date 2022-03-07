import vnode from "./vnode.js";
/**
 * 生成虚拟DOM树，返回该对象；
 * 必须接受以下三个参数，缺一不可：
 * @param {string} tag
 * @param {object} data
 * @param {*} children
 * @returns {object}
 * 调用方式也有三种：
 * h('div', {}, 'text')
 * h('div', {}, [])
 * h('div', {}, h())
 */

function h(tag, data, children) {
    if(arguments.length !== 3){
        throw new Error('h()函数只接受3个参数')
    }

    if(typeof children === 'string' || typeof children === 'number'){
        return vnode(tag, data, undefined, children, undefined);
    }else if(children instanceof Array){
        children.map(child => {
            if(!(typeof child === 'object' && child.hasOwnProperty('tag'))){
                throw new Error('children数组有不是h()函数的项')
            }
        });
        return vnode(tag, data, children, undefined, undefined);
    }else if(typeof children === 'object' && children.hasOwnProperty('tag')){
        return vnode(tag, data, [children], undefined, undefined);
    }else{
        throw new Error('传入的children参数类型不对')
    }

}
export default h;