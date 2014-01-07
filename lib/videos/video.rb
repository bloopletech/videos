class Videos::Video
  attr_reader :videos_package
  attr_reader :path

  def initialize(videos_package, path)
    @videos_package = videos_package
    @path = path
  end

  def path_hash
    Digest::SHA256.hexdigest(path.to_s)[0..16]
  end

  def url
    videos_package.pathname_to_url(path, videos_package.videos_path)
  end

  def title
    title = path.relative_path_from(videos_package.root_path).to_s
    title = title.chomp(path.extname.to_s)
    title = title.gsub("/", " / ")
    title
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

    temp_directory = "/tmp/videos_#{Process.pid}"
    FileUtils.mkdir_p(temp_directory)

    system("mpv --start=50% --frames=1 --ao=null --vo=image:outdir=#{temp_directory.shellescape} #{path.to_s.shellescape}")

    out_path = "00000001.jpg"

    img = Magick::Image.read("#{temp_directory}/#{out_path}").first

    p_width = PREVIEW_WIDTH
    p_height = PREVIEW_HEIGHT

    if (img.columns > img.rows) && img.columns > p_width && img.rows > p_height #if it's landscape-oriented
      img.crop!(Magick::CenterGravity, img.rows / (p_height / p_width.to_f), img.rows) #Resize it so the center part of the image is shown
    end

    img.change_geometry!("#{p_width}>") { |cols, rows, _img| _img.resize!(cols, rows) }

    img.page = Magick::Rectangle.new(img.columns, img.rows, 0, 0)
    img = img.extent(p_width, p_height, 0, 0)
    img.excerpt!(0, 0, p_width, p_height)

    img.write(thumbnail_path)
  rescue Exception => e
    puts "There was an error generating thumbnail: #{e.inspect}"
  ensure
    FileUtils.rm_rf(temp_directory) if temp_directory
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
