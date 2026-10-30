#!/bin/bash

set -euo pipefail

# Resolve the package directory independently of the caller's working directory.
package_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$package_dir"

shopt -s nullglob

tarballs=(./*.tgz)

if [ ${#tarballs[@]} -eq 0 ]; then
	echo "No Slice package tarballs found."
	exit 0
fi

# Keep archives inside this workspace.
mkdir -p pack
mv "${tarballs[@]}" pack/

echo "npm tarballs moved to $package_dir/pack/"
