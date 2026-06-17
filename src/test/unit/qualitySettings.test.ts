import { describe, it, expect, vi, beforeAll } from 'vitest'

// Mock THREE before importing qualitySettings since it uses window.devicePixelRatio
// and THREE constants at module evaluation time
vi.mock('three', () => ({
  BasicShadowMap: 0,
  PCFShadowMap: 1,
  PCFSoftShadowMap: 2,
  VSMShadowMap: 3,
}))

// jsdom doesn't set devicePixelRatio by default, so set it before import
beforeAll(() => {
  Object.defineProperty(window, 'devicePixelRatio', {
    value: 2,
    writable: true,
  })
})

import {
  QUALITY_PRESETS,
  getQualityPreset,
  getShadowMapType,
  type QualityLevel,
  type QualityPreset,
} from '@/views/users/LabUtils/qualitySettings'

describe('QUALITY_PRESETS', () => {
  it('defines all 4 quality levels', () => {
    const levels: QualityLevel[] = ['low', 'medium', 'high', 'ultra']
    for (const level of levels) {
      expect(QUALITY_PRESETS).toHaveProperty(level)
    }
  })

  it('each preset has all required rendering fields', () => {
    const requiredFields: (keyof QualityPreset)[] = [
      'shadowMapSize',
      'shadowType',
      'shadowBias',
      'shadowNormalBias',
      'antialias',
      'pixelRatio',
      'toneMapping',
      'toneMappingExposure',
      'postProcessing',
      'bloom',
      'ssao',
      'dof',
      'maxLights',
      'envMapIntensity',
      'textureAnisotropy',
      'lodDistances',
    ]
    for (const level of Object.keys(QUALITY_PRESETS) as QualityLevel[]) {
      const preset = QUALITY_PRESETS[level]
      for (const field of requiredFields) {
        expect(preset, `${level} preset missing ${field}`).toHaveProperty(field)
      }
    }
  })

  it('shadowMapSize increases with quality level', () => {
    expect(QUALITY_PRESETS.low.shadowMapSize).toBeLessThan(QUALITY_PRESETS.medium.shadowMapSize)
    expect(QUALITY_PRESETS.medium.shadowMapSize).toBeLessThan(QUALITY_PRESETS.high.shadowMapSize)
    expect(QUALITY_PRESETS.high.shadowMapSize).toBeLessThan(QUALITY_PRESETS.ultra.shadowMapSize)
  })

  it('maxLights increases with quality level', () => {
    expect(QUALITY_PRESETS.low.maxLights).toBeLessThan(QUALITY_PRESETS.medium.maxLights)
    expect(QUALITY_PRESETS.medium.maxLights).toBeLessThan(QUALITY_PRESETS.high.maxLights)
    expect(QUALITY_PRESETS.high.maxLights).toBeLessThan(QUALITY_PRESETS.ultra.maxLights)
  })

  it('textureAnisotropy increases with quality level', () => {
    expect(QUALITY_PRESETS.low.textureAnisotropy).toBeLessThan(QUALITY_PRESETS.medium.textureAnisotropy)
    expect(QUALITY_PRESETS.medium.textureAnisotropy).toBeLessThan(QUALITY_PRESETS.high.textureAnisotropy)
    expect(QUALITY_PRESETS.high.textureAnisotropy).toBeLessThan(QUALITY_PRESETS.ultra.textureAnisotropy)
  })

  it('low preset has antialias disabled', () => {
    expect(QUALITY_PRESETS.low.antialias).toBe(false)
  })

  it('medium/high/ultra presets have antialias enabled', () => {
    expect(QUALITY_PRESETS.medium.antialias).toBe(true)
    expect(QUALITY_PRESETS.high.antialias).toBe(true)
    expect(QUALITY_PRESETS.ultra.antialias).toBe(true)
  })

  it('low preset has no post-processing features', () => {
    expect(QUALITY_PRESETS.low.postProcessing).toBe(false)
    expect(QUALITY_PRESETS.low.bloom).toBe(false)
    expect(QUALITY_PRESETS.low.ssao).toBe(false)
    expect(QUALITY_PRESETS.low.dof).toBe(false)
  })

  it('ultra preset enables all post-processing features', () => {
    expect(QUALITY_PRESETS.ultra.postProcessing).toBe(true)
    expect(QUALITY_PRESETS.ultra.bloom).toBe(true)
    expect(QUALITY_PRESETS.ultra.ssao).toBe(true)
    expect(QUALITY_PRESETS.ultra.dof).toBe(true)
  })

  it('lodDistances is a tuple of 3 numbers for each preset', () => {
    for (const level of Object.keys(QUALITY_PRESETS) as QualityLevel[]) {
      const { lodDistances } = QUALITY_PRESETS[level]
      expect(Array.isArray(lodDistances)).toBe(true)
      expect(lodDistances).toHaveLength(3)
      expect(typeof lodDistances[0]).toBe('number')
      expect(typeof lodDistances[1]).toBe('number')
      expect(typeof lodDistances[2]).toBe('number')
    }
  })

  it('lodDistances range increases with quality', () => {
    const maxDist = (preset: QualityPreset) => preset.lodDistances[2]
    expect(maxDist(QUALITY_PRESETS.low)).toBeLessThan(maxDist(QUALITY_PRESETS.medium))
    expect(maxDist(QUALITY_PRESETS.medium)).toBeLessThan(maxDist(QUALITY_PRESETS.high))
    expect(maxDist(QUALITY_PRESETS.high)).toBeLessThan(maxDist(QUALITY_PRESETS.ultra))
  })
})

describe('getQualityPreset', () => {
  it('returns the correct preset for each quality level', () => {
    const levels: QualityLevel[] = ['low', 'medium', 'high', 'ultra']
    for (const level of levels) {
      expect(getQualityPreset(level)).toBe(QUALITY_PRESETS[level])
    }
  })
})

describe('getShadowMapType', () => {
  it('returns BasicShadowMap for basic', () => {
    // THREE is mocked; value is 0
    expect(getShadowMapType('basic')).toBe(0)
  })

  it('returns PCFShadowMap for pcf', () => {
    expect(getShadowMapType('pcf')).toBe(1)
  })

  it('returns PCFSoftShadowMap for pcfSoft', () => {
    expect(getShadowMapType('pcfSoft')).toBe(2)
  })

  it('returns VSMShadowMap for vsm', () => {
    expect(getShadowMapType('vsm')).toBe(3)
  })

  it('returns PCFShadowMap as fallback for unknown type', () => {
    // Cast to bypass TS for testing the default branch
    expect(getShadowMapType('unknown' as any)).toBe(1)
  })
})
