import { describe, expect, it } from 'vitest'
import { generateTemplate, templateToData } from '../src/templateToData'
import { template } from '../src/data/index'

describe('should', () => {
  // it('exported', () => {
  //   expect(templateToData(template)).toMatchInlineSnapshot()
  // })
  it('exported', () => {
    expect(generateTemplate(template)).toMatchInlineSnapshot('Promise {}')
  })
})
