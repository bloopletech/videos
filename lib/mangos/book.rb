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

  def thumbnail_path
    mangos.mangos_path + "img/thumbnails/" + "#{path.basename}.jpg"
  end

  def thumbnail_url
    mangos.pathname_to_url(thumbnail_path)
  end

  PREVIEW_WIDTH = 211
  PREVIEW_HEIGHT = 332

  PREVIEW_SMALL_WIDTH = 98
  PREVIEW_SMALL_HEIGHT = 154

  def generate_thumbnail
    img = Magick::Image.read(page_paths.first).first

    p_width = PREVIEW_WIDTH
    p_height = PREVIEW_HEIGHT

    if (img.columns > img.rows) && img.columns > p_width && img.rows > p_height #if it's landscape-oriented
      img.crop!(Magick::EastGravity, img.rows / (p_height / p_width.to_f), img.rows) #Resize it so the right-most part of the image is shown
    end

    img.change_geometry!("#{p_width}>") { |cols, rows, _img| _img.resize!(cols, rows) }

    img.page = Magick::Rectangle.new(img.columns, img.rows, 0, 0)
    img = img.extent(p_width, p_height, 0, 0)
    img.excerpt!(0, 0, p_width, p_height)

    img.write(thumbnail_path)
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
      "published_on" => path.mtime,
      "thumbnail_url" => thumbnail_url
    }
  end
end
