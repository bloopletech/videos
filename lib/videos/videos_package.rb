class Videos::Videos
  def initialize(root_path)
    raise "root_path must be an instance of Pathname" unless root_path.is_a?(Pathname)

    @root_path = root_path
    @videos_path = root_path + ".videos/"
  end

  def update
    videos_path.mkdir unless File.exists?(videos_path)
    update_app
    Videos::Update.new(self)
  end

  def update_app
    dev = ENV["VIDEOS_ENV"] == "development"

    app_children_paths.each do |file|
      videos_file = videos_path + file.basename
      FileUtils.rm_rf(videos_file, :verbose => dev)
    end

    if dev
      app_children_paths.each do |file|
        videos_file = videos_path + file.basename
        FileUtils.ln_sf(file, videos_file, :verbose => dev)
      end
    else
      FileUtils.cp_r(Videos::Videos.gem_path + "app/.", videos_path, :verbose => dev)
    end

    FileUtils.chmod_R(0755, videos_path, :verbose => dev)
  end

  def self.load_json(path)
    if File.exists?(path)
      JSON.parse(File.read(path))
    else
      nil
    end
  end

  def self.save_json(path, data)
    File.open(path, "w") { |f| f << data.to_json }
  end

  private
  def app_children_paths
    app_path = Videos::Videos.gem_path + "app/"
    app_path.children.reject { |f| f.basename.to_s == "img"} #TODO: Deal with this directory properly
  end
end
