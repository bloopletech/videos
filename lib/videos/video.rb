class Videos::Video
  attr_reader :videos_package
  attr_accessor :path

  def initialize(videos_package)
    @videos = videos_package
  end

  def path_hash
    Digest::SHA256.hexdigest(path.to_s)[0..16]
  end

  def url
    videos_package.pathname_to_url(path, videos_package.videos_path)
  end

  def title
    path.basename.to_s
  end

  def thumbnail_path
    videos_package.videos_path + "img/thumbnails/" + "#{path_hash}.jpg"
  end

  def thumbnail_url
    videos_package.pathname_to_url(thumbnail_path, videos_package.videos_path)
  end

  #PREVIEW_WIDTH = 211
  #PREVIEW_HEIGHT = 332
  PREVIEW_WIDTH = 197
  PREVIEW_HEIGHT = 310

  PREVIEW_SMALL_WIDTH = 98
  PREVIEW_SMALL_HEIGHT = 154

  def generate_thumbnail
    return if thumbnail_path.exist?

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
  rescue Exception => e
    puts "There was an error generating thumbnail: #{e.inspect}"
  end

  def self.from_hash(videos_package, data)
    video = Videos::Video.new(videos_package)
    video.path = videos_package.url_to_pathname(Addressable::URI.parse(data["url"]))
    video
  end

  def to_hash
    {
      "url" => url,
      "title" => title,
      "publishedOn" => path.mtime.to_i,
      "thumbnailUrl" => thumbnail_url,
      "key" => path_hash
    }
  end
end
