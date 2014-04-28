#Ruby stdlib
require "pathname"
require "fileutils"
require "uri"
require "json"
require "digest"
require "shellwords"

#Gems
require "addressable/uri"
require "naturally"
require "RMagick"
require "nokogiri"

#Core Extensions
require "videos/core_ext/pathname"

module Videos
end

require "videos/videos"
require "videos/videos_package"
require "videos/update"
require "videos/video"
