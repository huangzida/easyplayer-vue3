import {
  __publicField
} from "./chunk-V6TY7KAL.js";

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/at.mjs
function at(arr, indices) {
  const result = new Array(indices.length);
  const length = arr.length;
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    index = Number.isInteger(index) ? index : Math.trunc(index) || 0;
    if (index < 0) {
      index += length;
    }
    result[i] = arr[index];
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/chunk.mjs
function chunk(arr, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("Size must be an integer greater than zero.");
  }
  const chunkLength = Math.ceil(arr.length / size);
  const result = Array(chunkLength);
  for (let index = 0; index < chunkLength; index++) {
    const start = index * size;
    const end = start + size;
    result[index] = arr.slice(start, end);
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/compact.mjs
function compact(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item) {
      result.push(item);
    }
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/countBy.mjs
function countBy(arr, mapper) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = mapper(item, i, arr);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/difference.mjs
function difference(firstArr, secondArr) {
  const secondSet = new Set(secondArr);
  return firstArr.filter((item) => !secondSet.has(item));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/differenceBy.mjs
function differenceBy(firstArr, secondArr, mapper) {
  const mappedSecondSet = new Set(secondArr.map((item) => mapper(item)));
  return firstArr.filter((item) => {
    return !mappedSecondSet.has(mapper(item));
  });
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/differenceWith.mjs
function differenceWith(firstArr, secondArr, areItemsEqual) {
  return firstArr.filter((firstItem) => {
    return secondArr.every((secondItem) => {
      return !areItemsEqual(firstItem, secondItem);
    });
  });
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/drop.mjs
function drop(arr, itemsCount) {
  itemsCount = Math.max(itemsCount, 0);
  return arr.slice(itemsCount);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/dropRight.mjs
function dropRight(arr, itemsCount) {
  itemsCount = Math.min(-itemsCount, 0);
  if (itemsCount === 0) {
    return arr.slice();
  }
  return arr.slice(0, itemsCount);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/dropRightWhile.mjs
function dropRightWhile(arr, canContinueDropping) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!canContinueDropping(arr[i], i, arr)) {
      return arr.slice(0, i + 1);
    }
  }
  return [];
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/dropWhile.mjs
function dropWhile(arr, canContinueDropping) {
  const dropEndIndex = arr.findIndex((item, index, arr2) => !canContinueDropping(item, index, arr2));
  if (dropEndIndex === -1) {
    return [];
  }
  return arr.slice(dropEndIndex);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/fill.mjs
function fill(array, value, start = 0, end = array.length) {
  const length = array.length;
  const finalStart = Math.max(start >= 0 ? start : length + start, 0);
  const finalEnd = Math.min(end >= 0 ? end : length + end, length);
  for (let i = finalStart; i < finalEnd; i++) {
    array[i] = value;
  }
  return array;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/promise/semaphore.mjs
var Semaphore = class {
  constructor(capacity) {
    __publicField(this, "capacity");
    __publicField(this, "available");
    __publicField(this, "deferredTasks", []);
    this.capacity = capacity;
    this.available = capacity;
  }
  async acquire() {
    if (this.available > 0) {
      this.available--;
      return;
    }
    return new Promise((resolve) => {
      this.deferredTasks.push(resolve);
    });
  }
  release() {
    const deferredTask = this.deferredTasks.shift();
    if (deferredTask != null) {
      deferredTask();
      return;
    }
    if (this.available < this.capacity) {
      this.available++;
    }
  }
};

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/limitAsync.mjs
function limitAsync(callback, concurrency) {
  const semaphore = new Semaphore(concurrency);
  return async function(...args) {
    try {
      await semaphore.acquire();
      return await callback.apply(this, args);
    } finally {
      semaphore.release();
    }
  };
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/filterAsync.mjs
async function filterAsync(array, predicate, options) {
  if ((options == null ? void 0 : options.concurrency) != null) {
    predicate = limitAsync(predicate, options.concurrency);
  }
  const results = await Promise.all(array.map(predicate));
  return array.filter((_, index) => results[index]);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/flatten.mjs
function flatten(arr, depth = 1) {
  const result = [];
  const flooredDepth = Math.floor(depth);
  const recursive = (arr2, currentDepth) => {
    for (let i = 0; i < arr2.length; i++) {
      const item = arr2[i];
      if (Array.isArray(item) && currentDepth < flooredDepth) {
        recursive(item, currentDepth + 1);
      } else {
        result.push(item);
      }
    }
  };
  recursive(arr, 0);
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/flatMap.mjs
function flatMap(arr, iteratee, depth = 1) {
  return flatten(arr.map((item, index) => iteratee(item, index, arr)), depth);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/flatMapAsync.mjs
async function flatMapAsync(array, callback, options) {
  if ((options == null ? void 0 : options.concurrency) != null) {
    callback = limitAsync(callback, options.concurrency);
  }
  const results = await Promise.all(array.map(callback));
  return flatten(results);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/flattenDeep.mjs
function flattenDeep(arr) {
  return flatten(arr, Infinity);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/flatMapDeep.mjs
function flatMapDeep(arr, iteratee) {
  return flattenDeep(arr.map((item, index) => iteratee(item, index, arr)));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/forEachAsync.mjs
async function forEachAsync(array, callback, options) {
  if ((options == null ? void 0 : options.concurrency) != null) {
    callback = limitAsync(callback, options.concurrency);
  }
  await Promise.all(array.map(callback));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/forEachRight.mjs
function forEachRight(arr, callback) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const element = arr[i];
    callback(element, i, arr);
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/groupBy.mjs
function groupBy(arr, getKeyFromItem) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = getKeyFromItem(item, i, arr);
    if (!Object.hasOwn(result, key)) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/head.mjs
function head(arr) {
  return arr[0];
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/initial.mjs
function initial(arr) {
  return arr.slice(0, -1);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/intersection.mjs
function intersection(firstArr, secondArr) {
  const secondSet = new Set(secondArr);
  return firstArr.filter((item) => secondSet.has(item));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/intersectionBy.mjs
function intersectionBy(firstArr, secondArr, mapper) {
  const result = [];
  const mappedSecondSet = new Set(secondArr.map(mapper));
  for (let i = 0; i < firstArr.length; i++) {
    const item = firstArr[i];
    const mappedItem = mapper(item);
    if (mappedSecondSet.has(mappedItem)) {
      result.push(item);
      mappedSecondSet.delete(mappedItem);
    }
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/intersectionWith.mjs
function intersectionWith(firstArr, secondArr, areItemsEqual) {
  return firstArr.filter((firstItem) => {
    return secondArr.some((secondItem) => {
      return areItemsEqual(firstItem, secondItem);
    });
  });
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/isSubset.mjs
function isSubset(superset, subset) {
  return difference(subset, superset).length === 0;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/isSubsetWith.mjs
function isSubsetWith(superset, subset, areItemsEqual) {
  return differenceWith(subset, superset, areItemsEqual).length === 0;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/keyBy.mjs
function keyBy(arr, getKeyFromItem) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = getKeyFromItem(item, i, arr);
    result[key] = item;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/last.mjs
function last(arr) {
  return arr[arr.length - 1];
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/mapAsync.mjs
function mapAsync(array, callback, options) {
  if ((options == null ? void 0 : options.concurrency) != null) {
    callback = limitAsync(callback, options.concurrency);
  }
  return Promise.all(array.map(callback));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/maxBy.mjs
function maxBy(items, getValue) {
  if (items.length === 0) {
    return void 0;
  }
  let maxElement = items[0];
  let max = getValue(maxElement, 0, items);
  for (let i = 1; i < items.length; i++) {
    const element = items[i];
    const value = getValue(element, i, items);
    if (value > max) {
      max = value;
      maxElement = element;
    }
  }
  return maxElement;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/minBy.mjs
function minBy(items, getValue) {
  if (items.length === 0) {
    return void 0;
  }
  let minElement = items[0];
  let min = getValue(minElement, 0, items);
  for (let i = 1; i < items.length; i++) {
    const element = items[i];
    const value = getValue(element, i, items);
    if (value < min) {
      min = value;
      minElement = element;
    }
  }
  return minElement;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/_internal/compareValues.mjs
function compareValues(a, b, order) {
  if (a < b) {
    return order === "asc" ? -1 : 1;
  }
  if (a > b) {
    return order === "asc" ? 1 : -1;
  }
  return 0;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/orderBy.mjs
function orderBy(arr, criteria, orders) {
  return arr.slice().sort((a, b) => {
    const ordersLength = orders.length;
    for (let i = 0; i < criteria.length; i++) {
      const order = ordersLength > i ? orders[i] : orders[ordersLength - 1];
      const criterion = criteria[i];
      const criterionIsFunction = typeof criterion === "function";
      const valueA = criterionIsFunction ? criterion(a) : a[criterion];
      const valueB = criterionIsFunction ? criterion(b) : b[criterion];
      const result = compareValues(valueA, valueB, order);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/partition.mjs
function partition(arr, isInTruthy) {
  const truthy = [];
  const falsy = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (isInTruthy(item, i, arr)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  return [truthy, falsy];
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/pull.mjs
function pull(arr, valuesToRemove) {
  const valuesSet = new Set(valuesToRemove);
  let resultIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (valuesSet.has(arr[i])) {
      continue;
    }
    if (!Object.hasOwn(arr, i)) {
      delete arr[resultIndex++];
      continue;
    }
    arr[resultIndex++] = arr[i];
  }
  arr.length = resultIndex;
  return arr;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/pullAt.mjs
function pullAt(arr, indicesToRemove) {
  const removed = at(arr, indicesToRemove);
  const indices = new Set(indicesToRemove.slice().sort((x, y) => y - x));
  for (const index of indices) {
    arr.splice(index, 1);
  }
  return removed;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/reduceAsync.mjs
async function reduceAsync(array, reducer, initialValue) {
  let startIndex = 0;
  if (initialValue == null) {
    initialValue = array[0];
    startIndex = 1;
  }
  let accumulator = initialValue;
  for (let i = startIndex; i < array.length; i++) {
    accumulator = await reducer(accumulator, array[i], i, array);
  }
  return accumulator;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/remove.mjs
function remove(arr, shouldRemoveElement) {
  const originalArr = arr.slice();
  const removed = [];
  let resultIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (shouldRemoveElement(arr[i], i, originalArr)) {
      removed.push(arr[i]);
      continue;
    }
    if (!Object.hasOwn(arr, i)) {
      delete arr[resultIndex++];
      continue;
    }
    arr[resultIndex++] = arr[i];
  }
  arr.length = resultIndex;
  return removed;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/sample.mjs
function sample(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/random.mjs
function random(minimum, maximum) {
  if (maximum == null) {
    maximum = minimum;
    minimum = 0;
  }
  if (minimum >= maximum) {
    throw new Error("Invalid input: The maximum value must be greater than the minimum value.");
  }
  return Math.random() * (maximum - minimum) + minimum;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/randomInt.mjs
function randomInt(minimum, maximum) {
  return Math.floor(random(minimum, maximum));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/sampleSize.mjs
function sampleSize(array, size) {
  if (size > array.length) {
    throw new Error("Size must be less than or equal to the length of array.");
  }
  const result = new Array(size);
  const selected = /* @__PURE__ */ new Set();
  for (let step = array.length - size, resultIndex = 0; step < array.length; step++, resultIndex++) {
    let index = randomInt(0, step + 1);
    if (selected.has(index)) {
      index = step;
    }
    selected.add(index);
    result[resultIndex] = array[index];
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/shuffle.mjs
function shuffle(arr) {
  const result = arr.slice();
  for (let i = result.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/sortBy.mjs
function sortBy(arr, criteria) {
  return orderBy(arr, criteria, ["asc"]);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/tail.mjs
function tail(arr) {
  return arr.slice(1);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/predicate/isSymbol.mjs
function isSymbol(value) {
  return typeof value === "symbol" || value instanceof Symbol;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/util/toNumber.mjs
function toNumber(value) {
  if (isSymbol(value)) {
    return NaN;
  }
  return Number(value);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/util/toFinite.mjs
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === Infinity || value === -Infinity) {
    const sign = value < 0 ? -1 : 1;
    return sign * Number.MAX_VALUE;
  }
  return value === value ? value : 0;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/util/toInteger.mjs
function toInteger(value) {
  const finite = toFinite(value);
  const remainder = finite % 1;
  return remainder ? finite - remainder : finite;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/take.mjs
function take(arr, count, guard) {
  count = guard || count === void 0 ? 1 : toInteger(count);
  return arr.slice(0, count);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/takeRight.mjs
function takeRight(arr, count, guard) {
  count = guard || count === void 0 ? 1 : toInteger(count);
  if (count <= 0 || arr.length === 0) {
    return [];
  }
  return arr.slice(-count);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/takeRightWhile.mjs
function takeRightWhile(arr, shouldContinueTaking) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!shouldContinueTaking(arr[i], i, arr)) {
      return arr.slice(i + 1);
    }
  }
  return arr.slice();
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/takeWhile.mjs
function takeWhile(arr, shouldContinueTaking) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!shouldContinueTaking(item, i, arr)) {
      break;
    }
    result.push(item);
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/toFilled.mjs
function toFilled(arr, value, start = 0, end = arr.length) {
  const length = arr.length;
  const finalStart = Math.max(start >= 0 ? start : length + start, 0);
  const finalEnd = Math.min(end >= 0 ? end : length + end, length);
  const newArr = arr.slice();
  for (let i = finalStart; i < finalEnd; i++) {
    newArr[i] = value;
  }
  return newArr;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/uniq.mjs
function uniq(arr) {
  return [...new Set(arr)];
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/union.mjs
function union(arr1, arr2) {
  return uniq(arr1.concat(arr2));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/uniqBy.mjs
function uniqBy(arr, mapper) {
  const map = /* @__PURE__ */ new Map();
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = mapper(item, i, arr);
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  return Array.from(map.values());
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/unionBy.mjs
function unionBy(arr1, arr2, mapper) {
  return uniqBy(arr1.concat(arr2), mapper);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/uniqWith.mjs
function uniqWith(arr, areItemsEqual) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const isUniq = result.every((v) => !areItemsEqual(v, item));
    if (isUniq) {
      result.push(item);
    }
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/unionWith.mjs
function unionWith(arr1, arr2, areItemsEqual) {
  return uniqWith(arr1.concat(arr2), areItemsEqual);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/unzip.mjs
function unzip(zipped) {
  let maxLen = 0;
  for (let i = 0; i < zipped.length; i++) {
    if (zipped[i].length > maxLen) {
      maxLen = zipped[i].length;
    }
  }
  const result = new Array(maxLen);
  for (let i = 0; i < maxLen; i++) {
    result[i] = new Array(zipped.length);
    for (let j = 0; j < zipped.length; j++) {
      result[i][j] = zipped[j][i];
    }
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/unzipWith.mjs
function unzipWith(target, iteratee) {
  const maxLength = Math.max(...target.map((innerArray) => innerArray.length));
  const result = new Array(maxLength);
  for (let i = 0; i < maxLength; i++) {
    const group = new Array(target.length);
    for (let j = 0; j < target.length; j++) {
      group[j] = target[j][i];
    }
    result[i] = iteratee(...group);
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/windowed.mjs
function windowed(arr, size, step = 1, { partialWindows = false } = {}) {
  if (size <= 0 || !Number.isInteger(size)) {
    throw new Error("Size must be a positive integer.");
  }
  if (step <= 0 || !Number.isInteger(step)) {
    throw new Error("Step must be a positive integer.");
  }
  const result = [];
  const end = partialWindows ? arr.length : arr.length - size + 1;
  for (let i = 0; i < end; i += step) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/without.mjs
function without(array, ...values) {
  return difference(array, values);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/xor.mjs
function xor(arr1, arr2) {
  return difference(union(arr1, arr2), intersection(arr1, arr2));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/xorBy.mjs
function xorBy(arr1, arr2, mapper) {
  const union2 = unionBy(arr1, arr2, mapper);
  const intersection2 = intersectionBy(arr1, arr2, mapper);
  return differenceBy(union2, intersection2, mapper);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/xorWith.mjs
function xorWith(arr1, arr2, areElementsEqual) {
  const union2 = unionWith(arr1, arr2, areElementsEqual);
  const intersection2 = intersectionWith(arr1, arr2, areElementsEqual);
  return differenceWith(union2, intersection2, areElementsEqual);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/zip.mjs
function zip(...arrs) {
  let rowCount = 0;
  for (let i = 0; i < arrs.length; i++) {
    if (arrs[i].length > rowCount) {
      rowCount = arrs[i].length;
    }
  }
  const columnCount = arrs.length;
  const result = Array(rowCount);
  for (let i = 0; i < rowCount; ++i) {
    const row = Array(columnCount);
    for (let j = 0; j < columnCount; ++j) {
      row[j] = arrs[j][i];
    }
    result[i] = row;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/zipObject.mjs
function zipObject(keys, values) {
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = values[i];
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/array/zipWith.mjs
function zipWith(arr1, ...rest2) {
  const arrs = [arr1, ...rest2.slice(0, -1)];
  const combine = rest2[rest2.length - 1];
  const maxIndex = Math.max(...arrs.map((arr) => arr.length));
  const result = Array(maxIndex);
  for (let i = 0; i < maxIndex; i++) {
    const elements = arrs.map((arr) => arr[i]);
    result[i] = combine(...elements, i);
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/error/AbortError.mjs
var AbortError = class extends Error {
  constructor(message = "The operation was aborted") {
    super(message);
    this.name = "AbortError";
  }
};

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/error/TimeoutError.mjs
var TimeoutError = class extends Error {
  constructor(message = "The operation was timed out") {
    super(message);
    this.name = "TimeoutError";
  }
};

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/after.mjs
function after(n, func) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(`n must be a non-negative integer.`);
  }
  let counter = 0;
  return (...args) => {
    if (++counter >= n) {
      return func(...args);
    }
    return void 0;
  };
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/ary.mjs
function ary(func, n) {
  return function(...args) {
    return func.apply(this, args.slice(0, n));
  };
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/asyncNoop.mjs
async function asyncNoop() {
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/before.mjs
function before(n, func) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("n must be a non-negative integer.");
  }
  let counter = 0;
  return (...args) => {
    if (++counter < n) {
      return func(...args);
    }
    return void 0;
  };
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/curry.mjs
function curry(func) {
  if (func.length === 0 || func.length === 1) {
    return func;
  }
  return function(arg) {
    return makeCurry(func, func.length, [arg]);
  };
}
function makeCurry(origin, argsLength, args) {
  if (args.length === argsLength) {
    return origin(...args);
  } else {
    const next = function(arg) {
      return makeCurry(origin, argsLength, [...args, arg]);
    };
    return next;
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/curryRight.mjs
function curryRight(func) {
  if (func.length === 0 || func.length === 1) {
    return func;
  }
  return function(arg) {
    return makeCurryRight(func, func.length, [arg]);
  };
}
function makeCurryRight(origin, argsLength, args) {
  if (args.length === argsLength) {
    return origin(...args);
  } else {
    const next = function(arg) {
      return makeCurryRight(origin, argsLength, [arg, ...args]);
    };
    return next;
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/debounce.mjs
function debounce(func, debounceMs, { signal, edges } = {}) {
  let pendingThis = void 0;
  let pendingArgs = null;
  const leading = edges != null && edges.includes("leading");
  const trailing = edges == null || edges.includes("trailing");
  const invoke = () => {
    if (pendingArgs !== null) {
      func.apply(pendingThis, pendingArgs);
      pendingThis = void 0;
      pendingArgs = null;
    }
  };
  const onTimerEnd = () => {
    if (trailing) {
      invoke();
    }
    cancel();
  };
  let timeoutId = null;
  const schedule = () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      onTimerEnd();
    }, debounceMs);
  };
  const cancelTimer = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  const cancel = () => {
    cancelTimer();
    pendingThis = void 0;
    pendingArgs = null;
  };
  const flush = () => {
    invoke();
  };
  const debounced = function(...args) {
    if (signal == null ? void 0 : signal.aborted) {
      return;
    }
    pendingThis = this;
    pendingArgs = args;
    const isFirstCall = timeoutId == null;
    schedule();
    if (leading && isFirstCall) {
      invoke();
    }
  };
  debounced.schedule = schedule;
  debounced.cancel = cancel;
  debounced.flush = flush;
  signal == null ? void 0 : signal.addEventListener("abort", cancel, { once: true });
  return debounced;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/flow.mjs
function flow(...funcs) {
  return function(...args) {
    let result = funcs.length ? funcs[0].apply(this, args) : args[0];
    for (let i = 1; i < funcs.length; i++) {
      result = funcs[i].call(this, result);
    }
    return result;
  };
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/flowRight.mjs
function flowRight(...funcs) {
  return flow(...funcs.reverse());
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/identity.mjs
function identity(x) {
  return x;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/memoize.mjs
function memoize(fn, options = {}) {
  const { cache = /* @__PURE__ */ new Map(), getCacheKey } = options;
  const memoizedFn = function(arg) {
    const key = getCacheKey ? getCacheKey(arg) : arg;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.call(this, arg);
    cache.set(key, result);
    return result;
  };
  memoizedFn.cache = cache;
  return memoizedFn;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/negate.mjs
function negate(func) {
  return (...args) => !func(...args);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/noop.mjs
function noop() {
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/once.mjs
function once(func) {
  let called = false;
  let cache;
  return function(...args) {
    if (!called) {
      called = true;
      cache = func(...args);
    }
    return cache;
  };
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/partial.mjs
function partial(func, ...partialArgs) {
  return partialImpl(func, placeholderSymbol, ...partialArgs);
}
function partialImpl(func, placeholder, ...partialArgs) {
  const partialed = function(...providedArgs) {
    let providedArgsIndex = 0;
    const substitutedArgs = partialArgs.slice().map((arg) => arg === placeholder ? providedArgs[providedArgsIndex++] : arg);
    const remainingArgs = providedArgs.slice(providedArgsIndex);
    return func.apply(this, substitutedArgs.concat(remainingArgs));
  };
  if (func.prototype) {
    partialed.prototype = Object.create(func.prototype);
  }
  return partialed;
}
var placeholderSymbol = Symbol("partial.placeholder");
partial.placeholder = placeholderSymbol;

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/partialRight.mjs
function partialRight(func, ...partialArgs) {
  return partialRightImpl(func, placeholderSymbol2, ...partialArgs);
}
function partialRightImpl(func, placeholder, ...partialArgs) {
  const partialedRight = function(...providedArgs) {
    const placeholderLength = partialArgs.filter((arg) => arg === placeholder).length;
    const rangeLength = Math.max(providedArgs.length - placeholderLength, 0);
    const remainingArgs = providedArgs.slice(0, rangeLength);
    let providedArgsIndex = rangeLength;
    const substitutedArgs = partialArgs.slice().map((arg) => arg === placeholder ? providedArgs[providedArgsIndex++] : arg);
    return func.apply(this, remainingArgs.concat(substitutedArgs));
  };
  if (func.prototype) {
    partialedRight.prototype = Object.create(func.prototype);
  }
  return partialedRight;
}
var placeholderSymbol2 = Symbol("partialRight.placeholder");
partialRight.placeholder = placeholderSymbol2;

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/rest.mjs
function rest(func, startIndex = func.length - 1) {
  return function(...args) {
    const rest2 = args.slice(startIndex);
    const params = args.slice(0, startIndex);
    while (params.length < startIndex) {
      params.push(void 0);
    }
    return func.apply(this, [...params, rest2]);
  };
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/promise/delay.mjs
function delay(ms, { signal } = {}) {
  return new Promise((resolve, reject) => {
    const abortError = () => {
      reject(new AbortError());
    };
    const abortHandler = () => {
      clearTimeout(timeoutId);
      abortError();
    };
    if (signal == null ? void 0 : signal.aborted) {
      return abortError();
    }
    const timeoutId = setTimeout(() => {
      signal == null ? void 0 : signal.removeEventListener("abort", abortHandler);
      resolve();
    }, ms);
    signal == null ? void 0 : signal.addEventListener("abort", abortHandler, { once: true });
  });
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/retry.mjs
var DEFAULT_DELAY = 0;
var DEFAULT_RETRIES = Number.POSITIVE_INFINITY;
var DEFAULT_SHOULD_RETRY = () => true;
async function retry(func, _options) {
  let delay$1;
  let retries;
  let signal;
  let shouldRetry;
  if (typeof _options === "number") {
    delay$1 = DEFAULT_DELAY;
    retries = _options;
    signal = void 0;
    shouldRetry = DEFAULT_SHOULD_RETRY;
  } else {
    delay$1 = (_options == null ? void 0 : _options.delay) ?? DEFAULT_DELAY;
    retries = (_options == null ? void 0 : _options.retries) ?? DEFAULT_RETRIES;
    signal = _options == null ? void 0 : _options.signal;
    shouldRetry = (_options == null ? void 0 : _options.shouldRetry) ?? DEFAULT_SHOULD_RETRY;
  }
  let error;
  for (let attempts = 0; attempts <= retries; attempts++) {
    if (signal == null ? void 0 : signal.aborted) {
      throw error ?? new Error(`The retry operation was aborted due to an abort signal.`);
    }
    try {
      return await func();
    } catch (err) {
      error = err;
      if (!shouldRetry(err, attempts)) {
        throw err;
      }
      const currentDelay = typeof delay$1 === "function" ? delay$1(attempts) : delay$1;
      await delay(currentDelay);
    }
  }
  throw error;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/spread.mjs
function spread(func) {
  return function(argsArr) {
    return func.apply(this, argsArr);
  };
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/throttle.mjs
function throttle(func, throttleMs, { signal, edges = ["leading", "trailing"] } = {}) {
  let pendingAt = null;
  const debounced = debounce(function(...args) {
    pendingAt = Date.now();
    func.apply(this, args);
  }, throttleMs, { signal, edges });
  const throttled = function(...args) {
    if (pendingAt == null) {
      pendingAt = Date.now();
    }
    if (Date.now() - pendingAt >= throttleMs) {
      pendingAt = Date.now();
      func.apply(this, args);
      debounced.cancel();
      debounced.schedule();
      return;
    }
    debounced.apply(this, args);
  };
  throttled.cancel = debounced.cancel;
  throttled.flush = debounced.flush;
  return throttled;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/function/unary.mjs
function unary(func) {
  return ary(func, 1);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/clamp.mjs
function clamp(value, bound1, bound2) {
  if (bound2 == null) {
    return Math.min(value, bound1);
  }
  return Math.min(Math.max(value, bound1), bound2);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/inRange.mjs
function inRange(value, minimum, maximum) {
  if (maximum == null) {
    maximum = minimum;
    minimum = 0;
  }
  if (minimum >= maximum) {
    throw new Error("The maximum value must be greater than the minimum value.");
  }
  return minimum <= value && value < maximum;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/sum.mjs
function sum(nums) {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    result += nums[i];
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/mean.mjs
function mean(nums) {
  return sum(nums) / nums.length;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/sumBy.mjs
function sumBy(items, getValue) {
  let result = 0;
  for (let i = 0; i < items.length; i++) {
    result += getValue(items[i], i);
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/meanBy.mjs
function meanBy(items, getValue) {
  return sumBy(items, (item) => getValue(item)) / items.length;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/median.mjs
function median(nums) {
  if (nums.length === 0) {
    return NaN;
  }
  const sorted = nums.slice().sort((a, b) => a - b);
  const middleIndex = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
  } else {
    return sorted[middleIndex];
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/medianBy.mjs
function medianBy(items, getValue) {
  const nums = items.map((x) => getValue(x));
  return median(nums);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/range.mjs
function range(start, end, step = 1) {
  if (end == null) {
    end = start;
    start = 0;
  }
  if (!Number.isInteger(step) || step === 0) {
    throw new Error(`The step value must be a non-zero integer.`);
  }
  const length = Math.max(Math.ceil((end - start) / step), 0);
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = start + i * step;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/rangeRight.mjs
function rangeRight(start, end, step = 1) {
  if (end == null) {
    end = start;
    start = 0;
  }
  if (!Number.isInteger(step) || step === 0) {
    throw new Error(`The step value must be a non-zero integer.`);
  }
  const length = Math.max(Math.ceil((end - start) / step), 0);
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = start + (length - i - 1) * step;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/math/round.mjs
function round(value, precision = 0) {
  if (!Number.isInteger(precision)) {
    throw new Error("Precision must be an integer.");
  }
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isPrimitive.mjs
function isPrimitive(value) {
  return value == null || typeof value !== "object" && typeof value !== "function";
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isTypedArray.mjs
function isTypedArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/clone.mjs
function clone(obj) {
  if (isPrimitive(obj)) {
    return obj;
  }
  if (Array.isArray(obj) || isTypedArray(obj) || obj instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && obj instanceof SharedArrayBuffer) {
    return obj.slice(0);
  }
  const prototype = Object.getPrototypeOf(obj);
  if (prototype == null) {
    return Object.assign(Object.create(prototype), obj);
  }
  const Constructor = prototype.constructor;
  if (obj instanceof Date || obj instanceof Map || obj instanceof Set) {
    return new Constructor(obj);
  }
  if (obj instanceof RegExp) {
    const newRegExp = new Constructor(obj);
    newRegExp.lastIndex = obj.lastIndex;
    return newRegExp;
  }
  if (obj instanceof DataView) {
    return new Constructor(obj.buffer.slice(0));
  }
  if (obj instanceof Error) {
    let newError;
    if (obj instanceof AggregateError) {
      newError = new Constructor(obj.errors, obj.message, { cause: obj.cause });
    } else {
      newError = new Constructor(obj.message, { cause: obj.cause });
    }
    newError.stack = obj.stack;
    Object.assign(newError, obj);
    return newError;
  }
  if (typeof File !== "undefined" && obj instanceof File) {
    const newFile = new Constructor([obj], obj.name, { type: obj.type, lastModified: obj.lastModified });
    return newFile;
  }
  if (typeof obj === "object") {
    const newObject = Object.create(prototype);
    return Object.assign(newObject, obj);
  }
  return obj;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs
function getSymbols(object) {
  return Object.getOwnPropertySymbols(object).filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
function getTag(value) {
  if (value == null) {
    return value === void 0 ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(value);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var regexpTag = "[object RegExp]";
var stringTag = "[object String]";
var numberTag = "[object Number]";
var booleanTag = "[object Boolean]";
var argumentsTag = "[object Arguments]";
var symbolTag = "[object Symbol]";
var dateTag = "[object Date]";
var mapTag = "[object Map]";
var setTag = "[object Set]";
var arrayTag = "[object Array]";
var functionTag = "[object Function]";
var arrayBufferTag = "[object ArrayBuffer]";
var objectTag = "[object Object]";
var errorTag = "[object Error]";
var dataViewTag = "[object DataView]";
var uint8ArrayTag = "[object Uint8Array]";
var uint8ClampedArrayTag = "[object Uint8ClampedArray]";
var uint16ArrayTag = "[object Uint16Array]";
var uint32ArrayTag = "[object Uint32Array]";
var bigUint64ArrayTag = "[object BigUint64Array]";
var int8ArrayTag = "[object Int8Array]";
var int16ArrayTag = "[object Int16Array]";
var int32ArrayTag = "[object Int32Array]";
var bigInt64ArrayTag = "[object BigInt64Array]";
var float32ArrayTag = "[object Float32Array]";
var float64ArrayTag = "[object Float64Array]";

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/cloneDeepWith.mjs
function cloneDeepWith(obj, cloneValue) {
  return cloneDeepWithImpl(obj, void 0, obj, /* @__PURE__ */ new Map(), cloneValue);
}
function cloneDeepWithImpl(valueToClone, keyToClone, objectToClone, stack = /* @__PURE__ */ new Map(), cloneValue = void 0) {
  const cloned = cloneValue == null ? void 0 : cloneValue(valueToClone, keyToClone, objectToClone, stack);
  if (cloned !== void 0) {
    return cloned;
  }
  if (isPrimitive(valueToClone)) {
    return valueToClone;
  }
  if (stack.has(valueToClone)) {
    return stack.get(valueToClone);
  }
  if (Array.isArray(valueToClone)) {
    const result = new Array(valueToClone.length);
    stack.set(valueToClone, result);
    for (let i = 0; i < valueToClone.length; i++) {
      result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
    }
    if (Object.hasOwn(valueToClone, "index")) {
      result.index = valueToClone.index;
    }
    if (Object.hasOwn(valueToClone, "input")) {
      result.input = valueToClone.input;
    }
    return result;
  }
  if (valueToClone instanceof Date) {
    return new Date(valueToClone.getTime());
  }
  if (valueToClone instanceof RegExp) {
    const result = new RegExp(valueToClone.source, valueToClone.flags);
    result.lastIndex = valueToClone.lastIndex;
    return result;
  }
  if (valueToClone instanceof Map) {
    const result = /* @__PURE__ */ new Map();
    stack.set(valueToClone, result);
    for (const [key, value] of valueToClone) {
      result.set(key, cloneDeepWithImpl(value, key, objectToClone, stack, cloneValue));
    }
    return result;
  }
  if (valueToClone instanceof Set) {
    const result = /* @__PURE__ */ new Set();
    stack.set(valueToClone, result);
    for (const value of valueToClone) {
      result.add(cloneDeepWithImpl(value, void 0, objectToClone, stack, cloneValue));
    }
    return result;
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(valueToClone)) {
    return valueToClone.subarray();
  }
  if (isTypedArray(valueToClone)) {
    const result = new (Object.getPrototypeOf(valueToClone)).constructor(valueToClone.length);
    stack.set(valueToClone, result);
    for (let i = 0; i < valueToClone.length; i++) {
      result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
    }
    return result;
  }
  if (valueToClone instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && valueToClone instanceof SharedArrayBuffer) {
    return valueToClone.slice(0);
  }
  if (valueToClone instanceof DataView) {
    const result = new DataView(valueToClone.buffer.slice(0), valueToClone.byteOffset, valueToClone.byteLength);
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (typeof File !== "undefined" && valueToClone instanceof File) {
    const result = new File([valueToClone], valueToClone.name, {
      type: valueToClone.type
    });
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (typeof Blob !== "undefined" && valueToClone instanceof Blob) {
    const result = new Blob([valueToClone], { type: valueToClone.type });
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof Error) {
    const result = structuredClone(valueToClone);
    stack.set(valueToClone, result);
    result.message = valueToClone.message;
    result.name = valueToClone.name;
    result.stack = valueToClone.stack;
    result.cause = valueToClone.cause;
    result.constructor = valueToClone.constructor;
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof Boolean) {
    const result = new Boolean(valueToClone.valueOf());
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof Number) {
    const result = new Number(valueToClone.valueOf());
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof String) {
    const result = new String(valueToClone.valueOf());
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (typeof valueToClone === "object" && isCloneableObject(valueToClone)) {
    const result = Object.create(Object.getPrototypeOf(valueToClone));
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  return valueToClone;
}
function copyProperties(target, source, objectToClone = target, stack, cloneValue) {
  const keys = [...Object.keys(source), ...getSymbols(source)];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (descriptor == null || descriptor.writable) {
      target[key] = cloneDeepWithImpl(source[key], key, objectToClone, stack, cloneValue);
    }
  }
}
function isCloneableObject(object) {
  switch (getTag(object)) {
    case argumentsTag:
    case arrayTag:
    case arrayBufferTag:
    case dataViewTag:
    case booleanTag:
    case dateTag:
    case float32ArrayTag:
    case float64ArrayTag:
    case int8ArrayTag:
    case int16ArrayTag:
    case int32ArrayTag:
    case mapTag:
    case numberTag:
    case objectTag:
    case regexpTag:
    case setTag:
    case stringTag:
    case symbolTag:
    case uint8ArrayTag:
    case uint8ClampedArrayTag:
    case uint16ArrayTag:
    case uint32ArrayTag: {
      return true;
    }
    default: {
      return false;
    }
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/cloneDeep.mjs
function cloneDeep(obj) {
  return cloneDeepWithImpl(obj, void 0, obj, /* @__PURE__ */ new Map(), void 0);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/findKey.mjs
function findKey(obj, predicate) {
  const keys = Object.keys(obj);
  return keys.find((key) => predicate(obj[key], key, obj));
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isPlainObject.mjs
function isPlainObject(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  const hasObjectPrototype = proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null;
  if (!hasObjectPrototype) {
    return false;
  }
  return Object.prototype.toString.call(value) === "[object Object]";
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/flattenObject.mjs
function flattenObject(object, { delimiter = "." } = {}) {
  return flattenObjectImpl(object, "", delimiter);
}
function flattenObjectImpl(object, prefix, delimiter) {
  const result = {};
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    const prefixedKey = prefix ? `${prefix}${delimiter}${key}` : key;
    if (isPlainObject(value) && Object.keys(value).length > 0) {
      Object.assign(result, flattenObjectImpl(value, prefixedKey, delimiter));
      continue;
    }
    if (Array.isArray(value) && value.length > 0) {
      Object.assign(result, flattenObjectImpl(value, prefixedKey, delimiter));
      continue;
    }
    result[prefixedKey] = value;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/invert.mjs
function invert(obj) {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    result[value] = key;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/mapKeys.mjs
function mapKeys(object, getNewKey) {
  const result = {};
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    result[getNewKey(value, key, object)] = value;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/mapValues.mjs
function mapValues(object, getNewValue) {
  const result = {};
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    result[key] = getNewValue(value, key, object);
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/_internal/isUnsafeProperty.mjs
function isUnsafeProperty(key) {
  return key === "__proto__";
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/merge.mjs
function merge(target, source) {
  const sourceKeys = Object.keys(source);
  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];
    if (isUnsafeProperty(key)) {
      continue;
    }
    const sourceValue = source[key];
    const targetValue = target[key];
    if (isMergeableValue(sourceValue) && isMergeableValue(targetValue)) {
      target[key] = merge(targetValue, sourceValue);
    } else if (Array.isArray(sourceValue)) {
      target[key] = merge([], sourceValue);
    } else if (isPlainObject(sourceValue)) {
      target[key] = merge({}, sourceValue);
    } else if (targetValue === void 0 || sourceValue !== void 0) {
      target[key] = sourceValue;
    }
  }
  return target;
}
function isMergeableValue(value) {
  return isPlainObject(value) || Array.isArray(value);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/mergeWith.mjs
function mergeWith(target, source, merge2) {
  const sourceKeys = Object.keys(source);
  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];
    if (isUnsafeProperty(key)) {
      continue;
    }
    const sourceValue = source[key];
    const targetValue = target[key];
    const merged = merge2(targetValue, sourceValue, key, target, source);
    if (merged !== void 0) {
      target[key] = merged;
    } else if (Array.isArray(sourceValue)) {
      if (Array.isArray(targetValue)) {
        target[key] = mergeWith(targetValue, sourceValue, merge2);
      } else {
        target[key] = mergeWith([], sourceValue, merge2);
      }
    } else if (isPlainObject(sourceValue)) {
      if (isPlainObject(targetValue)) {
        target[key] = mergeWith(targetValue, sourceValue, merge2);
      } else {
        target[key] = mergeWith({}, sourceValue, merge2);
      }
    } else if (targetValue === void 0 || sourceValue !== void 0) {
      target[key] = sourceValue;
    }
  }
  return target;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/omit.mjs
function omit(obj, keys) {
  const result = { ...obj };
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    delete result[key];
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/omitBy.mjs
function omitBy(obj, shouldOmit) {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (!shouldOmit(value, key)) {
      result[key] = value;
    }
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/pick.mjs
function pick(obj, keys) {
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Object.hasOwn(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/pickBy.mjs
function pickBy(obj, shouldPick) {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (shouldPick(value, key)) {
      result[key] = value;
    }
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/predicate/isArray.mjs
function isArray(value) {
  return Array.isArray(value);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/capitalize.mjs
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/words.mjs
var CASE_SPLIT_PATTERN = new RegExp("\\p{Lu}?\\p{Ll}+|[0-9]+|\\p{Lu}+(?!\\p{Ll})|\\p{Emoji_Presentation}|\\p{Extended_Pictographic}|\\p{L}+", "gu");
function words(str) {
  return Array.from(str.match(CASE_SPLIT_PATTERN) ?? []);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/camelCase.mjs
function camelCase(str) {
  const words$1 = words(str);
  if (words$1.length === 0) {
    return "";
  }
  const [first, ...rest2] = words$1;
  return `${first.toLowerCase()}${rest2.map((word) => capitalize(word)).join("")}`;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/toCamelCaseKeys.mjs
function toCamelCaseKeys(obj) {
  if (isArray(obj)) {
    return obj.map((item) => toCamelCaseKeys(item));
  }
  if (isPlainObject(obj)) {
    const result = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const camelKey = camelCase(key);
      const convertedValue = toCamelCaseKeys(obj[key]);
      result[camelKey] = convertedValue;
    }
    return result;
  }
  return obj;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/toMerged.mjs
function toMerged(target, source) {
  return mergeWith(clone(target), source, function mergeRecursively(targetValue, sourceValue) {
    if (Array.isArray(sourceValue)) {
      if (Array.isArray(targetValue)) {
        return mergeWith(clone(targetValue), sourceValue, mergeRecursively);
      } else {
        return mergeWith([], sourceValue, mergeRecursively);
      }
    } else if (isPlainObject(sourceValue)) {
      if (isPlainObject(targetValue)) {
        return mergeWith(clone(targetValue), sourceValue, mergeRecursively);
      } else {
        return mergeWith({}, sourceValue, mergeRecursively);
      }
    }
  });
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/compat/predicate/isPlainObject.mjs
function isPlainObject2(object) {
  var _a;
  if (typeof object !== "object") {
    return false;
  }
  if (object == null) {
    return false;
  }
  if (Object.getPrototypeOf(object) === null) {
    return true;
  }
  if (Object.prototype.toString.call(object) !== "[object Object]") {
    const tag = object[Symbol.toStringTag];
    if (tag == null) {
      return false;
    }
    const isTagReadonly = !((_a = Object.getOwnPropertyDescriptor(object, Symbol.toStringTag)) == null ? void 0 : _a.writable);
    if (isTagReadonly) {
      return false;
    }
    return object.toString() === `[object ${tag}]`;
  }
  let proto = object;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(object) === proto;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/snakeCase.mjs
function snakeCase(str) {
  const words$1 = words(str);
  return words$1.map((word) => word.toLowerCase()).join("_");
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/object/toSnakeCaseKeys.mjs
function toSnakeCaseKeys(obj) {
  if (isArray(obj)) {
    return obj.map((item) => toSnakeCaseKeys(item));
  }
  if (isPlainObject2(obj)) {
    const result = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const snakeKey = snakeCase(key);
      const convertedValue = toSnakeCaseKeys(obj[key]);
      result[snakeKey] = convertedValue;
    }
    return result;
  }
  return obj;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isArrayBuffer.mjs
function isArrayBuffer(value) {
  return value instanceof ArrayBuffer;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isBlob.mjs
function isBlob(x) {
  if (typeof Blob === "undefined") {
    return false;
  }
  return x instanceof Blob;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isBoolean.mjs
function isBoolean(x) {
  return typeof x === "boolean";
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isBrowser.mjs
function isBrowser() {
  return typeof window !== "undefined" && (window == null ? void 0 : window.document) != null;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isBuffer.mjs
function isBuffer(x) {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(x);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isDate.mjs
function isDate(value) {
  return value instanceof Date;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isEmptyObject.mjs
function isEmptyObject(value) {
  return isPlainObject(value) && Object.keys(value).length === 0;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/_internal/isEqualsSameValueZero.mjs
function isEqualsSameValueZero(value, other) {
  return value === other || Number.isNaN(value) && Number.isNaN(other);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isEqualWith.mjs
function isEqualWith(a, b, areValuesEqual) {
  return isEqualWithImpl(a, b, void 0, void 0, void 0, void 0, areValuesEqual);
}
function isEqualWithImpl(a, b, property, aParent, bParent, stack, areValuesEqual) {
  const result = areValuesEqual(a, b, property, aParent, bParent, stack);
  if (result !== void 0) {
    return result;
  }
  if (typeof a === typeof b) {
    switch (typeof a) {
      case "bigint":
      case "string":
      case "boolean":
      case "symbol":
      case "undefined": {
        return a === b;
      }
      case "number": {
        return a === b || Object.is(a, b);
      }
      case "function": {
        return a === b;
      }
      case "object": {
        return areObjectsEqual(a, b, stack, areValuesEqual);
      }
    }
  }
  return areObjectsEqual(a, b, stack, areValuesEqual);
}
function areObjectsEqual(a, b, stack, areValuesEqual) {
  if (Object.is(a, b)) {
    return true;
  }
  let aTag = getTag(a);
  let bTag = getTag(b);
  if (aTag === argumentsTag) {
    aTag = objectTag;
  }
  if (bTag === argumentsTag) {
    bTag = objectTag;
  }
  if (aTag !== bTag) {
    return false;
  }
  switch (aTag) {
    case stringTag:
      return a.toString() === b.toString();
    case numberTag: {
      const x = a.valueOf();
      const y = b.valueOf();
      return isEqualsSameValueZero(x, y);
    }
    case booleanTag:
    case dateTag:
    case symbolTag:
      return Object.is(a.valueOf(), b.valueOf());
    case regexpTag: {
      return a.source === b.source && a.flags === b.flags;
    }
    case functionTag: {
      return a === b;
    }
  }
  stack = stack ?? /* @__PURE__ */ new Map();
  const aStack = stack.get(a);
  const bStack = stack.get(b);
  if (aStack != null && bStack != null) {
    return aStack === b;
  }
  stack.set(a, b);
  stack.set(b, a);
  try {
    switch (aTag) {
      case mapTag: {
        if (a.size !== b.size) {
          return false;
        }
        for (const [key, value] of a.entries()) {
          if (!b.has(key) || !isEqualWithImpl(value, b.get(key), key, a, b, stack, areValuesEqual)) {
            return false;
          }
        }
        return true;
      }
      case setTag: {
        if (a.size !== b.size) {
          return false;
        }
        const aValues = Array.from(a.values());
        const bValues = Array.from(b.values());
        for (let i = 0; i < aValues.length; i++) {
          const aValue = aValues[i];
          const index = bValues.findIndex((bValue) => {
            return isEqualWithImpl(aValue, bValue, void 0, a, b, stack, areValuesEqual);
          });
          if (index === -1) {
            return false;
          }
          bValues.splice(index, 1);
        }
        return true;
      }
      case arrayTag:
      case uint8ArrayTag:
      case uint8ClampedArrayTag:
      case uint16ArrayTag:
      case uint32ArrayTag:
      case bigUint64ArrayTag:
      case int8ArrayTag:
      case int16ArrayTag:
      case int32ArrayTag:
      case bigInt64ArrayTag:
      case float32ArrayTag:
      case float64ArrayTag: {
        if (typeof Buffer !== "undefined" && Buffer.isBuffer(a) !== Buffer.isBuffer(b)) {
          return false;
        }
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!isEqualWithImpl(a[i], b[i], i, a, b, stack, areValuesEqual)) {
            return false;
          }
        }
        return true;
      }
      case arrayBufferTag: {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
      }
      case dataViewTag: {
        if (a.byteLength !== b.byteLength || a.byteOffset !== b.byteOffset) {
          return false;
        }
        return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
      }
      case errorTag: {
        return a.name === b.name && a.message === b.message;
      }
      case objectTag: {
        const areEqualInstances = areObjectsEqual(a.constructor, b.constructor, stack, areValuesEqual) || isPlainObject(a) && isPlainObject(b);
        if (!areEqualInstances) {
          return false;
        }
        const aKeys = [...Object.keys(a), ...getSymbols(a)];
        const bKeys = [...Object.keys(b), ...getSymbols(b)];
        if (aKeys.length !== bKeys.length) {
          return false;
        }
        for (let i = 0; i < aKeys.length; i++) {
          const propKey = aKeys[i];
          const aProp = a[propKey];
          if (!Object.hasOwn(b, propKey)) {
            return false;
          }
          const bProp = b[propKey];
          if (!isEqualWithImpl(aProp, bProp, propKey, a, b, stack, areValuesEqual)) {
            return false;
          }
        }
        return true;
      }
      default: {
        return false;
      }
    }
  } finally {
    stack.delete(a);
    stack.delete(b);
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isEqual.mjs
function isEqual(a, b) {
  return isEqualWith(a, b, noop);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isError.mjs
function isError(value) {
  return value instanceof Error;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isFile.mjs
function isFile(x) {
  if (typeof File === "undefined") {
    return false;
  }
  return isBlob(x) && x instanceof File;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isFunction.mjs
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isJSON.mjs
function isJSON(value) {
  if (typeof value !== "string") {
    return false;
  }
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isJSONValue.mjs
function isJSONValue(value) {
  switch (typeof value) {
    case "object": {
      return value === null || isJSONArray(value) || isJSONObject(value);
    }
    case "string":
    case "number":
    case "boolean": {
      return true;
    }
    default: {
      return false;
    }
  }
}
function isJSONArray(value) {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((item) => isJSONValue(item));
}
function isJSONObject(obj) {
  if (!isPlainObject(obj)) {
    return false;
  }
  const keys = Reflect.ownKeys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (typeof key !== "string") {
      return false;
    }
    if (!isJSONValue(value)) {
      return false;
    }
  }
  return true;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isLength.mjs
function isLength(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isMap.mjs
function isMap(value) {
  return value instanceof Map;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isNil.mjs
function isNil(x) {
  return x == null;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isNode.mjs
function isNode() {
  var _a;
  return typeof process !== "undefined" && ((_a = process == null ? void 0 : process.versions) == null ? void 0 : _a.node) != null;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isNotNil.mjs
function isNotNil(x) {
  return x != null;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isNull.mjs
function isNull(x) {
  return x === null;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isNumber.mjs
function isNumber(x) {
  return typeof x === "number" || x instanceof Number;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isPromise.mjs
function isPromise(value) {
  return value instanceof Promise;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isRegExp.mjs
function isRegExp(value) {
  return value instanceof RegExp;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isSet.mjs
function isSet(value) {
  return value instanceof Set;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isString.mjs
function isString(value) {
  return typeof value === "string";
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isSymbol.mjs
function isSymbol2(value) {
  return typeof value === "symbol";
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isUndefined.mjs
function isUndefined(x) {
  return x === void 0;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isWeakMap.mjs
function isWeakMap(value) {
  return value instanceof WeakMap;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/predicate/isWeakSet.mjs
function isWeakSet(value) {
  return value instanceof WeakSet;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/promise/mutex.mjs
var Mutex = class {
  constructor() {
    __publicField(this, "semaphore", new Semaphore(1));
  }
  get isLocked() {
    return this.semaphore.available === 0;
  }
  async acquire() {
    return this.semaphore.acquire();
  }
  release() {
    this.semaphore.release();
  }
};

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/promise/timeout.mjs
async function timeout(ms) {
  await delay(ms);
  throw new TimeoutError();
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/promise/withTimeout.mjs
async function withTimeout(run, ms) {
  return Promise.race([run(), timeout(ms)]);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/constantCase.mjs
function constantCase(str) {
  const words$1 = words(str);
  return words$1.map((word) => word.toUpperCase()).join("_");
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/deburr.mjs
var deburrMap = /* @__PURE__ */ new Map([
  ["Æ", "Ae"],
  ["Ð", "D"],
  ["Ø", "O"],
  ["Þ", "Th"],
  ["ß", "ss"],
  ["æ", "ae"],
  ["ð", "d"],
  ["ø", "o"],
  ["þ", "th"],
  ["Đ", "D"],
  ["đ", "d"],
  ["Ħ", "H"],
  ["ħ", "h"],
  ["ı", "i"],
  ["Ĳ", "IJ"],
  ["ĳ", "ij"],
  ["ĸ", "k"],
  ["Ŀ", "L"],
  ["ŀ", "l"],
  ["Ł", "L"],
  ["ł", "l"],
  ["ŉ", "'n"],
  ["Ŋ", "N"],
  ["ŋ", "n"],
  ["Œ", "Oe"],
  ["œ", "oe"],
  ["Ŧ", "T"],
  ["ŧ", "t"],
  ["ſ", "s"]
]);
function deburr(str) {
  str = str.normalize("NFD");
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char >= "̀" && char <= "ͯ" || char >= "︠" && char <= "︣") {
      continue;
    }
    result += deburrMap.get(char) ?? char;
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/escape.mjs
var htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function escape(str) {
  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/escapeRegExp.mjs
function escapeRegExp(str) {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/kebabCase.mjs
function kebabCase(str) {
  const words$1 = words(str);
  return words$1.map((word) => word.toLowerCase()).join("-");
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/lowerCase.mjs
function lowerCase(str) {
  const words$1 = words(str);
  return words$1.map((word) => word.toLowerCase()).join(" ");
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/lowerFirst.mjs
function lowerFirst(str) {
  return str.substring(0, 1).toLowerCase() + str.substring(1);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/pad.mjs
function pad(str, length, chars = " ") {
  return str.padStart(Math.floor((length - str.length) / 2) + str.length, chars).padEnd(length, chars);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/pascalCase.mjs
function pascalCase(str) {
  const words$1 = words(str);
  return words$1.map((word) => capitalize(word)).join("");
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/reverseString.mjs
function reverseString(value) {
  return [...value].reverse().join("");
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/startCase.mjs
function startCase(str) {
  const words$1 = words(str.trim());
  let result = "";
  for (let i = 0; i < words$1.length; i++) {
    const word = words$1[i];
    if (result) {
      result += " ";
    }
    result += word[0].toUpperCase() + word.slice(1).toLowerCase();
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/trimEnd.mjs
function trimEnd(str, chars) {
  if (chars === void 0) {
    return str.trimEnd();
  }
  let endIndex = str.length;
  switch (typeof chars) {
    case "string": {
      if (chars.length !== 1) {
        throw new Error(`The 'chars' parameter should be a single character string.`);
      }
      while (endIndex > 0 && str[endIndex - 1] === chars) {
        endIndex--;
      }
      break;
    }
    case "object": {
      while (endIndex > 0 && chars.includes(str[endIndex - 1])) {
        endIndex--;
      }
    }
  }
  return str.substring(0, endIndex);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/trimStart.mjs
function trimStart(str, chars) {
  if (chars === void 0) {
    return str.trimStart();
  }
  let startIndex = 0;
  switch (typeof chars) {
    case "string": {
      while (startIndex < str.length && str[startIndex] === chars) {
        startIndex++;
      }
      break;
    }
    case "object": {
      while (startIndex < str.length && chars.includes(str[startIndex])) {
        startIndex++;
      }
    }
  }
  return str.substring(startIndex);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/trim.mjs
function trim(str, chars) {
  if (chars === void 0) {
    return str.trim();
  }
  return trimStart(trimEnd(str, chars), chars);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/unescape.mjs
var htmlUnescapes = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
};
function unescape(str) {
  return str.replace(/&(?:amp|lt|gt|quot|#(0+)?39);/g, (match) => htmlUnescapes[match] || "'");
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/upperCase.mjs
function upperCase(str) {
  const words$1 = words(str);
  let result = "";
  for (let i = 0; i < words$1.length; i++) {
    result += words$1[i].toUpperCase();
    if (i < words$1.length - 1) {
      result += " ";
    }
  }
  return result;
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/string/upperFirst.mjs
function upperFirst(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/util/attempt.mjs
function attempt(func) {
  try {
    return [null, func()];
  } catch (error) {
    return [error, null];
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/util/attemptAsync.mjs
async function attemptAsync(func) {
  try {
    const result = await func();
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

// node_modules/.pnpm/es-toolkit@1.45.1/node_modules/es-toolkit/dist/util/invariant.mjs
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (typeof message === "string") {
    throw new Error(message);
  }
  throw message;
}
export {
  AbortError,
  Mutex,
  Semaphore,
  TimeoutError,
  after,
  ary,
  invariant as assert,
  asyncNoop,
  at,
  attempt,
  attemptAsync,
  before,
  camelCase,
  capitalize,
  chunk,
  clamp,
  clone,
  cloneDeep,
  cloneDeepWith,
  compact,
  constantCase,
  countBy,
  curry,
  curryRight,
  debounce,
  deburr,
  delay,
  difference,
  differenceBy,
  differenceWith,
  drop,
  dropRight,
  dropRightWhile,
  dropWhile,
  escape,
  escapeRegExp,
  fill,
  filterAsync,
  findKey,
  flatMap,
  flatMapAsync,
  flatMapDeep,
  flatten,
  flattenDeep,
  flattenObject,
  flow,
  flowRight,
  forEachAsync,
  forEachRight,
  groupBy,
  head,
  identity,
  inRange,
  initial,
  intersection,
  intersectionBy,
  intersectionWith,
  invariant,
  invert,
  isArrayBuffer,
  isBlob,
  isBoolean,
  isBrowser,
  isBuffer,
  isDate,
  isEmptyObject,
  isEqual,
  isEqualWith,
  isError,
  isFile,
  isFunction,
  isJSON,
  isJSONArray,
  isJSONObject,
  isJSONValue,
  isLength,
  isMap,
  isNil,
  isNode,
  isNotNil,
  isNull,
  isNumber,
  isPlainObject,
  isPrimitive,
  isPromise,
  isRegExp,
  isSet,
  isString,
  isSubset,
  isSubsetWith,
  isSymbol2 as isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
  kebabCase,
  keyBy,
  last,
  limitAsync,
  lowerCase,
  lowerFirst,
  mapAsync,
  mapKeys,
  mapValues,
  maxBy,
  mean,
  meanBy,
  median,
  medianBy,
  memoize,
  merge,
  mergeWith,
  minBy,
  negate,
  noop,
  omit,
  omitBy,
  once,
  orderBy,
  pad,
  partial,
  partialRight,
  partition,
  pascalCase,
  pick,
  pickBy,
  pull,
  pullAt,
  random,
  randomInt,
  range,
  rangeRight,
  reduceAsync,
  remove,
  rest,
  retry,
  reverseString,
  round,
  sample,
  sampleSize,
  shuffle,
  snakeCase,
  sortBy,
  spread,
  startCase,
  sum,
  sumBy,
  tail,
  take,
  takeRight,
  takeRightWhile,
  takeWhile,
  throttle,
  timeout,
  toCamelCaseKeys,
  toFilled,
  toMerged,
  toSnakeCaseKeys,
  trim,
  trimEnd,
  trimStart,
  unary,
  unescape,
  union,
  unionBy,
  unionWith,
  uniq,
  uniqBy,
  uniqWith,
  unzip,
  unzipWith,
  upperCase,
  upperFirst,
  windowed,
  withTimeout,
  without,
  words,
  xor,
  xorBy,
  xorWith,
  zip,
  zipObject,
  zipWith
};
//# sourceMappingURL=es-toolkit.js.map
