class Videos::Update
  attr_reader :videos_package
  attr_accessor :videos

  def initialize(videos_package)
    @videos_package = videos_package

    @files = videos_package.root_path.descendant_files.reject { |p| p.basename.to_s[0..0] == '.' }
    @videos = []
    #load_data
    process
    save_data
    puts "\nDone!"
  end

  def load_data
    self.videos = (Videos::Videos.load_json(videos_package.videos_path + "data.json") || []).map { |b| Videos::Video.from_hash(videos_package, b) }
  end

  def save_data
    puts "\nWriting out JSON file"
    videos_hashes = []
    videos.each_with_index do |b, i|
      $stdout.write "\rProcessing #{i + 1} of #{videos.length} (#{(((i + 1) / videos.length.to_f) * 100.0).round}%)"
      $stdout.flush

      videos_hashes << b.to_hash
    end
    Videos::Videos.save_json(videos_package.videos_path + "data.json", videos_hashes)
  end

  def process
    puts "\nLoading videos"
    @files.each_with_index do |f, i|
      $stdout.write "\rProcessing #{i + 1} of #{@files.length} (#{(((i + 1) / @files.length.to_f) * 100.0).round}%)"
      $stdout.flush

      #video = videos.find { |v| v.path.to_s == f.to_s }

      #if video
      #  updated video
      #else
        created f
      #end
    end
    #handle deleted first
    #@directories.each do |d|
    #  puts "d: #{d.inspect}"
    #  video = videos.find { |b| b.path == d }
    #  if video
    #    updated(video)
    #  else
    #    created(d)
    #  end
    #end
  end

  def deleted
    #
  end

  def created(f)
    video = Videos::Video.new(videos_package, f)
    video.generate_thumbnail
    video.get_metadata
    videos << video
  end

  def updated(video)
    video.generate_thumbnail
    video.get_metadata
  end
end
