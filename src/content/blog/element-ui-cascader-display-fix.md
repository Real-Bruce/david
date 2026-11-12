---
title: ElementUI级联选择器回显问题解决
description: 使用 ElementUI 的 Cascader 级联选择器组件，如果使用了懒加载和动态加载数据会导致，在v-model中的数据据重新放到 Cascader 级联组建后，会出现数据不回显的问题。
pubDate: 2022-09-14
tags:
  - Element UI
  - Vue
draft: false
---

## 1. 分析问题

### 1.1问题描述

使用 ElementUI 的 Cascader 级联选择器组件，如果使用了懒加载和动态加载数据会导致，在`v-model`中的数据据重新放到 Cascader 级联组建后，会出现数据不回显的问题。

### 1.2原因分析

在级联组件中虽然在`v-model`中重新传入选中的数据，但采用了懒加载+远程数据的方式构建选项数据，此时级联组件的结构数据并未生成，此时**仅有选中后的数据而没有选项数据**，因此导致了级联选择器没有数据可供显示，也就导致了数据不回显的问题。

### 1.3解决方案

- 前端渲染完整的选项数据，此方案需要前端渲染的数据量极大，可能导致页面崩溃，不建议采用此方式处理；
- 仅渲染选中后的数据，即仅构建选中后的选项结构，后端返回的数据结构进行处理后依然可以配合懒加载+远程数据的方式（需要对渲染生成的数据进行去重，避免和远程访问的数据重复）

## 2. 解决问题

借助Cascader 级联选择器组件的`options`属性，构建选项结构配合`v-model`即可实现数据回显，如果想配合懒加载+远程数据，需要指定级联组件的属性信息。

```javascript

{
  "label": "浙江省",
  "value": 12321
  "children": [{
      "label": "杭州市",
      "value": 4565
   }]
}
```

**【实现方式】**

```javascript
<el-cascader
  v-model='data'
  :props='cascadeProps'
  :options='cascadeOptions'
  filterable
  ></el-cascader>
```

```javascript
cascadeProps: {
  multiple: true,
    checkStrictly: true,
      // 启用懒加载
      lazy: true,
        // 远程数据访问
        lazyLoad: async (node, resolve) => {
          const { data, level} = node
          const parentCode = level === 0 ? '000' : data.nodeCode
          const nodes = await this.getRemoteData(parentCode, level)
          // 去除重复节点
          let nodeFilter = nodes.filter(n => {
            if (!this.optionList.includes(n.value)) {
              return n
            }
          })
          resolve(nodeFilter)
        },
},
```

```javascript
getRemoteData(parentCode, level) {
  return new Promise((resolve, reject) => {
    getDistrictData({ parentCode }).then((res) => {
      resolve(this.formatData(res.data, level))
    })
  })
},

  formatData(data, level) {
    let districtType = ''
    switch (level) {
      case 0:
        districtType = 'province'
        break
      case 1:
        districtType = 'city'
        break
      case 2:
        districtType = 'district'
        break
      default:
        break
    }
    return data.map((item) => {
      return {
        districtType,
        nodeCode: item.nodeCode,
        value: item.districtId,
        label: item.name,
        leaf: level >= 2,
      }
    })
  },
```

树形结构的生成，请参考：[前端二维数组生成树形结构](https://link.juejin.cn/?target=)
