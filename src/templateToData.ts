import console from 'console'
import fs from 'fs/promises'
import path from 'path'

interface DataItem {
  label: string
  prop: string
  slot?: string
  isShow?: string | boolean
  [key: string]: unknown
}

/**
 * 获取tag Dom
 * @param {string} tag
 * @param {string} str
 * @returns
 */
function getTagStr(tag: string, str: string, closeTag = true, inner = false) {
  let reg
  if (closeTag) {
    reg = new RegExp(`\\<${tag}[\\s\\S]*?<\\/${tag}>`, 'g')
    const tagStr = str.match(reg) || ''
    if (inner) {
      // 获取html标签内的内容
      const innerReg = /(?<=((<[a-zA-Z-]+?){0,1}>))([\s\S]+)(?=([\s]{0,1}<\/[a-zA-Z-]+(>{0,1})))/g
      const innerContent = tagStr && tagStr[0] && tagStr[0].match(innerReg)
      return innerContent && innerContent[0]
    }
    else {
      return tagStr
    }
  }
  else {
    reg = new RegExp(`\\<${tag}([\\s\\S]*?)>`, 'g')
    const matches = str.match(reg)
    return matches && matches[0]
  }
}

/**
 * 获取属性内容
 *
 * @param {string} attr
 * @param {string} str
 * @returns
 */
function getAttrStr(attr: string, str: string, inner = true) {
  const reg = new RegExp(`${attr}="([\\s\\S]*?)"`, 'g')
  const matches = str && str.match(reg)
  const content = matches && matches[0]
  const innerReg = new RegExp(`(?<=${attr}=").+(?=\\")`, 'g')
  const innerMatches = content && content.match(innerReg)
  return inner ? innerMatches && innerMatches[0] : matches
}

interface Options {
  /** 是否返回template */
  isReturnTemplate?: boolean
  /** 是否写死isShow */
  isShow?: boolean
}
/**
 * 模板转换为数据格式
 *
 */
export const templateToData = (str: string, options: Options = {
  isReturnTemplate: false,
  isShow: false,
}): any => {
  // 去除html注释
  str = str.replace(/<!--[\s\S]*?-->/g, '')
  // 匹配ElFormItem
  const elFormItems = getTagStr('ElFormItem', str, true) as RegExpMatchArray
  if (elFormItems === null) {
    console.error('没有找到ElFormItem')
    return []
  }
  else {
    const data: DataItem[] = []
    elFormItems.forEach((elFormItem: any) => {
      const elFormItemPrefixTagStr: any = getTagStr('ElFormItem', elFormItem, false)
      const baseTooltipPrefixTagStr: any = getTagStr('BaseTooltip', elFormItem, false)
      const baseTooltipTagStr: any = getTagStr('BaseTooltip', elFormItem, true, true)
      const prop = getAttrStr('prop', elFormItemPrefixTagStr, true) as string
      const isShow = getAttrStr('v-if', elFormItemPrefixTagStr, true) as string
      const label = getAttrStr('content', baseTooltipPrefixTagStr, true) as string
      if (label && prop) {
        data.push({
          label,
          prop,
          slot: prop,
          isShow: options.isShow ? true : isShow || true,
          template: baseTooltipTagStr,
        })
      }
    })
    if (options.isReturnTemplate) {
      return data
    }
    else {
      return data.map(({ label, prop, isShow }) => {
        return {
          label,
          prop,
          slot: prop,
          isShow,
        }
      })
    }
  }
}
/**
 * 生成组件模板
 * @param str
 * @returns
 */
export const generateTemplate = async (str: string, isShow = false, ...pathSegments: string[]): Promise<string> => {
  const _pathSegments = pathSegments && pathSegments.length ? pathSegments : ['./src/templateByGenerate.vue']
  const templateData = templateToData(str, { isReturnTemplate: true, isShow })
  let output = '<template><BaseConditionsForm :columns="columns">'
  templateData.forEach((item: DataItem) => {
    const itemStr = `<template #${item.slot}>
      ${item.template}
      </template>
    `
    output += itemStr
  })
  output += `</BaseConditionsForm></template><script lang="ts" setup>
  import { ref } from 'vue'
  const columns = ref([
 `
  templateData.forEach((item: DataItem) => {
    output += `{
      label: '${item.label}',
      prop: '${item.prop}',
      slot: '${item.slot}',
      isShow: ${item.isShow},
    },`
  })
  output += '])</script>'
  await fs.writeFile(path.resolve(..._pathSegments), output)
  return output
}
