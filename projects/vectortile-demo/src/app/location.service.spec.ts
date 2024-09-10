import { TestBed } from "@angular/core/testing"
import { LocalStorageService, storageItem, storageKey } from "./local-storage-service"

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get a string value', () => {
    const item: storageItem = { key: 'customUrl', value: 'http://example.com' };
    service.set(item);
    expect(service.get('customUrl')).toBe('http://example.com');
  });

  it('should set and get a boolean value', () => {
    const item: storageItem = { key: 'showDebugLayer', value: true };
    service.set(item);
    expect(service.getBoolean('showDebugLayer')).toBe(true);
  });

  it('should return false for non-existent boolean key', () => {
    expect(service.getBoolean('nonExistentKey' as storageKey)).toBe(false);
  });

  it('should return empty string for non-existent string key', () => {
    expect(service.get('nonExistentKey' as storageKey)).toBe('');
  });

  it('should check if a key exists', () => {
    const item: storageItem = { key: 'customUrl', value: 'http://example.com' };
    service.set(item);
    expect(service.Exists('customUrl')).toBe(true);
    expect(service.Exists('nonExistentKey' as storageKey)).toBe(false);
  });

  it('should remove a key', () => {
    const item: storageItem = { key: 'customUrl', value: 'http://example.com' };
    service.set(item);
    service.remove('customUrl');
    expect(service.get('customUrl')).toBe('');
  });

  it('should remove all keys', () => {
    const items: storageItem[] = [
      { key: 'customUrl', value: 'http://example.com' },
      { key: 'customUrlExtension', value: 'jpg' },
      { key: 'customUrlMinZoom', value: '5' },
      { key: 'customUrlxyzTemplate', value: 'template' },
      { key: 'showDebugLayer', value: true }
    ];
    items.forEach(item => service.set(item));
    service.removeAll();
    items.forEach(item => expect(service.get(item.key)).toBe(''));
  });
});

