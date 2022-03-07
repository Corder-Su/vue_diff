import h from "./h.js";
import patch from "./patch.js";

// let myvnode = h('ul',{} ,[
//     h('li',{}, '娃哈哈'),
//     h('li', {}, '自写DIFF'),
//     h('li', {}, h('span', {}, 11))
// ])

// console.log(myvnode)

// let container = document.querySelector('.container');
// patch(container, myvnode)

let myvnode1 = h('ul', {key : 1}, [
    h('li',{key : 11}, '123'),
    h('li', {key : 12}, '123123'),
    h('li', {key : 13}, h('span', {}, 12))
])
let myvnode2 = h('ul',{key : 1} ,[
    h('li',{key : 11}, '娃哈哈'),
    h('li', {key : 12}, '自写DIFF'),
    h('li', {key : 13}, h('span', {}, 11))
])

console.log(myvnode1)

let container = document.querySelector('.container');
patch(container, myvnode1)

let btn = document.querySelector('button');

btn.addEventListener('click', () => {
    patch(myvnode1, myvnode2)
})
