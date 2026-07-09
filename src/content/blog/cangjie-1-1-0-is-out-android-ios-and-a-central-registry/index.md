---
title: "Cangjie 1.1.0 Is Out: Android, iOS, and a Central Registry"
description: "Cangjie 1.1.0 brings cross-platform runtime support for Android and iOS, a central package registry, cross-platform language syntax, and major toolchain and standard library improvements."
date: "05/05/2026"
authors:
  - "Cangjie UK Team"
tags:
  - "Cangjie"
  - "Ecosystem"
descriptionImage: "./figures/cangjie-1-1-0-release.png"
---

# Cangjie 1.1.0 Is Out: Android, iOS, and a Central Registry

Cangjie 1.1.0 landed on April 25 2026, stepping beyond HarmonyOS and onto every major mobile platform. It is the first release under the STS 1.1 track, with a six-month maintenance window. Here is what is new.

## Cross-Platform Runtime

The headline addition is cross-platform runtime support. Cangjie code now runs on Android (aarch64, minimum API 26 / Android 8) and iOS (arm64, arm64 simulator, x86_64 simulator), alongside the newly added HarmonyOS arm32 target. The compiler ships matching cross-compilation pipelines for both mobile platforms, and cjdb (the Cangjie debugger) supports on-device debugging for Android and iOS out of the box.

## Language Changes

On the language side, 1.1.0 introduces `common`/`specific` syntax for cross-platform abstraction. The idea is straightforward: shared logic lives in a `common` block; platform-specific implementations go in `specific` blocks. It is marked experimental for now. A new organization name syntax is also in, affecting how packages declare and reference their namespaces.

## Central Registry

The other major feature is 中心仓, a central package registry for the Cangjie ecosystem. cjpm (the package manager) now handles artifact publishing, downloading, index resolution, and dependency solving against this registry. IDE plugin support follows: the tooling recognizes central registry packages and integrates them into the existing project workflow. This is the infrastructure piece that makes third-party library sharing practical at scale.

## Toolchain and Standard Library

Two toolchain items worth noting. HLE ships for the first time: it generates interop glue code from ArkTS or C header files, reducing the manual work involved in bridging Cangjie with existing native and ArkTS APIs. On the stdlib side, `std.core` gains `exclusiveScope` for binding to OS threads, exception chaining via `causedBy`, and `refEq` overloading for functions. `std.reflect` now covers structs, functions, lambdas, and tuples.

## Upgrade Note

The team recommends a full recompile after upgrading. The exception chain feature adds a private field to `Exception`, and the reflect expansion adds one to `TypeInfo`. Incremental builds from earlier versions will not account for these layout changes.

If you have been looking for a reason to try Cangjie, this release is a good place to start.

More information on: [https://cangjie-lang.cn/en](https://cangjie-lang.cn/en)
