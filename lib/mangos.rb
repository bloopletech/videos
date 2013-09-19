#Ruby stdlib
require "pathname"
require "fileutils"
require "uri"
require "json"
require "digest"

#Gems
require "addressable/uri"
require "haml"
require "naturally"
require "RMagick"

#Core Extensions
require "mangos/core_ext/pathname"

module Mangos
end

require "mangos/mangos"
require "mangos/mangos_package"
require "mangos/update"
require "mangos/book"
require "mangos/template_helper"
