---
title: '常见哈希算法(Hash Function)'
date: 2018-07-01T08:40:34Z
tags: ["hash"]

---

## 清单
- crc32 / crc64
- [fnv-1 / fnv-1a](http://isthe.com/chongo/tech/comp/fnv/)
- [djb2 / djb2a](http://www.cse.yorku.ca/~oz/hash.html) alias time33
- [cityhash](https://github.com/google/cityhash) by Google
- [java hash](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/String.html#hashCode())
- [murmur2 / murmur3](https://sites.google.com/site/murmurhash/) by Google
- [FarmHash](https://github.com/google/farmhash) by Google
- [One at a Time](https://en.wikipedia.org/wiki/Jenkins_hash_function) by Jenkins
- lookup3
- [SipHash](https://131002.net/siphash/)
- Fast Hash
- [SuperFastHash](https://dxr.mozilla.org/mozilla-central/source/security/sandbox/chromium/base/third_party/superfasthash/superfasthash.c)
- [xxHash](http://cyan4973.github.io/xxHash/)

## Benchmark
- [Hash functions: An empirical comparison](https://www.strchr.com/hash_functions)

## 参考资料
- [Which hashing algorithm is best for uniqueness and speed?](https://softwareengineering.stackexchange.com/a/145633)
- [A Hash Function for Hash Table Lookup](http://burtleburtle.net/bob/hash/doobs.html)
- [Hash functions](http://www.azillionmonkeys.com/qed/hash.html)
- [Hash Functions](http://www.cse.yorku.ca/~oz/hash.html)
- [List of hash functions](https://en.wikipedia.org/wiki/List_of_hash_functions)
- [Hash table](https://en.wikipedia.org/wiki/Hash_table#Choosing_a_hash_function)
- [常见的哈希算法和用途](http://blog.cyeam.com/hash/2018/05/28/hash-method)
- [如何设计并实现一个线程安全的 Map](https://halfrost.com/go_map_chapter_one/)