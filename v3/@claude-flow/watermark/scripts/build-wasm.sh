#!/usr/bin/env bash
# Regenerate the WASM bindings from the sentient-watermark Rust crate: the Node
# (CommonJS) build in ./wasm and the browser/Deno (ESM) build in ./web.
#
# Requires: rustup + wasm32-unknown-unknown target + wasm-pack.
#   rustup target add wasm32-unknown-unknown
#   cargo install wasm-pack
#
# RUSTFLAGS is cleared for the wasm target because a machine-global
# `-C link-arg=-fuse-ld=mold` (if present) is rejected by wasm's rust-lld.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
crate="$here/../../crates/sentient-watermark"

build() { # <target> <out-dir>
  CARGO_TARGET_WASM32_UNKNOWN_UNKNOWN_RUSTFLAGS="" RUSTFLAGS="" \
    wasm-pack build --release --target "$1" \
      --out-dir "$crate/$2" --out-name sentient_watermark \
      "$crate" -- --features wasm
}

files=(sentient_watermark.js sentient_watermark_bg.wasm sentient_watermark.d.ts sentient_watermark_bg.wasm.d.ts)

build nodejs pkg-nodejs
for f in "${files[@]}"; do cp "$crate/pkg-nodejs/$f" "$here/wasm/"; done

build web pkg-web
for f in "${files[@]}"; do cp "$crate/pkg-web/$f" "$here/web/"; done

echo "Rebuilt wasm/ (nodejs) and web/ (browser) from $crate"
