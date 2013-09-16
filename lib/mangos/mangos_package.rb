class Mangos::Mangos
  def initialize(mangos_path)
    config = Mangos::Mangos.load_json(mangos_path + "config.json")

    @root_url_path = Pathname.new(config["root_url_path"])
    @root_path = @root_url_path + Pathname.new(config["root_path"])
    @mangos_path = mangos_path.realpath
  end

  def update
    Mangos::Mangos.update_app(mangos_path)
    Mangos::Update.new(self)
  end

  def self.install(root_url_path, root_path, mangos_path)
    raise "root_url_path (first argument) must be an instance of Pathname" unless root_url_path.is_a?(Pathname)
    raise "root_path (second argument) must be an instance of Pathname" unless root_path.is_a?(Pathname)
    raise "mangos_path (third argument) must be an instance of Pathname" unless mangos_path.is_a?(Pathname)

    mangos_path.mkdir unless File.exists?(mangos_path)

    config = {
      "root_url_path" => root_url_path.to_s,
      "root_path" => root_path.relative_path_from(root_url_path).to_s
    }
    save_json(mangos_path + "config.json", config)

    update_app(mangos_path)
  end

  #TODO: Move to instance method
  def self.update_app(mangos_path)
    FileUtils.cp_r(gem_path + "app/.", mangos_path)
    FileUtils.chmod_R(0755, mangos_path)
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
end
