class Mangos::Book
  attr_reader :mangos
  attr_accessor :path

  def initialize(mangos)
    @mangos = mangos
  end

  def url
    mangos.pathname_to_url(path)
  end

  def page_paths
    path.children.reject { |p| p.basename.to_s[0..0] == '.' }.sort_by { |p| Naturally.normalize(p.basename) }
  end

  def page_urls
    page_paths.map { |p| mangos.pathname_to_url(p) }
  end

  def title
    path.basename.to_s
  end

  def self.from_hash(mangos, data)
    book = Mangos::Book.new(mangos)
    book.path = mangos.url_to_pathname(Addressable::URI.parse(data["url"]))
    book
  end

  def to_hash
    {
      "url" => url,
      "page_urls" => page_urls,
      "pages" => page_urls.length,
      "title" => title,
      "published_on" => path.mtime
    }
  end
end
