# -*- encoding: utf-8 -*-
require File.expand_path("../lib/mangos/version", __FILE__)

Gem::Specification.new do |s|
  s.name        = "mangos"
  s.version     = Mangos::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ['Brenton "B-Train" Fletcher']
  s.email       = ["i@bloople.net"]
  s.homepage    = "http://github.com/bloopletech/mangos"
  s.summary     = "Mangos indexes a collection of manga or comis and generates a SPA that browses the collection."
  s.description = "A collection of manga or comics is a directory (the container) containing 1..* directories (books), each directory containing 1..* image files (pages). Mangos indexes a collection in this format, and generates a HTML/JS Single Page Application (SPA) that allows you to browse and view manga/comics in your collection. The SPA UI is much easier to use than using a filesystem browser or normal image viewer; and the SPA, along with the collection can be trivially served over a network by putting the collection and the SPA in a directory served by nginx or Apache."

  s.required_rubygems_version = ">= 1.3.6"
  s.rubyforge_project         = "mangos"

  s.add_development_dependency "bundler", ">= 1.0.0"
  s.add_dependency "addressable", ">= 2.3.5"
  s.add_dependency "naturally", ">= 1.0.3"
  s.add_dependency "rmagick", ">= 2.13.1"

  s.files        = `git ls-files`.split("\n")
  s.executables  = `git ls-files`.split("\n").map{|f| f =~ /^bin\/(.*)/ ? $1 : nil}.compact
  s.require_path = 'lib'
end
