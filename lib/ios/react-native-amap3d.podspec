require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../../package.json')))

Pod::Spec.new do |s|
  s.name         = 'react-native-amap3d'
  s.version      = '1.0.0'
  s.summary      = package['description']

  s.authors      = { "Qiu Xiang" => "i@7c00.cc" }
  s.homepage     = package['repository']['url']
  s.license      = package['license']
  s.platform     = :ios, "8.0"

  s.source       = { :git => package['repository']['url'] }
  s.source_files = '**/*.{h,m}'

  s.dependency 'React'
  s.dependency 'AMap3DMap', "~> 6.1.0"
end
