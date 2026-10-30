#!/bin/bash

# Copy CSS files to dist
mkdir dist/css
cp src/utils/styling/flexBox.module.css dist/css/flexBox.module.css
cp src/utils/styling/type.module.css dist/css/type.module.css

echo "CSS module files copied to dist/"
