import * as cache from '@actions/cache';
import * as core from '@actions/core';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { CollectedData } from '../types';

const CACHE_KEY_PREFIX = 'repostats-data-';
const CACHE_FILE = '.repostats-cache.json';

export async function restoreCache(): Promise<CollectedData | null> {
  try {
    const cacheKey = getCacheKey();
    const restored = await cache.restoreCache([CACHE_FILE], cacheKey, [CACHE_KEY_PREFIX]);

    if (restored && fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8');
      core.info(`Cache restored from ${restored}`);
      return JSON.parse(content) as CollectedData;
    }
  } catch (err) {
    core.warning(`Cache restore failed: ${err}`);
  }
  return null;
}

export async function saveCache(data: CollectedData): Promise<void> {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data), 'utf-8');
    const cacheKey = getCacheKey();
    await cache.saveCache([CACHE_FILE], cacheKey);
    core.info('Cache saved.');
  } catch (err) {
    core.warning(`Cache save failed: ${err}`);
  } finally {
    // Clean up the temp file
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
  }
}

function getCacheKey(): string {
  // Use current date (day granularity) as part of key so cache refreshes daily
  const date = new Date().toISOString().split('T')[0];
  const hash = crypto.createHash('md5').update(date).digest('hex').slice(0, 8);
  return `${CACHE_KEY_PREFIX}${hash}`;
}
