class Mangos::Mangos
  def initialize(root_path)
    raise "root_path must be an instance of Pathname" unless root_path.is_a?(Pathname)

    @root_path = root_path
    @mangos_path = root_path + ".mangos/"
  end

  def update
    update_app
    Mangos::Update.new(self)
  end

  def install
    mangos_path.mkdir unless File.exists?(mangos_path)

    update_app
  end

  def update_app
    dev = ENV["MANGOS_ENV"] == "development"

    app_children_paths.each do |file|
      mangos_file = mangos_path + file.basename
      FileUtils.rm_rf(mangos_file, :verbose => dev)
    end

    if dev
      app_children_paths.each do |file|
        mangos_file = mangos_path + file.basename
        FileUtils.ln_sf(file, mangos_file, :verbose => dev)
      end
    else
      FileUtils.cp_r(Mangos::Mangos.gem_path + "app/.", mangos_path, :verbose => dev)
    end

    FileUtils.chmod_R(0755, mangos_path, :verbose => dev)
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
    app_path = Mangos::Mangos.gem_path + "app/"
    app_path.children.reject { |f| f.basename.to_s == "img"} #TODO: Deal with this directory properly
  end
end
