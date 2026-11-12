---
title: 前端二维数组生成树形结构
description: 问题描述 前端在构建国家的省市区结构时，接口返回的不是树形结构，这个时候就需要我们进行转化。本文提供了一种实现思路，希望能给各位一个参考。
pubDate: 2022-09-14
tags:
  - JavaScript
  - 前端
draft: false
---

## 问题描述

前端在构建国家的省市区结构时，接口返回的不是树形结构，这个时候就需要我们进行转化。以下数据为例

```json
 [
    [
        {
            "districtId": 1586533852834,
            "parentCode": "000",
            "nodeCode": "000001",
            "name": "浙江省",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533872922,
            "parentCode": "000001",
            "nodeCode": "000001001",
            "name": "杭州市",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533872940,
            "parentCode": "000001001",
            "nodeCode": "000001001001",
            "name": "上城区",
            "districtType": "HUADONG",
            "districtTypeName": null
        }
    ],
    [
        {
            "districtId": 1586533852834,
            "parentCode": "000",
            "nodeCode": "000001",
            "name": "浙江省",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533872922,
            "parentCode": "000001",
            "nodeCode": "000001001",
            "name": "杭州市",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533872961,
            "parentCode": "000001001",
            "nodeCode": "000001001002",
            "name": "下城区",
            "districtType": "HUADONG",
            "districtTypeName": null
        }
    ],
    [
        {
            "districtId": 1586533852834,
            "parentCode": "000",
            "nodeCode": "000001",
            "name": "浙江省",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533872922,
            "parentCode": "000001",
            "nodeCode": "000001001",
            "name": "杭州市",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533872980,
            "parentCode": "000001001",
            "nodeCode": "000001001003",
            "name": "临安区",
            "districtType": "HUADONG",
            "districtTypeName": null
        }
    ],
    [
        {
            "districtId": 1586533852834,
            "parentCode": "000",
            "nodeCode": "000001",
            "name": "浙江省",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533873196,
            "parentCode": "000001",
            "nodeCode": "000001002",
            "name": "宁波市",
            "districtType": "HUADONG",
            "districtTypeName": null
        }
    ],
    [
        {
            "districtId": 1586533852834,
            "parentCode": "000",
            "nodeCode": "000001",
            "name": "浙江省",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533873432,
            "parentCode": "000001",
            "nodeCode": "000001003",
            "name": "温州市",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533873468,
            "parentCode": "000001003",
            "nodeCode": "000001003002",
            "name": "平阳县",
            "districtType": "HUADONG",
            "districtTypeName": null
        }
    ],
    [
        {
            "districtId": 1586533852834,
            "parentCode": "000",
            "nodeCode": "000001",
            "name": "浙江省",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533873432,
            "parentCode": "000001",
            "nodeCode": "000001003",
            "name": "温州市",
            "districtType": "HUADONG",
            "districtTypeName": null
        },
        {
            "districtId": 1586533873486,
            "parentCode": "000001003",
            "nodeCode": "000001003003",
            "name": "文成县",
            "districtType": "HUADONG",
            "districtTypeName": null
        }
    ]
]
```

```json
[
    {
        "label": "浙江省",
        "value": 1586533852834,
        "parentCode": "000",
        "nodeCode": "000001",
        "children": [
            {
                "label": "杭州市",
                "value": 1586533872922,
                "parentCode": "000001",
                "nodeCode": "000001001",
                "children": [
                    {
                        "label": "上城区",
                        "value": 1586533872940,
                        "parentCode": "000001001",
                        "nodeCode": "000001001001"
                    },
                    {
                        "label": "下城区",
                        "value": 1586533872961,
                        "parentCode": "000001001",
                        "nodeCode": "000001001002"
                    },
                    {
                        "label": "临安区",
                        "value": 1586533872980,
                        "parentCode": "000001001",
                        "nodeCode": "000001001003"
                    }
                ]
            },
            {
                "label": "宁波市",
                "value": 1586533873196,
                "parentCode": "000001",
                "nodeCode": "000001002"
            },
            {
                "label": "温州市",
                "value": 1586533873432,
                "parentCode": "000001",
                "nodeCode": "000001003",
                "children": [
                    {
                        "label": "平阳县",
                        "value": 1586533873468,
                        "parentCode": "000001003",
                        "nodeCode": "000001003002"
                    },
                    {
                        "label": "文成县",
                        "value": 1586533873486,
                        "parentCode": "000001003",
                        "nodeCode": "000001003003"
                    }
                ]
            }
        ]
    }
]
```

## 实现步骤

① 观察输入的数据结构为二维数组，每个数组中存储了省市区的全部数据，此时首先需要将二维数组一维化，以取得所有的节点数据，用于后续构建树形结构。

```javascript
let arr = [].concat.apply([], data)
```

② 得到所有需要构建树形结构的数据后，发现数组中存在重复数据

```javascript
arrayToTree(data, rootNode) {
  let temp = {}
  let reduceArr = data.reduce((current, next) => {
    temp[next.districtId] ? "" : temp[next.districtId] = current.push(next)
    return current
  },[])
}
```

③ 数据规范化处理，把所有的数据处理成需要的节点数据

```javascript
arrayToTree(data, rootNode) {
  let temp = {}
  let reduceArr = data.reduce((current, next) => {
    temp[next.districtId] ? "" : temp[next.districtId] = current.push(next)
    return current
  },[])
  // 2.数组规范化
  let result = []
  reduceArr.forEach(item => {
    result.push({
      label:item.name,
      value:item.districtId,
      parentCode:item.parentCode,
      nodeCode:item.nodeCode,
      children: []
    })
  })
}
```

④ 采用递归的方式构建树形结构

```javascript
getTreeList(data, rootNode, list,{label, value,parentCode, nodeCode, children}) {
  // 构建父节点
  data.forEach(item =>{
    if (item.parentCode === rootNode) {
      list.push(item)
    }
  })

  list.forEach(item => {
    item.children = []
    // 构建子节点
    this.getTreeList(data, item.nodeCode, item.children,{label, value,parentCode, nodeCode, children});
    // 删除空叶子节点
    if (item.children.length === 0) {
      delete item.children;
    }
  })
  return list;
}
```

## 完整代码

```javascript
arrayToTree(data, rootNode, {label = 'label', value = 'value',parentCode = 'parentCode', nodeCode = 'nodeCode', children = ''} = {}) {
      // 1.数组去重
      let temp = {}
      let reduceArr = data.reduce((current, next) => {
        temp[next.districtId] ? "" : temp[next.districtId] = current.push(next)
        return current
      },[])
      // 2.数组规范化
      let result = []
      reduceArr.forEach(item => {
        result.push({
          label:item.name,
          value:item.districtId,
          parentCode:item.parentCode,
          nodeCode:item.nodeCode,
          children: []
        })
      })
      // 3.构建树形结构
      return this.getTreeList(result,rootNode,[],{
        label,value,parentCode,nodeCode,children
      });
    },
    // 递归构建树形结构
    getTreeList(data, rootNode, list,{label, value,parentCode, nodeCode, children}) {
      data.forEach(item =>{
        if (item.parentCode === rootNode) {
          list.push(item)
        }
      })

      list.forEach(item => {
        item.children = []
        this.getTreeList(data, item.nodeCode, item.children,{label, value,parentCode, nodeCode, children});
        if (item.children.length === 0) {
          delete item.children;
        }
      })
      return list;
    },
```
