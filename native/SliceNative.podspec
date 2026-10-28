require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'SliceNative'
  s.module_name = 'SliceNative'
  s.version = package['version']
  s.summary = package['description']
  s.homepage = 'https://github.com/uris/slice'
  s.license = package['license']
  s.authors = package['author']
  s.source = { :git => 'https://github.com/uris/slice.git', :tag => "native-v#{s.version}" }
  s.platforms = { :ios => min_ios_version_supported }
  s.swift_version = '5.0'
  s.requires_arc = true
  s.source_files = 'platform/ios/**/*.{h,m,mm,swift}'
  s.resource_bundles = {
    'SliceNativeColors' => ['platform/ios/Resources/SliceColors.xcassets'],
    'SliceNativeIcons' => ['platform/ios/Resources/SliceIcons.xcassets']
  }
  # Keep C++ React headers out of the module imported by the Swift compiler.
  s.private_header_files = 'platform/ios/RCT*View.h', 'platform/ios/SliceDeviceCapabilities.h'
  s.frameworks = 'UIKit'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }

  install_modules_dependencies(s)
end
