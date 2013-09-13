class Mangos::Mangos
  attr_reader :root_url_path
  attr_reader :root_path
  attr_reader :mangos_path

  def mangos_url
    pathname_to_url mangos_path
  end

  def assets_path
    mangos_path + "assets"
  end

  def assets_url
    pathname_to_url assets_path
  end

  def pathname_to_url(path)
    Addressable::URI.parse("/") + path.relative_path_from(root_url_path).to_s
  end

  def url_to_pathname(url)
    root_url_path + url.route_from(Addressable::URI.parse("/"))
  end

  def self.gem_path
    Pathname.new(__FILE__).dirname.parent.parent
  end
end
