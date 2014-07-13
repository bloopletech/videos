class Videos::Video
  attr_reader :package
  attr_reader :path
  attr_reader :metadata
  attr_accessor :length

  def initialize(package, path)
    @package = package
    @path = path
    @metadata = {}
  end

  def path_hash
    Digest::SHA256.hexdigest(path.to_s)[0..16]
  end

  def url
    package.pathname_to_url(path, package.app_path)
  end

  def title
    title = path.relative_path_from(package.path).to_s
    title = title.chomp(path.extname.to_s)
    title = title.gsub("/", " / ")
    title
  end

  def thumbnail_path
    package.app_path + "img/thumbnails/" + "#{path_hash}.jpg"
  end

  def thumbnail_url
    package.pathname_to_url(thumbnail_path, package.app_path)
  end

  #PREVIEW_WIDTH = 211
  #PREVIEW_HEIGHT = 332
  PREVIEW_WIDTH = 274
  PREVIEW_HEIGHT = 155

  PREVIEW_SMALL_WIDTH = 98
  PREVIEW_SMALL_HEIGHT = 154

  def generate_thumbnail
    return if thumbnail_path.exist?

    temp_directory = "/tmp/videos_#{Process.pid}"
    FileUtils.mkdir_p(temp_directory)

    system("mpv --really-quiet --start=50% --frames=1 --ao=null --vo=image:outdir=#{temp_directory.shellescape} #{path.to_s.shellescape}")

    out_path = "00000001.jpg"

    img = Magick::Image.read("#{temp_directory}/#{out_path}").first

    p_width = PREVIEW_WIDTH
    p_height = PREVIEW_HEIGHT

    img.resize_to_fill!(p_width, p_height)

    img.page = Magick::Rectangle.new(img.columns, img.rows, 0, 0)
    img = img.extent(p_width, p_height, 0, 0)
    img.excerpt!(0, 0, p_width, p_height)

    img.write(thumbnail_path)
  rescue Exception => e
    puts "There was an error generating thumbnail: #{e.inspect}"
  ensure
    FileUtils.rm_rf(temp_directory) if temp_directory
  end

  def get_metadata
    return unless metadata.keys.empty?

    output = `mediainfo -f --Output=XML #{path.to_s.shellescape}`
    doc = Nokogiri::XML.parse(output)
    @metadata["length"] = (e = doc.search("File Duration").first) ? e.text.to_i : 0
    @metadata["width"] = (e = doc.search("File Width").first) ? e.text.to_i : 0
    @metadata["height"] = (e = doc.search("File Height").first) ? e.text.to_i : 0
  end

  def self.from_hash(package, data)
    video = Videos::Video.new(package, package.url_to_pathname(Addressable::URI.parse(data["url"])))
    video.length = data["length"]
    video
  end

  def to_hash
    {
      "url" => url,
      "title" => title,
      "publishedOn" => path.mtime.to_i,
      "thumbnailUrl" => thumbnail_url,
      "length" => (metadata["length"] / 1000.0).round,
      "width" => metadata["width"],
      "height" => metadata["height"],
      "resolution" => approx_resolution,
      "key" => path_hash
    }
  end

  private
  def approx_resolution
    if metadata["width"] == 1920 && metadata["height"] == 1080
      "1080p"
    elsif
      metadata["width"] == 1280 && metadata["height"] == 720
      "720p"
    else
      "#{metadata["width"]}x#{metadata["height"]}"
    end
  end
end
