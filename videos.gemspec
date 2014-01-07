# -*- encoding: utf-8 -*-
require File.expand_path("../lib/videos/version", __FILE__)

Gem::Specification.new do |s|
  s.name        = "videos"
  s.version     = Videos::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ['Brenton "B-Train" Fletcher']
  s.email       = ["i@bloople.net"]
  s.homepage    = "http://github.com/bloopletech/videos"
  s.summary     = "Videos indexes a collection of videos and creates a SPA that browses the collection."
  s.description = "A collection of videos is a directory (the container) containing both video files and directories that have video files in them. Videos indexes a collection in this format, and generates a HTML/JS Single Page Application (SPA) that allows you to browse and view videos in your collection. The SPA UI is much easier to use than using a filesystem browser; and the SPA, along with the collection can be trivially served over a network by putting the collection and the SPA in a directory served by nginx or Apache."

  s.required_rubygems_version = ">= 1.3.6"
  s.rubyforge_project         = "videos"

  s.add_development_dependency "bundler", ">= 1.0.0"
  s.add_dependency "addressable", ">= 2.3.5"
  s.add_dependency "naturally", ">= 1.0.3"
  s.add_dependency "rmagick", ">= 2.13.1"

  s.files        = `git ls-files`.split("\n")
  s.executables  = `git ls-files`.split("\n").map{|f| f =~ /^bin\/(.*)/ ? $1 : nil}.compact
  s.require_path = 'lib'
end
