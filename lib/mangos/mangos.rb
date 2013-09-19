class Mangos::Mangos
  attr_reader :root_path
  attr_reader :mangos_path

  def pathname_to_url(path, relative_from)
    URI.escape(path.relative_path_from(relative_from).to_s)
  end

  def url_to_pathname(url)
    path = Addressable::URI.unencode_component(url.normalized_path)
    path.gsub!(/^\//, "") #Make relative, if we allow mounting at a different root URL this will need to remove the root instead of just '/'
    root_url_path + path
  end

  def self.gem_path
    Pathname.new(__FILE__).dirname.parent.parent
  end
end
